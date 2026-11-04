import { describe, it, expect } from 'vitest';
import { createWorker } from '../src/worker.js';

describe('Tollgate Background Worker', () => {
  it('manages initialization, start, and stop lifecycle', async () => {
    const worker = createWorker();
    expect(worker.status).toBe('initialized');

    await worker.start();
    expect(worker.status).toBe('running');

    await worker.stop();
    expect(worker.status).toBe('stopped');
  });
});
