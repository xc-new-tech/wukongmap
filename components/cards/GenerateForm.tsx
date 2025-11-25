'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GenerateCardRequest, GenerateCardResponse } from '@/types'

interface GenerateFormProps {
  onGenerate: (result: GenerateCardResponse) => void
}

interface UsageStats {
  used: number
  total: number
  remaining: number
  isLimitReached: boolean
}

export function GenerateForm({ onGenerate }: GenerateFormProps) {
  const { data: session } = useSession()
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('初中') // 默认值，客户端加载后会从 localStorage 更新
  const [subject, setSubject] = useState('通用')
  const [generateImage, setGenerateImage] = useState(false) // 默认不生成图片
  const [imagePromptTemplate] = useState('把[内容]转换成一张白板板书的实拍图片：用可视化方式解释核心概念，包含示意图、箭头、框选和中文文字说明，使用不同颜色。如果必须，可以添加图像。')
  const [customImagePrompt, setCustomImagePrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<UsageStats | null>(null)

  // 根据主题动态生成图片提示词
  const imagePrompt = customImagePrompt || imagePromptTemplate.replace('[内容]', topic.trim() || '内容')

  // 根据知识点主题自动匹配学科
  const autoDetectSubject = (topic: string): string => {
    const lowerTopic = topic.toLowerCase()

    // 数学关键词
    if (/(方程|函数|几何|三角|代数|微积分|导数|积分|极限|数列|概率|统计|向量|矩阵|勾股|圆|正弦|余弦|tan|sin|cos|平方|立方|根号|解|证明|计算)/.test(lowerTopic)) {
      return '数学'
    }

    // 物理关键词
    if (/(力|速度|加速度|牛顿|运动|能量|功|功率|电|磁|光|波|热|温度|压强|密度|摩擦|重力|浮力|机械|声|光合|折射|反射|电流|电压|电阻|电路|磁场|电磁|能量守恒|动能|势能)/.test(lowerTopic)) {
      return '物理'
    }

    // 化学关键词
    if (/(化学式|反应|元素|原子|分子|离子|酸|碱|盐|氧化|还原|化合|分解|置换|燃烧|溶液|溶解|ph|催化|有机|无机|周期表|电解|中和)/.test(lowerTopic)) {
      return '化学'
    }

    // 生物关键词
    if (/(细胞|dna|rna|基因|遗传|蛋白质|光合作用|呼吸作用|生态|进化|植物|动物|微生物|器官|组织|系统|血液|神经|免疫|激素|酶|新陈代谢|繁殖|生长|发育)/.test(lowerTopic)) {
      return '生物'
    }

    // 英语关键词
    if (/(语法|时态|词汇|单词|句型|从句|阅读|写作|听力|口语|现在完成时|过去式|被动语态|定语从句|虚拟语气|英文|english)/.test(lowerTopic)) {
      return '英语'
    }

    // 语文关键词
    if (/(诗歌|散文|小说|议论文|说明文|记叙文|修辞|比喻|拟人|排比|古文|文言文|成语|字词|语句|段落|作文|阅读理解|古诗|诗词|作者|文学)/.test(lowerTopic)) {
      return '语文'
    }

    // 历史关键词
    if (/(朝代|皇帝|战争|革命|事件|年代|历史|古代|近代|现代|文化|制度|改革|变法|王朝|帝国|世纪|世界大战|新中国|辛亥革命|五四运动)/.test(lowerTopic)) {
      return '历史'
    }

    // 地理关键词
    if (/(地形|气候|经纬度|地球|大陆|海洋|河流|山脉|高原|平原|盆地|地理位置|人口|资源|环境|城市|农业|工业|交通|季风|寒流|暖流)/.test(lowerTopic)) {
      return '地理'
    }

    // 政治关键词
    if (/(法律|宪法|权利|义务|国家|政府|制度|社会|经济|政治|民主|选举|公民|道德|价值观|国情|改革开放|社会主义)/.test(lowerTopic)) {
      return '政治'
    }

    return '通用'
  }

  // 客户端加载后从 localStorage 读取上次选择的年级
  useEffect(() => {
    const savedGrade = localStorage.getItem('lastGrade')
    if (savedGrade) {
      setGrade(savedGrade)
    }
  }, [])

  // 当主题变化时，自动匹配学科
  useEffect(() => {
    if (topic.trim()) {
      const detectedSubject = autoDetectSubject(topic.trim())
      setSubject(detectedSubject)
    } else {
      setSubject('通用')
    }
  }, [topic])

  // 加载用量统计
  useEffect(() => {
    if (session) {
      loadUsage()
    }
  }, [session])

  const loadUsage = async () => {
    try {
      const response = await fetch('/api/usage')
      const data = await response.json()
      if (data.success) {
        setUsage(data.data)
      }
    } catch (error) {
      console.error('加载用量统计失败:', error)
    }
  }

  // 当年级变化时，保存到 localStorage
  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade)
    localStorage.setItem('lastGrade', newGrade)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!topic.trim()) {
      setError('请输入知识点主题')
      return
    }

    setLoading(true)

    try {
      const requestData: GenerateCardRequest = {
        topic: topic.trim(),
        grade,
        subject,
        generateImage, // 传递是否生成图片的选项
        customImagePrompt: generateImage ? imagePrompt.trim() : undefined, // 只在生成图片时传递自定义提示词
      }

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '生成失败')
      }

      onGenerate(data.data)
      setTopic('') // 清空输入
      loadUsage() // 重新加载用量统计
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 如果用户未登录，显示登录提示
  if (!session) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            生成知识卡片
          </CardTitle>
          <CardDescription>
            登录后即可使用 AI 生成精美的学习卡片
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900">
              请先登录使用
            </h3>
            <p className="text-gray-600">
              注册后即可免费使用 AI 生成知识卡片，每日 10 次免费额度
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button
                onClick={() => window.location.href = '/login'}
                variant="default"
                size="lg"
              >
                立即登录
              </Button>
              <Button
                onClick={() => window.location.href = '/register'}
                variant="outline"
                size="lg"
              >
                注册账号
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          生成知识卡片
        </CardTitle>
        <CardDescription>
          输入知识点主题，AI 将为你生成精美的学习卡片
          {session && usage && (
            <span className={`block mt-2 font-medium ${usage.isLimitReached ? 'text-red-600' : 'text-purple-600'}`}>
              {usage.isLimitReached
                ? `已达到免费生成上限（${usage.total}次）`
                : `剩余生成次数：${usage.remaining}/${usage.total}`
              }
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">知识点主题 *</Label>
            <Input
              id="topic"
              placeholder="例如：光合作用、勾股定理、牛顿第一定律..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">
                年级
                <span className="ml-1 text-xs text-gray-500">（会记住上次选择）</span>
              </Label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => handleGradeChange(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="初一">初一</option>
                <option value="初二">初二</option>
                <option value="初三">初三</option>
                <option value="高一">高一</option>
                <option value="高二">高二</option>
                <option value="高三">高三</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">
                学科
                <span className="ml-1 text-xs text-gray-500">（自动识别，可修改）</span>
              </Label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="通用">通用</option>
                <option value="语文">语文</option>
                <option value="数学">数学</option>
                <option value="英语">英语</option>
                <option value="物理">物理</option>
                <option value="化学">化学</option>
                <option value="生物">生物</option>
                <option value="历史">历史</option>
                <option value="地理">地理</option>
                <option value="政治">政治</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-amber-50 rounded-md border border-amber-200">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="generateImage"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded focus:ring-purple-500"
              />
              <Label htmlFor="generateImage" className="text-sm cursor-pointer font-medium">
                生成配图（需要额外时间和成本，默认不生成）
              </Label>
            </div>

            {generateImage && (
              <div className="space-y-2 pt-2 border-t border-amber-300">
                <Label htmlFor="imagePrompt" className="text-sm">
                  图片生成提示词（可自定义）
                </Label>
                <textarea
                  id="imagePrompt"
                  value={imagePrompt}
                  onChange={(e) => setCustomImagePrompt(e.target.value)}
                  disabled={loading}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="会自动替换[内容]为知识点主题..."
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-600">
                    💡 提示词会自动包含你输入的知识点主题
                  </p>
                  {customImagePrompt && (
                    <button
                      type="button"
                      onClick={() => setCustomImagePrompt('')}
                      className="text-xs text-purple-600 hover:text-purple-800"
                    >
                      恢复默认
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || (usage?.isLimitReached ?? false)}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                AI 正在生成中...
              </>
            ) : usage?.isLimitReached ? (
              <>
                🚫 已达到生成次数上限
              </>
            ) : (
              <>
                ✨ 开始生成
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
