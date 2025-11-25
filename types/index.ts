// 用户类型 (Supabase PostgreSQL)
export interface IUser {
  id: string
  username: string
  email: string
  password: string
  avatar?: string
  usage_count: number // 已使用生成次数
  created_at: string
  updated_at: string
}

// 知识卡片类型 (Supabase PostgreSQL)
export interface ICard {
  id: string
  title: string
  content: string
  image_url?: string
  tags: string[]
  user_id: string
  is_public: boolean
  view_count: number
  like_count: number
  created_at: string
  updated_at: string
}

// 收藏夹类型 (Supabase PostgreSQL)
export interface ICollection {
  id: string
  name: string
  description?: string
  user_id: string
  card_ids: string[]
  created_at: string
  updated_at: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// AI 生成请求类型
export interface GenerateCardRequest {
  topic: string
  grade?: string // 年级：初一、初二、初三、高一、高二、高三
  subject?: string // 学科：语文、数学、英语、物理、化学、生物、历史、地理、政治
  generateImage?: boolean // 是否生成图片，默认false
  customImagePrompt?: string // 自定义图片生成提示词
}

// AI 生成响应类型
export interface GenerateCardResponse {
  id?: string // 保存后的卡片ID
  title: string
  content: string
  imagePrompt: string
  image_url?: string
  tags: string[]
}
