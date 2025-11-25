import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { supabase } from '@/lib/db/supabase'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // 验证输入
    if (!username || !email || !password) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '请填写所有必填字段',
        },
        { status: 400 }
      )
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '用户名长度应在3-20个字符之间',
        },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '密码长度至少6位',
        },
        { status: 400 }
      )
    }

    // 检查用户名或邮箱是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '用户名或邮箱已被使用',
        },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        usage_count: 0,
      })
      .select('id, username, email')
      .single()

    if (error) {
      console.error('创建用户失败:', error)
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '注册失败，请稍后重试',
        },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: newUser,
        message: '注册成功',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册失败:', error)

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : '注册失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}
