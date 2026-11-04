import { z } from 'zod';
import { PROVIDERS, BUDGET_PERIODS } from '@tollgate/shared';

// Chat Completion Message Schema (OpenAI compatible)
export const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool', 'function']),
  content: z.union([z.string(), z.array(z.any())]).optional(),
  name: z.string().optional(),
  tool_call_id: z.string().optional(),
  tool_calls: z.array(z.any()).optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Chat Completion Request Schema (OpenAI compatible)
export const ChatCompletionRequestSchema = z.object({
  model: z.string().min(1, 'Model name is required'),
  messages: z.array(ChatMessageSchema).min(1, 'At least one message is required'),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  n: z.number().int().min(1).optional(),
  stream: z.boolean().optional().default(false),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  max_tokens: z.number().int().positive().optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  user: z.string().optional(),
});
export type ChatCompletionRequest = z.infer<typeof ChatCompletionRequestSchema>;

// Virtual API Key Schemas
export const CreateVirtualKeySchema = z.object({
  name: z.string().min(1).max(100),
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  allowedProviders: z.array(z.enum(PROVIDERS)).optional(),
  allowedModels: z.array(z.string()).optional(),
  rateLimitRpm: z.number().int().positive().optional(),
  budgetLimitMicroDollars: z.bigint().optional(),
  expiresAt: z.string().datetime().optional(),
});
export type CreateVirtualKey = z.infer<typeof CreateVirtualKeySchema>;

// Budget Configuration Schema
export const BudgetConfigSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  virtualKeyId: z.string().uuid().optional(),
  period: z.enum(BUDGET_PERIODS),
  limitMicroDollars: z.bigint(),
  alertThresholdPercent: z.number().min(1).max(100).default(80),
  hardCapEnabled: z.boolean().default(true),
});
export type BudgetConfig = z.infer<typeof BudgetConfigSchema>;

// Usage Event Schema (Idempotent event produced after gateway execution)
export const UsageEventSchema = z.object({
  eventId: z.string().uuid(),
  requestId: z.string().min(1),
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid().nullable().optional(),
  virtualKeyId: z.string().uuid(),
  provider: z.enum(PROVIDERS),
  model: z.string(),
  promptTokens: z.number().int().nonnegative(),
  completionTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
  costMicroDollars: z.bigint(),
  durationMs: z.number().int().nonnegative(),
  statusCode: z.number().int(),
  stream: z.boolean(),
  createdAt: z.string().datetime(),
});
export type UsageEvent = z.infer<typeof UsageEventSchema>;
