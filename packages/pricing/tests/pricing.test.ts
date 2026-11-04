import { describe, it, expect } from 'vitest';
import {
  calculateTokenCostMicroDollars,
  calculateUsageCost,
  MODEL_PRICING_TABLE,
} from '../src/index.js';

describe('@tollgate/pricing', () => {
  it('calculates gpt-4o-mini pricing accurately in micro-dollars', () => {
    // 1,000 prompt tokens @ $0.15/1M = 150 micro-dollars ($0.00015)
    // 500 completion tokens @ $0.60/1M = 300 micro-dollars ($0.00030)
    // Total = 450 micro-dollars ($0.00045)
    const { costMicroDollars, pricing } = calculateUsageCost('gpt-4o-mini', 1000, 500);
    expect(pricing.provider).toBe('openai');
    expect(costMicroDollars).toBe(450n);
  });

  it('calculates zero cost for zero tokens', () => {
    expect(calculateTokenCostMicroDollars(0, 2_500_000n)).toBe(0n);
  });

  it('handles rounding half-up accurately for small token quantities', () => {
    // 10 tokens at $2.50 per 1M tokens:
    // (10 * 2,500,000 + 500,000) / 1,000,000 = (25,000,000 + 500,000)/1,000,000 = 25 micro-dollars
    const cost = calculateTokenCostMicroDollars(10, 2_500_000n);
    expect(cost).toBe(25n);
  });

  it('has pricing for major providers (OpenAI, Anthropic, Gemini)', () => {
    expect(MODEL_PRICING_TABLE['gpt-4o']).toBeDefined();
    expect(MODEL_PRICING_TABLE['claude-3-5-sonnet-20241022']).toBeDefined();
    expect(MODEL_PRICING_TABLE['gemini-1.5-flash']).toBeDefined();
    expect(MODEL_PRICING_TABLE['gemini-2.0-flash']).toBeDefined();
  });
});
