import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WorkspaceRole, ProviderType, BudgetPeriod } from '@tollgate/shared';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          fail_closed: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: WorkspaceRole;
          created_at: string;
        };
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      provider_credentials: {
        Row: {
          id: string;
          workspace_id: string;
          provider: ProviderType;
          name: string;
          encrypted_key: string;
          iv: string;
          auth_tag: string;
          version: number;
          masked_key: string;
          status: 'active' | 'revoked' | 'invalid';
          created_at: string;
          updated_at: string;
        };
      };
      virtual_api_keys: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string | null;
          name: string;
          key_prefix: string;
          key_hash: string;
          last4: string;
          allowed_providers: ProviderType[] | null;
          allowed_models: string[] | null;
          rate_limit_rpm: number | null;
          is_active: boolean;
          expires_at: string | null;
          last_used_at: string | null;
          created_at: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string | null;
          virtual_key_id: string | null;
          period: BudgetPeriod;
          limit_micro_dollars: number;
          alert_threshold_percent: number;
          hard_cap_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      usage_events: {
        Row: {
          id: string;
          request_id: string;
          workspace_id: string;
          project_id: string | null;
          virtual_key_id: string;
          provider: ProviderType;
          model: string;
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
          cost_micro_dollars: number;
          duration_ms: number;
          status_code: number;
          stream: boolean;
          created_at: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          workspace_id: string;
          actor_id: string;
          action: string;
          resource_type: string;
          resource_id: string;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
      };
    };
  };
}

export type TypedSupabaseClient = SupabaseClient<Database>;

export function createTollgateSupabaseClient(
  supabaseUrl: string,
  supabaseKey: string,
): TypedSupabaseClient {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
