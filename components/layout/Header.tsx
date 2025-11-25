'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🐵</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            WukongMap
          </h1>
        </Link>

        <nav className="flex items-center space-x-4">
          <ThemeToggle />
          {status === 'loading' ? (
            <div className="text-sm text-muted-foreground">加载中...</div>
          ) : session ? (
            <>
              <Link href="/cards">
                <Button variant="ghost">我的卡片</Button>
              </Link>
              <div className="text-sm text-foreground">
                欢迎，{session.user?.name || session.user?.email}
              </div>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                退出登录
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">登录</Button>
              </Link>
              <Link href="/register">
                <Button>注册</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
