/*
 * Assistant provider chain.
 *
 * Extracted from repository.ts so the OpenAI -> Gemini ->
 * deterministic fallback order is testable without a database, and so
 * provider concerns (host allow-listing, payload validation, timeouts)
 * live in one place rather than inside the persistence layer.
 */

export type AiProviderName = "openai" | "gemini" | "fallback";

export interface AssistantInsightResult {
  summary: string;
  actionItems: readonly string[];
  evidence: readonly { source: string; reference: string }[];
}

export interface AiPromptInput {
  intent: string;
  question: string;
  workspaceContext: Record<string, unknown>;
}

export const ASSISTANT_SYSTEM_PROMPT =
  "You are Evantra Workspace Assistant. Give concise, practical, " +
  "evidence-grounded guidance. Never invent facts. Return JSON with " +
  "summary (string), actionItems (array of max 5 strings), and evidence " +
  "(array of objects with source and reference). Use only the supplied " +
  "workspace context.";

/**
 * Validates a provider's raw JSON into an AssistantInsightResult.
 * Both providers are untrusted: a model may return prose, a partial
 * object, or the wrong types. Anything that does not match the shape is
 * rejected so the caller can move to the next provider rather than
 * rendering a malformed insight.
 */
export function parseInsight(raw: unknown): AssistantInsightResult | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;

  const parsed = raw as Partial<AssistantInsightResult>;

  if (
    typeof parsed.summary !== "string" ||
    !Array.isArray(parsed.actionItems) ||
    !Array.isArray(parsed.evidence)
  ) {
    return undefined;
  }

  return {
    summary: parsed.summary,
    actionItems: parsed.actionItems
      .filter((item): item is string => typeof item === "string")
      .slice(0, 5),
    evidence: parsed.evidence
      .filter(
        (item) =>
          item &&
          typeof item.source === "string" &&
          typeof item.reference === "string",
      )
      .slice(0, 10),
  };
}

/**
 * Host allow-list check. Stops an operator-set base URL from silently
 * pointing a provider at an unexpected host.
 */
export function isAllowedProviderHost(
  baseUrl: string,
  envAllowed: string | undefined,
  defaultHost: string,
): boolean {
  let host: string;

  try {
    host = new URL(baseUrl).hostname.toLowerCase();
  } catch {
    return false;
  }

  const allowed = (envAllowed ?? defaultHost)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(host);
}

/** OpenAI Chat Completions (JSON mode). */
export async function queryOpenAi(
  input: AiPromptInput,
  env: NodeJS.ProcessEnv = process.env,
): Promise<AssistantInsightResult | undefined> {
  const apiKey = env.OPENAI_API_KEY?.trim();
  if (!apiKey) return undefined;

  const baseUrl = (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );

  if (
    !isAllowedProviderHost(
      baseUrl,
      env.EVANTRA_AI_ALLOWED_HOSTS,
      "api.openai.com",
    )
  ) {
    return undefined;
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
        {
          role: "user",
          content: JSON.stringify({
            intent: input.intent,
            question: input.question,
            workspaceContext: input.workspaceContext,
          }),
        },
      ],
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) return undefined;

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) return undefined;

  try {
    return parseInsight(JSON.parse(content));
  } catch {
    return undefined;
  }
}

/**
 * Google Gemini generateContent.
 *
 * Gemini takes JSON mode via responseMimeType rather than a
 * response_format field, and returns text in
 * candidates[0].content.parts[]. The system prompt goes in
 * systemInstruction, the supported equivalent of OpenAI's system role.
 */
export async function queryGemini(
  input: AiPromptInput,
  env: NodeJS.ProcessEnv = process.env,
): Promise<AssistantInsightResult | undefined> {
  const apiKey = env.GEMINI_API_KEY?.trim() ?? env.GOOGLE_API_KEY?.trim();
  if (!apiKey) return undefined;

  const baseUrl = (
    env.GEMINI_BASE_URL ?? "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "");

  if (
    !isAllowedProviderHost(
      baseUrl,
      env.EVANTRA_GEMINI_ALLOWED_HOSTS,
      "generativelanguage.googleapis.com",
    )
  ) {
    return undefined;
  }

  const model = env.GEMINI_MODEL ?? "gemini-2.0-flash";

  const response = await fetch(
    `${baseUrl}/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ASSISTANT_SYSTEM_PROMPT }] },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: JSON.stringify({
                  intent: input.intent,
                  question: input.question,
                  workspaceContext: input.workspaceContext,
                }),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(20000),
    },
  );

  if (!response.ok) return undefined;

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("");

  if (!content) return undefined;

  try {
    return parseInsight(JSON.parse(content));
  } catch {
    return undefined;
  }
}

export interface ProviderChainResult {
  provider: AiProviderName;
  insight: AssistantInsightResult;
  /** Providers attempted, in order, for observability. */
  attempted: readonly AiProviderName[];
}

/**
 * Resolves an insight through the provider chain.
 *
 * Order is configurable via EVANTRA_AI_PROVIDER_ORDER (default
 * "openai,gemini"). The first provider returning a valid insight wins.
 * If every provider is unconfigured, disabled, unreachable, times out,
 * or returns an unusable payload, the deterministic fallback is
 * returned — so the assistant always answers, and `provider` always
 * reports which path was used.
 *
 * AI is off unless EVANTRA_AI_ENABLED === "true", keeping the default
 * deployment deterministic and cost-free.
 */
export async function resolveInsightWithProviders(
  input: AiPromptInput,
  fallback: AssistantInsightResult,
  env: NodeJS.ProcessEnv = process.env,
): Promise<ProviderChainResult> {
  if (env.EVANTRA_AI_ENABLED !== "true") {
    return { provider: "fallback", insight: fallback, attempted: [] };
  }

  const order = (env.EVANTRA_AI_PROVIDER_ORDER ?? "openai,gemini")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const handlers: Record<
    string,
    () => Promise<AssistantInsightResult | undefined>
  > = {
    openai: () => queryOpenAi(input, env),
    gemini: () => queryGemini(input, env),
  };

  const attempted: AiProviderName[] = [];

  for (const name of order) {
    const handler = handlers[name];
    if (!handler) continue;

    attempted.push(name as AiProviderName);

    try {
      const insight = await handler();
      if (insight) {
        return { provider: name as AiProviderName, insight, attempted };
      }
    } catch {
      // Provider threw (network, timeout, parse). Try the next one.
    }
  }

  return { provider: "fallback", insight: fallback, attempted };
}