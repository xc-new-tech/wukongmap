import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { generateCardContent } from '@/lib/ai/gemini'
import { generateCardWithImage } from '@/lib/ai/imagen'
import { supabase } from '@/lib/db/supabase'
import { ApiResponse, GenerateCardRequest, GenerateCardResponse } from '@/types'

const MAX_FREE_GENERATIONS = parseInt(
  process.env.NEXT_PUBLIC_MAX_FREE_GENERATIONS || '10'
)

export async function POST(request: NextRequest) {
  try {
    // 获取用户session
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '请先登录',
        },
        { status: 401 }
      )
    }

    // 检查用户使用次数
    const { data: user } = await supabase
      .from('users')
      .select('usage_count')
      .eq('id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      )
    }

    if (user.usage_count >= MAX_FREE_GENERATIONS) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `已达到免费生成次数上限（${MAX_FREE_GENERATIONS}次）`,
        },
        { status: 403 }
      )
    }

    const body: GenerateCardRequest = await request.json()
    const { topic, grade, subject, generateImage = false, customImagePrompt } = body

    // 验证输入
    if (!topic || topic.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '请输入知识点主题',
        },
        { status: 400 }
      )
    }

    if (topic.length > 100) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '主题长度不能超过100个字符',
        },
        { status: 400 }
      )
    }

    // 第一步：生成文本内容
    console.log('开始生成知识卡片内容...')
    const cardContent = await generateCardContent({
      topic: topic.trim(),
      grade,
      subject,
    })

    let response: GenerateCardResponse

    // 第二步：根据用户选择决定是否生成图片
    if (generateImage) {
      console.log('开始生成配图...')
      // 使用自定义提示词或AI生成的提示词
      const finalImagePrompt = customImagePrompt || cardContent.imagePrompt
      console.log('使用的图片提示词:', customImagePrompt ? '自定义' : 'AI生成')

      const cardWithImage = await generateCardWithImage({
        ...cardContent,
        imagePrompt: finalImagePrompt,
      })
      response = {
        title: cardWithImage.title,
        content: cardWithImage.content,
        imagePrompt: finalImagePrompt,
        image_url: cardWithImage.imageUrl,
        tags: cardWithImage.tags,
      }
    } else {
      console.log('跳过图片生成（用户未选择生成配图）')
      response = {
        title: cardContent.title,
        content: cardContent.content,
        imagePrompt: cardContent.imagePrompt,
        image_url: undefined, // 不生成图片
        tags: cardContent.tags,
      }
    }

    // 第三步：保存卡片到数据库
    console.log('保存卡片到数据库...')
    const { data: savedCard, error: cardError } = await supabase
      .from('cards')
      .insert({
        title: response.title,
        content: response.content,
        image_url: response.image_url || null,
        tags: response.tags,
        user_id: session.user.id,
        is_public: true,
      })
      .select()
      .single()

    if (cardError || !savedCard) {
      console.error('保存卡片失败:', cardError)
      throw new Error('保存卡片失败')
    }

    console.log('卡片保存成功，ID:', savedCard.id)

    // 第四步：增加用户使用次数
    await supabase
      .from('users')
      .update({ usage_count: user.usage_count + 1 })
      .eq('id', session.user.id)

    const remainingGenerations = MAX_FREE_GENERATIONS - (user.usage_count + 1)
    console.log('剩余生成次数:', remainingGenerations)

    return NextResponse.json<ApiResponse<GenerateCardResponse>>(
      {
        success: true,
        data: {
          ...response,
          id: savedCard.id,
        },
        message: `生成并保存成功（剩余 ${remainingGenerations} 次）`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('AI 生成失败:', error)

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'AI 生成失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}

// 允许的 HTTP 方法
export async function GET() {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: '不支持 GET 请求',
    },
    { status: 405 }
  )
}
