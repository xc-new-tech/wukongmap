import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/db/supabase'
import { ApiResponse } from '@/types'

const MAX_FREE_GENERATIONS = parseInt(
  process.env.NEXT_PUBLIC_MAX_FREE_GENERATIONS || '10'
)

export async function GET(request: NextRequest) {
  try {
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

    const { data: user, error } = await supabase
      .from('users')
      .select('usage_count')
      .eq('id', session.user.id)
      .single()

    if (error || !user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      )
    }

    const usageCount = user.usage_count || 0
    const remaining = Math.max(0, MAX_FREE_GENERATIONS - usageCount)

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          used: usageCount,
          total: MAX_FREE_GENERATIONS,
          remaining,
          isLimitReached: usageCount >= MAX_FREE_GENERATIONS,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取用量统计失败:', error)

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取用量统计失败',
      },
      { status: 500 }
    )
  }
}
