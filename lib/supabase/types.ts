export type Database = {
  public: {
    Tables: {
      site_activity_logs: {
        Row: {
          id: string
          event_name: string
          pathname: string
          metadata: Record<string, unknown>
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          pathname?: string
          metadata?: Record<string, unknown>
          session_id?: string | null
          created_at?: string
        }
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
