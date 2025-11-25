import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // 服务端不持久化session
  },
})

// 类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password: string
          avatar: string | null
          usage_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          password: string
          avatar?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password?: string
          avatar?: string | null
          usage_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          tags: string[]
          user_id: string
          is_public: boolean
          view_count: number
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          tags?: string[]
          user_id: string
          is_public?: boolean
          view_count?: number
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          tags?: string[]
          user_id?: string
          is_public?: boolean
          view_count?: number
          like_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string | null
          user_id: string
          card_ids: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          user_id: string
          card_ids?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          user_id?: string
          card_ids?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
