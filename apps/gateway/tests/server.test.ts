import { describe, it, expect } from 'vitest';
import { buildServer } from '../src/server.js';

describe('Fastify Gateway Server', () => {
  it('GET /health returns status ok with timestamp', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ok');
    expect(body.service).toBe('tollgate-gateway');
    expect(body.timestamp).toBeDefined();
    await app.close();
  });

  it('GET /ready returns status ready', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/ready',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.status).toBe('ready');
    await app.close();
  });

  it('GET /non-existent returns 404', async () => {
    const app = buildServer();
    const response = await app.inject({
      method: 'GET',
      url: '/non-existent',
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
