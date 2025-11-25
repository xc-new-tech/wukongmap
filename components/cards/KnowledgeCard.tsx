'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GenerateCardResponse } from '@/types'

interface KnowledgeCardProps {
  card: GenerateCardResponse
}

export function KnowledgeCard({ card }: KnowledgeCardProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">{card.title}</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {card.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {card.image_url ? (
          <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={card.image_url}
              alt={card.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-dashed border-purple-200">
            <div className="text-center text-gray-500">
              <p className="text-sm">💡 未生成配图（节省成本）</p>
              <p className="text-xs mt-1">如需配图，请勾选&ldquo;生成配图&rdquo;选项</p>
            </div>
          </div>
        )}

        <div className="prose prose-purple max-w-none">
          <div
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: card.content
                .replace(/\n/g, '<br>')
                .replace(/### (.*)/g, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
                .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/- (.*)/g, '<li class="ml-4">$1</li>')
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
