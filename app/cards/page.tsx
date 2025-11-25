'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ICard } from '@/types'

export default function CardsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cards, setCards] = useState<ICard[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // 未登录重定向
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // 加载卡片列表
  useEffect(() => {
    if (status === 'authenticated') {
      loadCards()
    }
  }, [status, page, search])

  const loadCards = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
      })

      const response = await fetch(`/api/cards?${params}`)
      const data = await response.json()

      if (data.success) {
        setCards(data.data.cards)
        setTotalPages(data.data.pagination.totalPages)
        setTotal(data.data.pagination.total)
      }
    } catch (error) {
      console.error('加载卡片失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这张卡片吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/cards/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        // 重新加载列表
        loadCards()
      } else {
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // 重置到第一页
    loadCards()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            我的卡片
          </h1>
          <p className="text-sm sm:text-base text-gray-600">共 {total} 张卡片</p>
        </div>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="搜索卡片标题、内容或标签..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 sm:flex-none">搜索</Button>
              {search && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch('')
                    setPage(1)
                  }}
                  className="flex-1 sm:flex-none"
                >
                  清除
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* 卡片网格 */}
        {cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 mb-4">
              {search ? '没有找到匹配的卡片' : '还没有创建任何卡片'}
            </p>
            <Button onClick={() => router.push('/')}>
              {search ? '清除搜索' : '去创建'}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {cards.map((card) => (
                <Card key={card.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg sm:text-xl line-clamp-2">{card.title}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{card.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {card.content.substring(0, 120)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                      <span>👁️ {card.view_count}</span>
                      <span>{new Date(card.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/cards/${card.id}`)}
                      >
                        查看
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="sm:w-auto"
                        onClick={() => handleDelete(card.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="min-w-[80px]"
                >
                  上一页
                </Button>
                <div className="flex items-center px-3 py-1 text-sm bg-white rounded-md border">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="min-w-[80px]"
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
