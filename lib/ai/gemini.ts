import { openRouterClient, AI_MODELS } from './client'
import { GenerateCardRequest, GenerateCardResponse } from '@/types'

/**
 * 使用 Gemini 生成知识卡片内容
 */
export async function generateCardContent(
  request: GenerateCardRequest
): Promise<Omit<GenerateCardResponse, 'imageUrl'>> {
  const { topic, grade = '初中', subject = '通用' } = request

  const systemPrompt = `你是一位专业的中学教育专家，擅长将复杂的知识点简化为易于理解的内容。
你的任务是为中学生创建结构化的知识卡片，内容要简洁、准确、易懂。`

  const userPrompt = `请为以下主题创建一个知识卡片：

主题：${topic}
年级：${grade}
学科：${subject}

要求：
1. 生成一个简洁的标题（不超过20字）
2. 生成结构化的知识内容，包括：
   - 核心概念（简明定义）
   - 关键要点（3-5个要点，每个要点2-3句话）
   - 记忆技巧或应用示例（如适用）
3. 内容要适合${grade}学生的理解水平
4. 使用Markdown格式，清晰分段
5. 提供5个相关标签
6. 生成一个详细的图片描述，用于生成教育风格的插图（描述要具体、视觉化）

请以JSON格式返回，格式如下：
{
  "title": "标题",
  "content": "Markdown格式的内容",
  "imagePrompt": "图片生成提示词",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
}

注意：
- content要使用Markdown格式，包含标题、列表等
- imagePrompt要详细描述一个教育场景或图示，适合中学教材风格
- 回复必须是有效的JSON格式，不要添加其他文字`

  try {
    const response = await openRouterClient.chat.completions.create({
      model: AI_MODELS.text,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000, // 增加到4000以避免内容被截断
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('AI 返回内容为空')
    }

    console.log('AI 原始返回:', content.substring(0, 500)) // 打印前500字符用于调试

    // 尝试多种方式提取 JSON
    let jsonStr = content.trim()

    // 1. 尝试提取 markdown 代码块中的 JSON
    if (jsonStr.includes('```')) {
      // 找到代码块的起始和结束位置
      const startMatch = jsonStr.match(/```(?:json)?\s*\n/)
      if (startMatch && startMatch.index !== undefined) {
        const startIndex = startMatch.index + startMatch[0].length
        const endIndex = jsonStr.indexOf('\n```', startIndex)
        if (endIndex > startIndex) {
          jsonStr = jsonStr.substring(startIndex, endIndex).trim()
        } else {
          // 如果找不到结束标记，可能被截断了，尝试提取到字符串末尾
          jsonStr = jsonStr.substring(startIndex).trim()
        }
      } else {
        // 尝试没有换行符的情况（非贪婪匹配）
        const match2 = jsonStr.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
        if (match2 && match2[1]) {
          jsonStr = match2[1].trim()
        }
      }
    }

    // 2. 如果仍然包含代码块标记或不是JSON格式，尝试直接提取JSON对象
    if (jsonStr.includes('```') || !jsonStr.startsWith('{')) {
      // 使用非贪婪匹配，找到第一个完整的JSON对象
      const jsonMatch = jsonStr.match(/\{(?:[^{}]|\{[^{}]*\})*\}/)
      if (jsonMatch && jsonMatch[0]) {
        jsonStr = jsonMatch[0].trim()
      }
    }

    // 3. 清理可能的代码块标记
    jsonStr = jsonStr.replace(/```(?:json)?/g, '').trim()

    console.log('提取的 JSON:', jsonStr.substring(0, 200))

    const result = JSON.parse(jsonStr)

    // 验证必需字段
    if (!result.title || !result.content || !result.imagePrompt || !result.tags) {
      throw new Error('AI 返回的 JSON 缺少必需字段')
    }

    return {
      title: result.title,
      content: result.content,
      imagePrompt: result.imagePrompt,
      tags: Array.isArray(result.tags) ? result.tags : [],
    }
  } catch (error) {
    console.error('生成卡片内容失败:', error)
    if (error instanceof SyntaxError) {
      throw new Error('AI 返回的 JSON 格式无效')
    }
    throw new Error('AI 生成失败，请稍后重试')
  }
}

/**
 * 优化图片生成提示词
 */
export function optimizeImagePrompt(prompt: string): string {
  return `Educational illustration, clean and simple style, suitable for middle school textbooks. ${prompt}. Bright colors, clear composition, no text or words in the image. High quality, professional educational graphics.`
}
