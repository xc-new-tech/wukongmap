import OpenAI from 'openai'

// 验证环境变量
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL
const TEXT_MODEL = process.env.OPENROUTER_TEXT_MODEL || 'google/gemini-3-pro-preview'
const IMAGE_MODEL = process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-3-pro-image-preview'

if (!OPENROUTER_API_KEY) {
  throw new Error('请在 .env.local 中配置 OPENROUTER_API_KEY')
}

if (!OPENROUTER_BASE_URL) {
  throw new Error('请在 .env.local 中配置 OPENROUTER_BASE_URL')
}

// 创建 OpenRouter 客户端
export const openRouterClient = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'WukongMap',
  },
})

export const AI_MODELS = {
  text: TEXT_MODEL,
  image: IMAGE_MODEL,
}
