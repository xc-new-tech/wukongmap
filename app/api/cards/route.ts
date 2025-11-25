import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/db/supabase'
import { ApiResponse } from '@/types'

// 获取用户的卡片列表
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

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // 计算范围
    const start = (page - 1) * limit
    const end = start + limit - 1

    // 构建查询
    let query = supabase
      .from('cards')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    // 如果有搜索关键词
    if (search.trim()) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    // 分页
    query = query.range(start, end)

    const { data: cards, count, error } = await query

    if (error) {
      console.error('查询卡片失败:', error)
      throw error
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          cards: cards || [],
          pagination: {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取卡片列表失败:', error)

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取卡片列表失败',
      },
      { status: 500 }
    )
  }
}
