import { NextRequest, NextResponse } from "next/server";

import {
  requireAuthenticatedAccount,
  workspaceErrorResponse,
} from "../_store";
import {
  createVaultItem,
  deleteVaultItem,
  listVaultItems,
  touchVaultItem,
  type VaultCategory,
} from "../repository";
import { isVaultConfigured } from "../_vault-crypto";
import { vaultRequestSchema } from "../validation";

const ALLOWED_CATEGORIES: readonly VaultCategory[] = [
  "certificate",
  "cv",
  "id-record",
  "contract",
  "receipt",
  "project-doc",
  "academic-record",
  "business-doc",
  "other",
];

/*
 * Vault routes.
 *
 * GET  /api/workspace/vault          list items (decrypted)
 * POST /api/workspace/vault          create an item (encrypted at rest)
 * DELETE /api/workspace/vault?id=... remove an item
 *
 * Encryption happens in the repository via _vault-crypto, so the
 * plaintext body only ever exists in this process's memory and in
 * the JSON response to the authenticated owner.
 */

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isVaultConfigured()) {
      return NextResponse.json(
        {
          error:
            "Vault encryption is not configured. Set VAULT_MASTER_KEY on the " +
            "identity-web service, then redeploy.",
        },
        { status: 503 },
      );
    }

    const accountId = await requireAuthenticatedAccount(request);
    const items = await listVaultItems(accountId);

    return NextResponse.json({ items });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to load vault items.");
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isVaultConfigured()) {
      return NextResponse.json(
        {
          error:
            "Vault encryption is not configured. Set VAULT_MASTER_KEY on the " +
            "identity-web service, then redeploy.",
        },
        { status: 503 },
      );
    }

    const accountId = await requireAuthenticatedAccount(request);

    const parsed = vaultRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid vault request." },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    if (!ALLOWED_CATEGORIES.includes(payload.category as VaultCategory)) {
      return NextResponse.json(
        { error: `Unsupported vault category '${payload.category}'.` },
        { status: 400 },
      );
    }

    const item = await createVaultItem(accountId, {
      category: payload.category as VaultCategory,
      title: payload.title,
      content: payload.content,
      tags: payload.tags,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to save the vault item.");
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);
    const itemId = request.nextUrl.searchParams.get("id")?.trim();

    if (!itemId) {
      return NextResponse.json(
        { error: "A vault item id is required." },
        { status: 400 },
      );
    }

    const removed = await deleteVaultItem(accountId, itemId);

    if (!removed) {
      return NextResponse.json(
        { error: "Vault item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to delete the vault item.");
  }
}

/*
 * Mark an item as accessed. Separate from GET so listing the vault
 * does not stamp every record as recently opened.
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const accountId = await requireAuthenticatedAccount(request);

    const body = (await request.json().catch(() => ({}))) as {
      id?: string;
    };

    const itemId = body.id?.trim();

    if (!itemId) {
      return NextResponse.json(
        { error: "A vault item id is required." },
        { status: 400 },
      );
    }

    await touchVaultItem(accountId, itemId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return workspaceErrorResponse(error, "Unable to update the vault item.");
  }
}