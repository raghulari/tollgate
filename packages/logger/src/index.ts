export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const SECRET_PATTERNS = [
  /Bearer\s+([a-zA-Z0-9_.-]+)/gi,
  /(tg_live_[a-zA-Z0-9_-]+)/gi,
  /(sk-[a-zA-Z0-9_-]{20,})/gi,
  /(AIza[0-9A-Za-z-_]{35})/gi,
  /(["']?(?:password|secret|token|apiKey|api_key|dek|kek)["']?\s*[:=]\s*["'])([^"']+)(["'])/gi,
];

export function redactSensitiveData(obj: unknown): unknown {
  if (typeof obj === 'string') {
    let sanitized = obj;
    for (const pattern of SECRET_PATTERNS) {
      sanitized = sanitized.replace(pattern, (match, p1) => {
        if (p1) {
          return match.replace(p1, '[REDACTED]');
        }
        return '[REDACTED]';
      });
    }
    return sanitized;
  }

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  if (obj !== null && typeof obj === 'object') {
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const lower = key.toLowerCase();
      if (
        lower.includes('secret') ||
        lower.includes('password') ||
        lower.includes('token') ||
        lower.includes('apikey') ||
        lower.includes('api_key') ||
        lower.includes('authorization') ||
        lower.includes('dek') ||
        lower.includes('kek')
      ) {
        copy[key] = '[REDACTED]';
      } else {
        copy[key] = redactSensitiveData(value);
      }
    }
    return copy;
  }

  return obj;
}

export interface LoggerOptions {
  service?: string;
  minLevel?: LogLevel;
}

export class Logger {
  private service: string;
  private minPriority: number;

  constructor(options: LoggerOptions = {}) {
    this.service = options.service || 'tollgate';
    const minLevel = options.minLevel || (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.minPriority = LOG_LEVEL_PRIORITY[minLevel] ?? LOG_LEVEL_PRIORITY.info;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (LOG_LEVEL_PRIORITY[level] < this.minPriority) {
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message: redactSensitiveData(message),
      ...(context ? (redactSensitiveData(context) as Record<string, unknown>) : {}),
    };

    const serialized = JSON.stringify(payload);
    if (level === 'error' || level === 'fatal') {
      process.stderr.write(`${serialized}\n`);
    } else {
      process.stdout.write(`${serialized}\n`);
    }
  }

  trace(msg: string, ctx?: Record<string, unknown>): void {
    this.log('trace', msg, ctx);
  }
  debug(msg: string, ctx?: Record<string, unknown>): void {
    this.log('debug', msg, ctx);
  }
  info(msg: string, ctx?: Record<string, unknown>): void {
    this.log('info', msg, ctx);
  }
  warn(msg: string, ctx?: Record<string, unknown>): void {
    this.log('warn', msg, ctx);
  }
  error(msg: string, ctx?: Record<string, unknown>): void {
    this.log('error', msg, ctx);
  }
  fatal(msg: string, ctx?: Record<string, unknown>): void {
    this.log('fatal', msg, ctx);
  }
}

export const logger = new Logger();
