import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

/*
 * Vault payload encryption.
 *
 * workspace.vault_items stores ciphertext in three
 * columns — encrypted_payload, iv, auth_tag — plus a
 * key_version. This module is the only place that
 * knows how those three values combine, so the format
 * can be versioned without touching the repository.
 *
 * AES-256-GCM is authenticated encryption: a payload
 * that has been altered in the database fails to
 * decrypt rather than returning corrupted plaintext.
 *
 * KEY MANAGEMENT — the honest boundary:
 * The master key comes from VAULT_MASTER_KEY. It is
 * derived (not used raw) so an operator can supply a
 * passphrase of any length and still get a 32-byte key.
 * A plain hash is used rather than a slow KDF because
 * this runs per request; the operator is expected to
 * provide a high-entropy secret.
 *
 * Because the server holds the key, this is
 * server-side encryption at rest — NOT zero-knowledge:
 * an operator with database access and the env var can
 * decrypt these records. The UI must not claim
 * otherwise.
 */

const ALGORITHM = "aes-256-gcm";

/** Current key version. Bump when rotating VAULT_MASTER_KEY. */
export const CURRENT_KEY_VERSION = 1;

export class VaultKeyError extends Error {
  readonly code = "VAULT_KEY_MISSING";
  readonly status = 503;

  constructor(message: string) {
    super(message);
    this.name = "VaultKeyError";
  }
}

function resolveMasterKey(): Buffer {
  const raw = process.env.VAULT_MASTER_KEY;

  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new VaultKeyError(
      "Vault encryption key is not configured. Set VAULT_MASTER_KEY on " +
      "the identity-web service to a high-entropy secret, then redeploy.",
    );
  }

  // Derive a stable 32-byte key from the configured secret.
  return createHash("sha256").update(raw.trim(), "utf8").digest();
}

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: number;
}

export function encryptVaultPayload(plaintext: string): EncryptedPayload {
  const key = resolveMasterKey();
  const iv = randomBytes(12); // 96-bit nonce, recommended for GCM

  const cipher = createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    keyVersion: CURRENT_KEY_VERSION,
  };
}

export function decryptVaultPayload(payload: {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: number;
}): string {
  if (payload.keyVersion !== CURRENT_KEY_VERSION) {
    throw new Error(
      `Vault payload was encrypted with key version ${payload.keyVersion}, ` +
      `but this build only knows version ${CURRENT_KEY_VERSION}.`,
    );
  }

  const key = resolveMasterKey();

  const decipher = createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(payload.iv, "base64"),
  );

  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

/** True when the vault key is configured, without leaking it. */
export function isVaultConfigured(): boolean {
  return (
    typeof process.env.VAULT_MASTER_KEY === "string" &&
    process.env.VAULT_MASTER_KEY.trim().length > 0
  );
}