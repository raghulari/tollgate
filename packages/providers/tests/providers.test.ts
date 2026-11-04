import { describe, it, expect } from 'vitest';
import { NormalizedCompletionResponse } from '../src/index.js';

describe('@tollgate/providers', () => {
  it('validates normalized completion response structure', () => {
    const mockResponse: NormalizedCompletionResponse = {
      id: 'chatcmpl-123',
      object: 'chat.completion',
      created: 1710000000,
      model: 'gpt-4o',
      choices: [
        {
          index: 0,
          message: { role: 'assistant', content: 'Hello!' },
          finish_reason: 'stop',
        },
      ],
      usage: {
        promptTokens: 10,
        completionTokens: 2,
        totalTokens: 12,
      },
    };

    expect(mockResponse.object).toBe('chat.completion');
    expect(mockResponse.usage.totalTokens).toBe(12);
  });
});
