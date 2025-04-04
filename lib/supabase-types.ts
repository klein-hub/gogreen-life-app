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
          username: string
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      eco_actions: {
        Row: {
          id: string
          user_id: string
          action_type: string
          impact_co2: number
          impact_water: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_type: string
          impact_co2?: number
          impact_water?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_type?: string
          impact_co2?: number
          impact_water?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          icon: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          icon?: string
          created_at?: string
        }
      }
    }
  }
}