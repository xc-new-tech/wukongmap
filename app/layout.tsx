import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'WukongMap - AI 知识点图解平台',
  description: '基于 AI 的知识点图解平台，为中学生打造的智能学习工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Header />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
