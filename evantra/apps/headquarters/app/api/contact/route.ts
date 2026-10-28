import { siteConfig } from "@/lib/site";

const inquiryTypes = new Set([
  "business",
  "technology",
  "research",
  "general",
]);
const inquiryLabels: Record<string, string> = {
  business: "Business & Partnerships",
  technology: "Technology & Engineering",
  research: "Research & Innovation",
  general: "General Inquiry",
};

function cleanField(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > 20_000) {
    return Response.json({ error: "The message is too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsedBody: unknown = JSON.parse(rawBody);
    if (
      !parsedBody ||
      typeof parsedBody !== "object" ||
      Array.isArray(parsedBody)
    ) {
      return Response.json({ error: "Invalid form submission." }, { status: 400 });
    }
    body = parsedBody as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // Silently accept bot submissions caught by the form's honeypot.
  if (cleanField(body.website, 200)) {
    return Response.json({ ok: true });
  }

  const firstName = cleanField(body.firstName, 80);
  const lastName = cleanField(body.lastName, 80);
  const email = cleanField(body.email, 254);
  const organization = cleanField(body.organization, 160);
  const inquiryType = cleanField(body.inquiryType, 30);
  const message = cleanField(body.message, 5_000);

  if (
    !firstName ||
    !lastName ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !inquiryTypes.has(inquiryType) ||
    message.length < 10
  ) {
    return Response.json(
      { error: "Please check the required fields and try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return Response.json(
      { error: "The contact form is temporarily unavailable. Please email us directly." },
      { status: 503 },
    );
  }

  const from =
    process.env.EVANTRA_EMAIL_FROM?.trim() ||
    "Evantra Website <website@evantradebuckman.com>";
  const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;
  const fullName = `${firstName} ${lastName}`;
  const inquiryLabel = inquiryLabels[inquiryType];

  const text = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Organization: ${organization || "Not provided"}`,
    `Inquiry type: ${inquiryLabel}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Website inquiry: ${inquiryLabel}`,
        text,
      }),
    });

    if (!resendResponse.ok) {
      return Response.json(
        { error: "We couldn't send your message. Please try again or email us directly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "We couldn't send your message. Please try again or email us directly." },
      { status: 502 },
    );
  }
}
