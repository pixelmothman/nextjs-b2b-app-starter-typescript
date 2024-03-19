export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calendar_events_table: {
        Row: {
          cal_event_description: string
          cal_event_end_date: string
          cal_event_id: string
          cal_event_label: string
          cal_event_name: string
          cal_event_start_date: string
          created_at: string
          org_id: string
          user_id: string
        }
        Insert: {
          cal_event_description: string
          cal_event_end_date: string
          cal_event_id?: string
          cal_event_label: string
          cal_event_name: string
          cal_event_start_date: string
          created_at?: string
          org_id: string
          user_id: string
        }
        Update: {
          cal_event_description?: string
          cal_event_end_date?: string
          cal_event_id?: string
          cal_event_label?: string
          cal_event_name?: string
          cal_event_start_date?: string
          created_at?: string
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_table_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org_table"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "calendar_events_table_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_table"
            referencedColumns: ["user_id"]
          }
        ]
      }
      fav_movies_table: {
        Row: {
          created_at: string
          movie_id: string
          movie_name: string
          movie_view_category: string
          org_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          movie_id?: string
          movie_name: string
          movie_view_category: string
          org_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          movie_id?: string
          movie_name?: string
          movie_view_category?: string
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fav_movies_table_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org_table"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "fav_movies_table_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_table"
            referencedColumns: ["user_id"]
          }
        ]
      }
      org_table: {
        Row: {
          created_at: string
          org_id: string
          org_name: string
          org_users: number
        }
        Insert: {
          created_at?: string
          org_id: string
          org_name?: string
          org_users?: number
        }
        Update: {
          created_at?: string
          org_id?: string
          org_name?: string
          org_users?: number
        }
        Relationships: []
      }
      org_to_delete_table: {
        Row: {
          created_at: string
          org_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          org_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          org_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_to_delete_table_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "org_table"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "org_to_delete_table_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_table"
            referencedColumns: ["user_id"]
          }
        ]
      }
      user_table: {
        Row: {
          created_at: string
          org_id: string
          user_email: string
          user_id: string
          user_role: string
        }
        Insert: {
          created_at?: string
          org_id: string
          user_email: string
          user_id: string
          user_role: string
        }
        Update: {
          created_at?: string
          org_id?: string
          user_email?: string
          user_id?: string
          user_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_table_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "org_table"
            referencedColumns: ["org_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
