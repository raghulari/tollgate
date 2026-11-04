import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import {
  generateDEK,
  encryptWithDEK,
  decryptWithDEK,
  wrapDEK,
  unwrapDEK,
  generateVirtualKey,
  hashVirtualKey,
} from '../src/index.js';

describe('@tollgate/crypto', () => {
  it('encrypts and decrypts secret data using DEK with AES-256-GCM', () => {
    const dek = generateDEK();
    const secretApiKey = 'sk-proj-test1234567890abcdefghijklmnopqrstuvwxyz';

    const encrypted = encryptWithDEK(dek, secretApiKey);
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.authTag).toBeDefined();
    expect(encrypted.version).toBe(1);

    const decrypted = decryptWithDEK(dek, encrypted.ciphertext, encrypted.iv, encrypted.authTag);
    expect(decrypted).toBe(secretApiKey);
  });

  it('rejects decryption if ciphertext or auth tag is tampered with', () => {
    const dek = generateDEK();
    const encrypted = encryptWithDEK(dek, 'secret-content');

    // Tamper with auth tag
    const corruptedTag = Buffer.from(encrypted.authTag, 'base64');
    corruptedTag[0] = (corruptedTag[0] ?? 0) ^ 0xff;

    expect(() => {
      decryptWithDEK(dek, encrypted.ciphertext, encrypted.iv, corruptedTag.toString('base64'));
    }).toThrow();
  });

  it('wraps and unwraps DEK using KEK', () => {
    const kek = crypto.randomBytes(32);
    const dek = generateDEK();

    const wrapped = wrapDEK(kek, dek);
    const unwrapped = unwrapDEK(kek, wrapped.ciphertext, wrapped.iv, wrapped.authTag);

    expect(unwrapped.equals(dek)).toBe(true);
  });

  it('generates a virtual API key with prefix, hash and last4', () => {
    const keyData = generateVirtualKey();

    expect(keyData.fullKey.startsWith('tg_live_')).toBe(true);
    expect(keyData.keyPrefix).toBe('tg_live_');
    expect(keyData.last4.length).toBe(4);
    expect(keyData.keyHash).toBe(hashVirtualKey(keyData.fullKey));
    expect(keyData.fullKey.endsWith(keyData.last4)).toBe(true);
  });
});
