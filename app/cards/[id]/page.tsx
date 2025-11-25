'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ICard } from '@/types'

export default function CardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [card, setCard] = useState<ICard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadCard()
    }
  }, [params.id])

  const loadCard = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cards/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setCard(data.data)
      } else {
        alert(data.error || '加载失败')
        router.push('/cards')
      }
    } catch (error) {
      console.error('加载卡片失败:', error)
      alert('加载失败')
      router.push('/cards')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyContent = () => {
    if (card) {
      navigator.clipboard.writeText(card.content)
      alert('内容已复制到剪贴板')
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/cards/${params.id}`
    navigator.clipboard.writeText(url)
    alert('分享链接已复制到剪贴板')
  }

  const handleShare = async () => {
    if (card && navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: `查看知识卡片：${card.title}`,
          url: window.location.href,
        })
      } catch (err) {
        // 用户取消分享或分享失败
        console.log('分享取消或失败:', err)
      }
    } else {
      // 不支持Web Share API，fallback到复制链接
      handleCopyLink()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (!card) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push('/cards')}>
            ← 返回列表
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{card.title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-4">
              {card.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
              <span>浏览 {card.view_count} 次</span>
              <span>创建于 {new Date(card.created_at).toLocaleString()}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 配图 */}
            {card.image_url && (
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={card.image_url}
                  alt={card.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* 内容 */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{card.content}</div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button onClick={handleCopyContent} variant="outline">
                📋 复制内容
              </Button>
              <Button onClick={handleCopyLink} variant="outline">
                🔗 复制链接
              </Button>
              <Button onClick={handleShare} variant="outline">
                📤 分享
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 flex-1"
              >
                继续生成
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
