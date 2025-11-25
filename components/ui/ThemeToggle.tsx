'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from './button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 防止水合不匹配
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
        <span className="text-xl">🌓</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-9 h-9 p-0"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
    >
      <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
    </Button>
  )
}
