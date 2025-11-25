'use client'

import { useState } from 'react'
import { GenerateForm } from '@/components/cards/GenerateForm'
import { KnowledgeCard } from '@/components/cards/KnowledgeCard'
import { GenerateCardResponse } from '@/types'

export default function HomePage() {
  const [generatedCard, setGeneratedCard] = useState<GenerateCardResponse | null>(null)

  const handleGenerate = (card: GenerateCardResponse) => {
    setGeneratedCard(card)
    // 滚动到卡片位置
    setTimeout(() => {
      document.getElementById('generated-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-3xl">🐵</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                WukongMap
              </h1>
            </div>
            <p className="text-sm text-gray-600 hidden md:block">
              AI 驱动的智能学习工具
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            让学习变得
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}简单有趣
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            输入任何知识点，AI 将为你生成图文并茂的学习卡片，帮助你更好地理解和记忆
          </p>
        </section>

        {/* Generate Form */}
        <section>
          <GenerateForm onGenerate={handleGenerate} />
        </section>

        {/* Generated Card */}
        {generatedCard && (
          <section id="generated-card" className="scroll-mt-20">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ✨ 生成成功！
              </h3>
              <p className="text-gray-600">
                你的知识卡片已经准备好了
              </p>
            </div>
            <KnowledgeCard card={generatedCard} />
          </section>
        )}

        {/* Features */}
        {!generatedCard && (
          <section className="mt-16">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-3 p-6 rounded-lg bg-white/60 backdrop-blur-sm">
                <div className="text-4xl">🤖</div>
                <h3 className="text-xl font-semibold">AI 智能生成</h3>
                <p className="text-gray-600">
                  使用最先进的 AI 技术，生成准确、易懂的知识内容
                </p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-lg bg-white/60 backdrop-blur-sm">
                <div className="text-4xl">🎨</div>
                <h3 className="text-xl font-semibold">精美配图</h3>
                <p className="text-gray-600">
                  自动生成教育风格的插图，让学习更加生动形象
                </p>
              </div>

              <div className="text-center space-y-3 p-6 rounded-lg bg-white/60 backdrop-blur-sm">
                <div className="text-4xl">📚</div>
                <h3 className="text-xl font-semibold">结构化内容</h3>
                <p className="text-gray-600">
                  清晰的知识结构，帮助你系统地理解和掌握知识点
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Made with ❤️ for Students | WukongMap © 2024</p>
        </div>
      </footer>
    </div>
  )
}
