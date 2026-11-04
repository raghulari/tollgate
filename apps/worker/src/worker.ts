import { logger } from '@tollgate/logger';

export interface WorkerInstance {
  status: 'initialized' | 'running' | 'stopped';
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export function createWorker(): WorkerInstance {
  let status: 'initialized' | 'running' | 'stopped' = 'initialized';

  return {
    get status() {
      return status;
    },
    async start() {
      status = 'running';
      logger.info('Tollgate usage background worker started');
    },
    async stop() {
      status = 'stopped';
      logger.info('Tollgate usage background worker stopped gracefully');
    },
  };
}

if (process.env.NODE_ENV !== 'test' && import.meta.url.endsWith(process.argv[1] || '')) {
  const worker = createWorker();
  worker.start();

  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Gracefully shutting down worker...`);
    await worker.stop();
    process.exit(0);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}
