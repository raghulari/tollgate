import { describe, it, expect, vi } from 'vitest';
import { redactSensitiveData, Logger } from '../src/index.js';

describe('@tollgate/logger', () => {
  it('redacts sensitive API keys and authorization headers from strings and objects', () => {
    const raw = {
      user: 'alice',
      apiKey: 'tg_live_supersecret1234567890',
      nested: {
        authorization: 'Bearer sk-ant-secret-key-12345',
        safeField: 'hello world',
      },
    };

    const redacted = redactSensitiveData(raw) as Record<string, unknown>;
    const nested = redacted.nested as Record<string, unknown>;
    expect(redacted.user).toBe('alice');
    expect(redacted.apiKey).toBe('[REDACTED]');
    expect(nested.authorization).toBe('[REDACTED]');
    expect(nested.safeField).toBe('hello world');
  });

  it('outputs structured JSON logs without throwing', () => {
    const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    const testLogger = new Logger({ service: 'test-service', minLevel: 'info' });

    testLogger.info('User action performed', { requestId: 'req_123' });

    expect(stdoutSpy).toHaveBeenCalled();
    const firstCall = stdoutSpy.mock.calls[0];
    expect(firstCall).toBeDefined();
    const logged = JSON.parse((firstCall?.[0] ?? '{}') as string);
    expect(logged.service).toBe('test-service');
    expect(logged.message).toBe('User action performed');
    expect(logged.requestId).toBe('req_123');
    expect(logged.level).toBe('info');

    stdoutSpy.mockRestore();
  });
});
