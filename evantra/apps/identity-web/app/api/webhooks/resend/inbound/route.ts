import { createHmac, timingSafeEqual } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import {
  supportDatabase,
} from "../../../workspace/_support_db";

/**
 * Verify the Svix signature that
 * Resend signs every webhook with
 * (svix-id, svix-timestamp, svix-signature headers).
 * Secret is the "whsec_..." from the
 * Resend dashboard webhook settings.
 */
function verifySvixSignature(
  id: string,
  timestamp: string,
  payload: string,
  signatureHeader: string,
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RESEND_WEBHOOK_SECRET is not set");

    return false;
  }

  const parts = signatureHeader.split(" ").filter(Boolean);

  const secretKey = secret.replace(/^whsec_/, "");

  const expected = parts.map((version) =>
    createHmac("sha256", Buffer.from(secretKey, "base64"))
      .update(`${id}.${timestamp}.${payload}`)
      .digest("base64"),
  );

  return expected.some((expectedSignature) =>
    parts.some((part) => {
      const given = part.split(",")[1];

      if (!given) return false;

      try {
        return timingSafeEqual(
          Buffer.from(given),
          Buffer.from(expectedSignature),
        );
      } catch {
        return false;
      }
    }),
  );
}

/**
 * Resend "email.received" webhook.
 * Persists the inbound email so it
 * can be displayed on the admin
 * dashboard inbox.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const rawBody = await request.text();

    const id = request.headers.get("svix-id") ?? "";
    const timestamp = request.headers.get("svix-timestamp") ?? "";
    const signature = request.headers.get("svix-signature") ?? "";

    if (
      !id ||
      !timestamp ||
      !signature ||
      !verifySvixSignature(id, timestamp, rawBody, signature)
    ) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 },
      );
    }

    const event = JSON.parse(rawBody) as {
      type?: string;
      data?: {
        message_id?: string;
        from?: string;
        to?: string | string[];
        subject?: string;
        text?: string;
        html?: string;
        created_at?: string;
      };
    };

    if (event.type !== "email.received" || !event.data) {
      return NextResponse.json({ received: true });
    }

    const fromMatch =
      /^"?([^"]*)"?\s*<([^>]+)>$/.exec(event.data.from ?? "") ?? null;

    const fromEmail = fromMatch
      ? fromMatch[2]
      : event.data.from ?? "unknown";
    const fromName = fromMatch ? fromMatch[1] || null : null;

    const toRaw = Array.isArray(event.data.to)
      ? event.data.to[0]
      : event.data.to;

    const toEmail = toRaw ?? "unknown";

    await supportDatabase.query(
      `INSERT INTO workspace.inbound_emails
         (message_id, from_email, from_name, to_email, subject, body_text, body_html, received_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, NOW()))`,
      [
        event.data.message_id ?? null,
        fromEmail,
        fromName,
        toEmail,
        event.data.subject ?? null,
        event.data.text ?? null,
        event.data.html ?? null,
        event.data.created_at ?? null,
      ],
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Inbound webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
