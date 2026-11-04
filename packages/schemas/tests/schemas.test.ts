import { describe, it, expect } from 'vitest';
import { ChatCompletionRequestSchema, UsageEventSchema } from '../src/index.js';

describe('@tollgate/schemas', () => {
  it('validates a valid OpenAI-compatible chat completion payload', () => {
    const valid = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an assistant.' },
        { role: 'user', content: 'Hello!' },
      ],
      temperature: 0.7,
      stream: false,
    };

    const parsed = ChatCompletionRequestSchema.parse(valid);
    expect(parsed.model).toBe('gpt-4o-mini');
    expect(parsed.messages.length).toBe(2);
    expect(parsed.stream).toBe(false);
  });

  it('rejects chat completion without messages', () => {
    const invalid = {
      model: 'gpt-4o-mini',
      messages: [],
    };

    expect(() => ChatCompletionRequestSchema.parse(invalid)).toThrow();
  });

  it('validates a usage event payload', () => {
    const event = {
      eventId: '11111111-1111-4111-8111-111111111111',
      requestId: 'req_abc123',
      workspaceId: '22222222-2222-4222-8222-222222222222',
      virtualKeyId: '33333333-3333-4333-8333-333333333333',
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 100,
      completionTokens: 50,
      totalTokens: 150,
      costMicroDollars: 350n,
      durationMs: 420,
      statusCode: 200,
      stream: false,
      createdAt: new Date().toISOString(),
    };

    const parsed = UsageEventSchema.parse(event);
    expect(parsed.costMicroDollars).toBe(350n);
    expect(parsed.totalTokens).toBe(150);
  });
});
