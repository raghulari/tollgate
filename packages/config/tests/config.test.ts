import { describe, it, expect } from 'vitest';
import { validateEnvironment } from '../src/index.js';

describe('@tollgate/config', () => {
  it('should validate default environment variables', () => {
    const config = validateEnvironment({});
    expect(config.NODE_ENV).toBe('development');
    expect(config.PORT).toBe(3000);
    expect(config.GATEWAY_PORT).toBe(8787);
    expect(config.GATEWAY_REDIS_FAIL_CLOSED).toBe(true);
  });

  it('should parse custom gateway port and host', () => {
    const custom = validateEnvironment({
      GATEWAY_PORT: '9000',
      GATEWAY_HOST: '127.0.0.1',
      NODE_ENV: 'test',
    });
    expect(custom.GATEWAY_PORT).toBe(9000);
    expect(custom.GATEWAY_HOST).toBe('127.0.0.1');
    expect(custom.NODE_ENV).toBe('test');
  });

  it('should fail validation if invalid NODE_ENV is provided', () => {
    expect(() => {
      validateEnvironment({
        NODE_ENV: 'invalid_env',
      });
    }).toThrowError(/Environment validation failed/);
  });
});
