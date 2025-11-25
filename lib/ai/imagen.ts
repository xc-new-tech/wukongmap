import { openRouterClient, AI_MODELS } from './client'
import { optimizeImagePrompt } from './gemini'

/**
 * 使用 Imagen 生成图片
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    const optimizedPrompt = optimizeImagePrompt(prompt)

    const response = await openRouterClient.chat.completions.create({
      model: AI_MODELS.image,
      messages: [
        {
          role: 'user',
          content: optimizedPrompt,
        },
      ],
      // @ts-expect-error - OpenRouter 特有参数
      modalities: ['image', 'text'],
    })

    const message = response.choices[0]?.message

    // @ts-expect-error - OpenRouter 返回的 images 字段
    if (message?.images && message.images.length > 0) {
      // @ts-expect-error - OpenRouter images 字段
      const imageUrl = message.images[0].image_url?.url
      if (imageUrl) {
        console.log('图片生成成功，格式:', imageUrl.substring(0, 30))
        return imageUrl
      }
    }

    throw new Error('图片生成失败，未返回图片')
  } catch (error) {
    console.error('生成图片失败:', error)
    // 如果图片生成失败，返回一个占位图
    return `https://placehold.co/1024x1024/8b5cf6/white?text=${encodeURIComponent('暂无图片')}`
  }
}

/**
 * 生成完整的知识卡片（包含图片）
 */
export async function generateCardWithImage(
  cardData: {
    title: string
    content: string
    imagePrompt: string
    tags: string[]
  }
): Promise<{
  title: string
  content: string
  imageUrl: string
  tags: string[]
}> {
  // 生成图片
  const imageUrl = await generateImage(cardData.imagePrompt)

  return {
    title: cardData.title,
    content: cardData.content,
    imageUrl,
    tags: cardData.tags,
  }
}
