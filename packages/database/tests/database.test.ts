import { describe, it, expect } from 'vitest';
import { createTollgateSupabaseClient } from '../src/index.js';

describe('@tollgate/database', () => {
  it('instantiates typed supabase client with provided config', () => {
    const client = createTollgateSupabaseClient('https://mock-project.supabase.co', 'mock-key');
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
  });
});
