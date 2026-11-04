import crypto from 'node:crypto';
import { KEY_PREFIX } from '@tollgate/shared';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // 96-bit IV recommended for GCM
const KEY_LENGTH_BYTES = 32; // 256-bit key

export interface EncryptedPayload {
  ciphertext: string; // base64
  iv: string; // base64
  authTag: string; // base64
  version: number;
}

export interface GeneratedVirtualKey {
  fullKey: string;
  keyPrefix: string;
  keyHash: string;
  last4: string;
}

/**
 * Generates a cryptographically random 256-bit Data Encryption Key (DEK).
 */
export function generateDEK(): Buffer {
  return crypto.randomBytes(KEY_LENGTH_BYTES);
}

/**
 * Encrypts a plaintext secret using AES-256-GCM and a DEK.
 */
export function encryptWithDEK(dek: Buffer, plaintext: string, version = 1): EncryptedPayload {
  if (dek.length !== KEY_LENGTH_BYTES) {
    throw new Error('DEK must be exactly 32 bytes (256 bits)');
  }
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, dek, iv);

  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    version,
  };
}

/**
 * Decrypts and authenticates a ciphertext using AES-256-GCM and a DEK.
 */
export function decryptWithDEK(
  dek: Buffer,
  ciphertextBase64: string,
  ivBase64: string,
  authTagBase64: string,
): string {
  if (dek.length !== KEY_LENGTH_BYTES) {
    throw new Error('DEK must be exactly 32 bytes (256 bits)');
  }
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  const ciphertext = Buffer.from(ciphertextBase64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, dek, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return decrypted.toString('utf8');
}

/**
 * Wraps (encrypts) a workspace DEK using the master Key Encryption Key (KEK).
 */
export function wrapDEK(kek: Buffer, dek: Buffer, version = 1): EncryptedPayload {
  if (kek.length !== KEY_LENGTH_BYTES) {
    throw new Error('KEK must be exactly 32 bytes (256 bits)');
  }
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, kek, iv);

  const wrapped = Buffer.concat([cipher.update(dek), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: wrapped.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    version,
  };
}

/**
 * Unwraps (decrypts) a workspace DEK using the master Key Encryption Key (KEK).
 */
export function unwrapDEK(
  kek: Buffer,
  wrappedDekBase64: string,
  ivBase64: string,
  authTagBase64: string,
): Buffer {
  if (kek.length !== KEY_LENGTH_BYTES) {
    throw new Error('KEK must be exactly 32 bytes (256 bits)');
  }
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  const wrapped = Buffer.from(wrappedDekBase64, 'base64');

  const decipher = crypto.createDecipheriv(ALGORITHM, kek, iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(wrapped), decipher.final()]);
}

/**
 * Computes SHA-256 hash of a virtual API key.
 */
export function hashVirtualKey(virtualKey: string): string {
  return crypto.createHash('sha256').update(virtualKey).digest('hex');
}

/**
 * Generates a cryptographically secure virtual API key with prefix, hash, and display last-4.
 */
export function generateVirtualKey(): GeneratedVirtualKey {
  // 32 bytes of entropy encoded as hex (64 characters)
  const randomSecret = crypto.randomBytes(32).toString('hex');
  const fullKey = `${KEY_PREFIX}${randomSecret}`;
  const keyHash = hashVirtualKey(fullKey);
  const last4 = fullKey.slice(-4);

  return {
    fullKey,
    keyPrefix: KEY_PREFIX,
    keyHash,
    last4,
  };
}
