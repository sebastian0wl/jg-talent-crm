// Auto-generated types matching our Supabase schema
// Keep in sync with supabase/migrations/001_initial_schema.sql

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          domain: string | null
          industry: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['companies']['Row']> & { id: string; name: string }
        Update: Partial<Database['public']['Tables']['companies']['Row']>
      }
      people: {
        Row: {
          id: string
          name: string
          email: string | null
          role: string | null
          company_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['people']['Row']> & { id: string; name: string }
        Update: Partial<Database['public']['Tables']['people']['Row']>
      }
      deals: {
        Row: {
          id: string
          name: string
          company_id: string | null
          contact_id: string | null
          pipeline: string
          stage: string
          type: string
          priority: string
          value: number | null
          closed_value: number | null
          platforms: string[] | null
          deliverables: string | null
          terms: string | null
          notes: string | null
          jamey_uses_product: boolean
          owner: string
          created_at: string
          last_activity_at: string
          expected_close_date: string | null
          closed_at: string | null
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['deals']['Row']> & { id: string; name: string; pipeline: string; stage: string; type: string; priority: string; owner: string }
        Update: Partial<Database['public']['Tables']['deals']['Row']>
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: string
          priority: string
          assignee: string
          deal_id: string | null
          company_id: string | null
          due_date: string | null
          created_at: string
          created_by: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['tasks']['Row']> & { id: string; title: string; status: string; priority: string; assignee: string; created_by: string }
        Update: Partial<Database['public']['Tables']['tasks']['Row']>
      }
      activities: {
        Row: {
          id: string
          type: string
          title: string
          description: string | null
          deal_id: string | null
          company_id: string | null
          person_id: string | null
          created_by: string
          timestamp: string
        }
        Insert: Partial<Database['public']['Tables']['activities']['Row']> & { id: string; type: string; title: string; created_by: string }
        Update: Partial<Database['public']['Tables']['activities']['Row']>
      }
      deal_scores: {
        Row: {
          id: string
          deal_id: string | null
          overall_grade: string
          dimensions: unknown
          upgrade_moves: unknown
          viability_paths: unknown
          positioning_angles: unknown
          recommendation: string | null
          evaluated_at: string
        }
        Insert: Partial<Database['public']['Tables']['deal_scores']['Row']> & { id: string; overall_grade: string }
        Update: Partial<Database['public']['Tables']['deal_scores']['Row']>
      }
      email_messages: {
        Row: {
          id: string
          thread_id: string
          deal_id: string | null
          activity_id: string | null
          from_addr: string
          to_addr: string
          subject: string | null
          body: string | null
          direction: string
          timestamp: string
          gmail_thread_id: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['email_messages']['Row']> & { id: string; thread_id: string; from_addr: string; to_addr: string; direction: string; timestamp: string }
        Update: Partial<Database['public']['Tables']['email_messages']['Row']>
      }
      deliverables: {
        Row: {
          id: string
          title: string
          deal_id: string | null
          status: string
          content_type: string | null
          due_date: string | null
          publish_date: string | null
          invoice_amount: number | null
          invoice_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['deliverables']['Row']> & { id: string; title: string; status: string }
        Update: Partial<Database['public']['Tables']['deliverables']['Row']>
      }
    }
  }
}
