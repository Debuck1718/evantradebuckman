import { NextRequest, NextResponse } from "next/server";


export async function GET(): Promise<NextResponse> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EVANTRA_EMAIL_FROM?.trim();

  const configured = Boolean(apiKey && from);

  return NextResponse.json(
    {
      configured,
      hasApiKey: Boolean(apiKey),
      apiKeyLooksValid: apiKey?.startsWith("re_") ?? false,
      from: from ?? null,
      fromLooksValid: from?.includes("@") ?? false,
      runtime: process.env.NODE_ENV ?? "unknown",
      service: "identity-web",
      hint: configured
        ? "Security alert email is available on this service."
        : "Security alerts run in identity-web, which needs its own RESEND_API_KEY and EVANTRA_EMAIL_FROM. Setting them on the identity API (Render) does not reach this service.",
    },
    {
      status: configured ? 200 : 503,
      headers: { "cache-control": "no-store" },
    },
  );
}