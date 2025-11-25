import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabase } from '@/lib/db/supabase'
import { ApiResponse } from '@/types'

// 获取单个卡片
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: card, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !card) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '卡片不存在',
        },
        { status: 404 }
      )
    }

    // 增加浏览次数
    await supabase
      .from('cards')
      .update({ view_count: (card.view_count || 0) + 1 })
      .eq('id', params.id)

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: card,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('获取卡片失败:', error)

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取卡片失败',
      },
      { status: 500 }
    )
  }
}

// 删除卡片
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // 查找卡片
    const { data: card } = await supabase
      .from('cards')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!card) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '卡片不存在',
        },
        { status: 404 }
      )
    }

    // 检查是否是卡片所有者
    if (card.user_id !== session.user.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '无权删除此卡片',
        },
        { status: 403 }
      )
    }

    // 删除卡片
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: '删除成功',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('删除卡片失败:', error)

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '删除卡片失败',
      },
      { status: 500 }
    )
  }
}
