import { describe, it, expect } from 'vitest';
import { metrics, generateTraceId, generateRequestId } from '../src/index.js';

describe('@tollgate/observability', () => {
  it('increments metrics and tracks counts', () => {
    metrics.reset();
    metrics.increment('gateway.requests.total');
    metrics.increment('gateway.requests.total', 2);

    expect(metrics.get('gateway.requests.total')).toBe(3);
  });

  it('generates unique trace and request IDs', () => {
    const traceId = generateTraceId();
    const reqId = generateRequestId();

    expect(traceId.startsWith('tr_')).toBe(true);
    expect(reqId.startsWith('req_')).toBe(true);
  });
});
