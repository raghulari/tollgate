import { ProviderType } from '@tollgate/shared';

export interface ModelPricing {
  provider: ProviderType;
  model: string;
  // Cost in micro-dollars per 1,000,000 tokens
  promptMicroDollarsPerMillion: bigint;
  completionMicroDollarsPerMillion: bigint;
  effectiveDate: string;
  version: string;
}

export const MODEL_PRICING_TABLE: Record<string, ModelPricing> = {
  // OpenAI Models
  'gpt-4o': {
    provider: 'openai',
    model: 'gpt-4o',
    promptMicroDollarsPerMillion: 2_500_000n, // $2.50 / 1M
    completionMicroDollarsPerMillion: 10_000_000n, // $10.00 / 1M
    effectiveDate: '2024-08-01',
    version: '1.0.0',
  },
  'gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    promptMicroDollarsPerMillion: 150_000n, // $0.15 / 1M
    completionMicroDollarsPerMillion: 600_000n, // $0.60 / 1M
    effectiveDate: '2024-07-18',
    version: '1.0.0',
  },
  // Anthropic Models
  'claude-3-5-sonnet-20241022': {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    promptMicroDollarsPerMillion: 3_000_000n, // $3.00 / 1M
    completionMicroDollarsPerMillion: 15_000_000n, // $15.00 / 1M
    effectiveDate: '2024-10-22',
    version: '1.0.0',
  },
  'claude-3-5-haiku-20241022': {
    provider: 'anthropic',
    model: 'claude-3-5-haiku-20241022',
    promptMicroDollarsPerMillion: 800_000n, // $0.80 / 1M
    completionMicroDollarsPerMillion: 4_000_000n, // $4.00 / 1M
    effectiveDate: '2024-10-22',
    version: '1.0.0',
  },
  // Google Gemini Models
  'gemini-1.5-pro': {
    provider: 'gemini',
    model: 'gemini-1.5-pro',
    promptMicroDollarsPerMillion: 1_250_000n, // $1.25 / 1M
    completionMicroDollarsPerMillion: 5_000_000n, // $5.00 / 1M
    effectiveDate: '2024-05-14',
    version: '1.0.0',
  },
  'gemini-1.5-flash': {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    promptMicroDollarsPerMillion: 75_000n, // $0.075 / 1M
    completionMicroDollarsPerMillion: 300_000n, // $0.30 / 1M
    effectiveDate: '2024-05-14',
    version: '1.0.0',
  },
  'gemini-2.0-flash': {
    provider: 'gemini',
    model: 'gemini-2.0-flash',
    promptMicroDollarsPerMillion: 100_000n, // $0.10 / 1M
    completionMicroDollarsPerMillion: 400_000n, // $0.40 / 1M
    effectiveDate: '2024-12-11',
    version: '1.0.0',
  },
};

const ONE_MILLION = 1_000_000n;

/**
 * Calculates exact token cost in micro-dollars using integer arithmetic.
 * Formula: ((tokens * ratePerMillion) + 500,000) / 1,000,000 (with half-up rounding)
 */
export function calculateTokenCostMicroDollars(
  tokens: number,
  rateMicroDollarsPerMillion: bigint,
): bigint {
  if (tokens <= 0) return 0n;
  const tokenCount = BigInt(tokens);
  // Add half of divisor for round-half-up integer rounding
  return (tokenCount * rateMicroDollarsPerMillion + ONE_MILLION / 2n) / ONE_MILLION;
}

export function calculateUsageCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): { costMicroDollars: bigint; pricing: ModelPricing } {
  const pricing = MODEL_PRICING_TABLE[model];
  if (!pricing) {
    // Default fallback to conservative default pricing if unknown model
    const fallbackPricing: ModelPricing = {
      provider: 'openai',
      model,
      promptMicroDollarsPerMillion: 3_000_000n,
      completionMicroDollarsPerMillion: 15_000_000n,
      effectiveDate: '2024-01-01',
      version: 'default-fallback',
    };
    const inputCost = calculateTokenCostMicroDollars(
      promptTokens,
      fallbackPricing.promptMicroDollarsPerMillion,
    );
    const outputCost = calculateTokenCostMicroDollars(
      completionTokens,
      fallbackPricing.completionMicroDollarsPerMillion,
    );
    return { costMicroDollars: inputCost + outputCost, pricing: fallbackPricing };
  }

  const inputCost = calculateTokenCostMicroDollars(
    promptTokens,
    pricing.promptMicroDollarsPerMillion,
  );
  const outputCost = calculateTokenCostMicroDollars(
    completionTokens,
    pricing.completionMicroDollarsPerMillion,
  );
  return { costMicroDollars: inputCost + outputCost, pricing };
}
