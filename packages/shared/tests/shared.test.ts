import { describe, it, expect } from 'vitest';
import {
  dollarsToMicroDollars,
  microDollarsToDollars,
  AuthenticationError,
  BudgetExceededError,
  ok,
  err,
  KEY_PREFIX,
} from '../src/index.js';

describe('@tollgate/shared', () => {
  it('converts dollars to micro-dollars accurately without float drift', () => {
    expect(dollarsToMicroDollars(1.5)).toBe(1_500_000n);
    expect(dollarsToMicroDollars(0.000001)).toBe(1n);
    expect(dollarsToMicroDollars(100)).toBe(100_000_000n);
  });

  it('converts micro-dollars back to dollars', () => {
    expect(microDollarsToDollars(1_500_000n)).toBe(1.5);
    expect(microDollarsToDollars(1n)).toBe(0.000001);
  });

  it('instantiates custom errors with correct status codes', () => {
    const authErr = new AuthenticationError();
    expect(authErr.statusCode).toBe(401);
    expect(authErr.code).toBe('AUTHENTICATION_REQUIRED');

    const budgetErr = new BudgetExceededError('Project limit reached');
    expect(budgetErr.statusCode).toBe(429);
    expect(budgetErr.code).toBe('BUDGET_EXCEEDED');
    expect(budgetErr.message).toBe('Project limit reached');
  });

  it('implements Result type helpers', () => {
    const success = ok({ id: 'key_123' });
    expect(success.success).toBe(true);
    if (success.success) {
      expect(success.data.id).toBe('key_123');
    }

    const failure = err(new Error('fail'));
    expect(failure.success).toBe(false);
  });

  it('has valid key prefix', () => {
    expect(KEY_PREFIX).toBe('tg_live_');
  });
});
