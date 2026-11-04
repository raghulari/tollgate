import Fastify, { FastifyInstance, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { logger } from '@tollgate/logger';
import { generateRequestId } from '@tollgate/observability';

export interface ServerOptions {
  port?: number;
  host?: string;
}

export function buildServer(): FastifyInstance {
  const app = Fastify({
    logger: false, // We use @tollgate/logger for structured JSON with secret redaction
    genReqId: () => generateRequestId(),
  });

  app.register(cors, {
    origin: '*',
  });

  app.register(sensible);

  // Request hooks for logging & tracing
  app.addHook('onRequest', async (req) => {
    logger.trace(`Incoming ${req.method} ${req.url}`, {
      reqId: req.id,
      ip: req.ip,
    });
  });

  app.addHook('onResponse', async (req, reply) => {
    logger.trace(`Completed ${req.method} ${req.url} - ${reply.statusCode}`, {
      reqId: req.id,
      statusCode: reply.statusCode,
      responseTimeMs: reply.elapsedTime,
    });
  });

  // Health check endpoints
  app.get('/health', async () => {
    return {
      status: 'ok',
      service: 'tollgate-gateway',
      timestamp: new Date().toISOString(),
    };
  });

  app.get('/ready', async () => {
    return {
      status: 'ready',
      service: 'tollgate-gateway',
      timestamp: new Date().toISOString(),
    };
  });

  // Global error handler
  app.setErrorHandler((error: FastifyError, req, reply) => {
    logger.error('Unhandled Gateway error', {
      reqId: req.id,
      error: error.message,
      stack: error.stack,
    });

    const statusCode = error.statusCode ?? 500;
    const errorCode = error.code || 'INTERNAL_ERROR';

    return reply.status(statusCode).send({
      error: {
        message: error.message || 'Internal Server Error',
        type: 'gateway_error',
        code: errorCode,
      },
    });
  });

  return app;
}

// Start server if executed directly
if (process.env.NODE_ENV !== 'test' && import.meta.url.endsWith(process.argv[1] || '')) {
  const port = Number(process.env.GATEWAY_PORT || 8787);
  const host = process.env.GATEWAY_HOST || '0.0.0.0';
  const server = buildServer();

  server.listen({ port, host }, (err, address) => {
    if (err) {
      logger.fatal('Failed to start Gateway server', { error: err.message });
      process.exit(1);
    }
    logger.info(`Tollgate AI Gateway running on ${address}`, { port, host });
  });
}
