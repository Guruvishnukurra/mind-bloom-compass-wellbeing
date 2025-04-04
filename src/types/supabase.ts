export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood_score: number
          energy_level: number | null
          activities: string[] | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_score: number
          energy_level?: number | null
          activities?: string[] | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_score?: number
          energy_level?: number | null
          activities?: string[] | null
          notes?: string | null
          created_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[] | null
          sentiment_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          tags?: string[] | null
          sentiment_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[] | null
          sentiment_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      meditation_sessions: {
        Row: {
          id: string
          user_id: string
          duration: number
          meditation_type: string
          completed: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          duration: number
          meditation_type: string
          completed?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          duration?: number
          meditation_type?: string
          completed?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string
          content_type: string
          content_url: string
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content_type: string
          content_url: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content_type?: string
          content_url?: string
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 