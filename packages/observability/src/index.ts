export interface TraceContext {
  traceId: string;
  requestId: string;
  workspaceId?: string;
  virtualKeyId?: string;
}

export class MetricsCollector {
  private counters: Map<string, number> = new Map();

  increment(metricName: string, value = 1): void {
    const current = this.counters.get(metricName) || 0;
    this.counters.set(metricName, current + value);
  }

  get(metricName: string): number {
    return this.counters.get(metricName) || 0;
  }

  reset(): void {
    this.counters.clear();
  }
}

export const metrics = new MetricsCollector();

export function generateTraceId(): string {
  return `tr_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}
