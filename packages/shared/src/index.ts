export const WORKSPACE_ROLES = ['owner', 'admin', 'developer', 'viewer'] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const PROVIDERS = ['openai', 'anthropic', 'gemini'] as const;
export type ProviderType = (typeof PROVIDERS)[number];

export const BUDGET_PERIODS = ['daily', 'monthly'] as const;
export type BudgetPeriod = (typeof BUDGET_PERIODS)[number];

export const KEY_PREFIX = 'tg_live_';

/**
 * 1 USD = 1,000,000 micro-dollars
 * Using integer micro-dollars avoids floating point precision loss in financial accounting.
 */
export const MICRO_DOLLARS_PER_USD = 1_000_000n;

export function dollarsToMicroDollars(dollars: number): bigint {
  return BigInt(Math.round(dollars * 1_000_000));
}

export function microDollarsToDollars(microDollars: bigint): number {
  return Number(microDollars) / 1_000_000;
}

export class TollgateError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, code = 'INTERNAL_ERROR', statusCode = 500, details?: unknown) {
    super(message);
    this.name = 'TollgateError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class AuthenticationError extends TollgateError {
  constructor(message = 'Invalid or missing API key', details?: unknown) {
    super(message, 'AUTHENTICATION_REQUIRED', 401, details);
  }
}

export class BudgetExceededError extends TollgateError {
  constructor(message = 'Budget limit exceeded', details?: unknown) {
    super(message, 'BUDGET_EXCEEDED', 429, details);
  }
}

export class RateLimitExceededError extends TollgateError {
  constructor(message = 'Rate limit exceeded', details?: unknown) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, details);
  }
}

export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}
