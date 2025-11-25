# 快速开始指南

## 🎉 项目状态

**当前版本：MVP v1.0** - 核心功能已完成并可用！

**访问地址：** http://localhost:3001

## ✅ 已实现功能

1. **AI 知识卡片生成**
   - 输入任何知识点主题
   - 选择年级（初一～高三）和学科
   - AI 自动生成结构化内容
   - AI 自动生成教育风格配图

2. **精美的用户界面**
   - 现代化渐变色设计
   - 响应式布局，完美支持移动端
   - 流畅的交互动画
   - 实时加载状态显示

## 🚀 启动项目

```bash
# 1. 确保已安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 在浏览器中访问
# http://localhost:3001
```

## 🧪 测试 AI 生成

尝试输入以下知识点来测试：

- **数学**：勾股定理、二次函数、三角形全等
- **物理**：牛顿第一定律、光的反射、浮力原理
- **化学**：光合作用、氧化还原反应、元素周期表
- **语文**：记叙文的六要素、修辞手法、文言虚词
- **英语**：过去进行时、被动语态、定语从句

## 📁 项目结构

```
wukongmap/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   └── ai/generate/          # AI 生成 API
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页
├── components/                   # React 组件
│   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   └── cards/                    # 卡片相关组件
│       ├── GenerateForm.tsx      # 生成表单
│       └── KnowledgeCard.tsx     # 知识卡片展示
├── lib/                          # 核心库
│   ├── ai/                       # AI 服务
│   │   ├── client.ts             # OpenRouter 客户端
│   │   ├── gemini.ts             # 文本生成
│   │   └── imagen.ts             # 图片生成
│   ├── db/                       # 数据库
│   │   ├── mongodb.ts            # MongoDB 连接
│   │   └── models/               # Mongoose 模型
│   │       ├── User.ts
│   │       ├── Card.ts
│   │       └── Collection.ts
│   └── utils.ts                  # 工具函数
├── types/                        # TypeScript 类型
│   └── index.ts
├── .env.local                    # 环境变量
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
├── next.config.js                # Next.js 配置
└── postcss.config.mjs            # PostCSS 配置
```

## 🔑 环境变量说明

项目使用的环境变量（已在 `.env.local` 中配置）：

```env
# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 数据库
MONGODB_URI=mongodb://localhost:27017/wukongmap

# 认证（暂未启用）
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-change-in-production

# AI 服务（OpenRouter）
OPENROUTER_API_KEY=your-api-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_TEXT_MODEL=google/gemini-3-pro-preview
OPENROUTER_IMAGE_MODEL=google/gemini-3-pro-image-preview
```

## 📝 开发说明

### 技术栈
- **框架**：Next.js 16 (App Router)
- **UI**：React 19 + TypeScript + Tailwind CSS v4
- **组件**：shadcn/ui
- **数据库**：MongoDB + Mongoose
- **AI**：OpenRouter (Gemini Pro + Imagen 3)

### 代码规范
- 使用 TypeScript 严格模式
- 组件优先使用 Server Components
- 交互功能使用 Client Components ('use client')
- 遵循 Next.js 最佳实践

## 🎯 下一步开发计划

### 即将添加的功能

1. **卡片保存功能**
   - 保存生成的卡片到数据库
   - 无需登录也可保存（使用本地存储或临时ID）

2. **用户认证系统**
   - NextAuth.js 集成
   - 注册/登录功能
   - 用户会话管理

3. **个人中心**
   - 我的卡片列表
   - 收藏功能
   - 使用统计

4. **高级功能**
   - 搜索和分类
   - 深色模式
   - 卡片分享

## 🐛 常见问题

### Q: API 调用失败？
A: 请检查 `.env.local` 中的 `OPENROUTER_API_KEY` 是否配置正确。

### Q: 图片无法显示？
A: 图片生成可能失败，系统会显示占位图。检查 API 配额和网络连接。

### Q: 端口 3000 被占用？
A: Next.js 会自动使用其他端口（如 3001），注意查看控制台输出的实际端口。

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [OpenRouter API](https://openrouter.ai/docs)

---

**开发愉快！** 🚀

如有问题，请查看 `todo.md` 了解详细的开发计划和进度。
