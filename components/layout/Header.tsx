'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Header() {
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🐵</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            WukongMap
          </h1>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {status === 'loading' ? (
            <div className="text-sm text-muted-foreground">加载中...</div>
          ) : session ? (
            <>
              <Link href="/cards">
                <Button variant="ghost">我的卡片</Button>
              </Link>
              <div className="text-sm text-foreground max-w-[150px] truncate">
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

        {/* 移动端菜单按钮 */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="菜单"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {status === 'loading' ? (
              <div className="text-sm text-muted-foreground text-center py-2">
                加载中...
              </div>
            ) : session ? (
              <>
                <div className="text-sm text-foreground px-3 py-2 bg-accent/50 rounded-md">
                  👋 {session.user?.name || session.user?.email}
                </div>
                <Link href="/cards" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    📚 我的卡片
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="w-full"
                >
                  退出登录
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    登录
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">注册</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
