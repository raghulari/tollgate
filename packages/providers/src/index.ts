import { ChatCompletionRequest } from '@tollgate/schemas';
import { ProviderType } from '@tollgate/shared';

export interface ProviderUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface NormalizedCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string | null;
    };
    finish_reason: string | null;
  }>;
  usage: ProviderUsage;
}

export interface NormalizedStreamChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string | null;
    };
    finish_reason: string | null;
  }>;
  usage?: ProviderUsage | null;
}

export interface ProviderAdapter {
  readonly provider: ProviderType;

  executeCompletion(
    request: ChatCompletionRequest,
    decryptedApiKey: string,
  ): Promise<NormalizedCompletionResponse>;

  executeStream(
    request: ChatCompletionRequest,
    decryptedApiKey: string,
  ): AsyncIterable<NormalizedStreamChunk>;
}
