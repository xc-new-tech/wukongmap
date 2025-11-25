# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

WukongMap（悟空图）是一个基于 AI 的知识点图解平台,为中学生打造的智能学习工具。使用 Google Gemini AI 技术生成图文并茂的知识卡片。

## 技术栈

- **前端**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **后端**: Next.js API Routes + MongoDB + Mongoose + NextAuth.js
- **AI 服务**: Google Gemini Pro (文本生成) + Imagen 3 (图片生成)
- **API 访问**: 通过 OpenRouter 代理访问 Gemini 服务

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 环境配置

项目使用 `.env.local` 文件管理环境变量。必需的配置项:

- `MONGODB_URI`: MongoDB 数据库连接字符串
- `NEXTAUTH_URL`: NextAuth 认证 URL
- `NEXTAUTH_SECRET`: NextAuth 密钥
- `OPENROUTER_API_KEY`: OpenRouter API 密钥 (用于访问 Gemini)
- `OPENROUTER_BASE_URL`: OpenRouter API 基础 URL
- `OPENROUTER_TEXT_MODEL`: 文本生成模型 (google/gemini-3-pro-preview)
- `OPENROUTER_IMAGE_MODEL`: 图片生成模型 (google/gemini-3-pro-image-preview)

## 项目架构

### 目录结构 (规划中)

```
wukongmap/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面组 (登录、注册)
│   ├── (main)/            # 主要功能页面组 (首页、生成、收藏等)
│   └── api/               # API 路由
│       ├── ai/            # AI 生成相关 API
│       ├── auth/          # NextAuth 认证 API
│       └── cards/         # 卡片 CRUD API
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── cards/            # 知识卡片相关组件
│   ├── forms/            # 表单组件
│   └── layout/           # 布局组件 (Header, Footer, Sidebar)
├── lib/                  # 核心库
│   ├── ai/              # AI 服务封装
│   │   ├── gemini.ts    # Gemini Pro 文本生成服务
│   │   └── imagen.ts    # Imagen 图片生成服务
│   └── db/              # 数据库
│       ├── mongodb.ts   # MongoDB 连接管理
│       └── models/      # Mongoose 数据模型
│           ├── User.ts      # 用户模型
│           ├── Card.ts      # 知识卡片模型
│           └── Collection.ts # 收藏夹模型
├── types/               # TypeScript 类型定义
└── public/              # 静态资源
```

### 核心架构设计

#### 1. 路由组织 (App Router)
- `(auth)` 路由组: 处理用户认证流程,包含登录和注册页面
- `(main)` 路由组: 主要应用功能,包含知识卡片生成、浏览、搜索等功能
- API 路由采用 RESTful 设计,按功能模块组织

#### 2. AI 服务架构
- 通过 OpenRouter 代理访问 Google Gemini 服务
- `lib/ai/gemini.ts`: 封装 Gemini Pro 文本生成逻辑
- `lib/ai/imagen.ts`: 封装 Imagen 3 图片生成逻辑
- AI 生成流程: 用户输入主题 → Gemini 生成结构化内容 → Imagen 生成配图 → 合成知识卡片

#### 3. 数据模型
- **User**: 用户信息、认证凭证
- **Card**: 知识卡片内容、生成时间、关联用户、标签分类
- **Collection**: 用户收藏夹、卡片关联

#### 4. 前端架构
- 使用 Server Components 作为默认,Client Components 用于交互式功能
- shadcn/ui 提供可定制的基础组件
- Tailwind CSS v4 处理样式,支持明暗主题切换
- 响应式设计优先,移动端友好

## 开发注意事项

### AI 集成
- 所有 AI API 调用应通过 OpenRouter 进行
- 实现错误处理和重试逻辑
- 考虑 API 配额和速率限制
- 图片生成结果需要适当的存储方案 (考虑使用对象存储服务)

### 数据库操作
- 使用 Mongoose 进行数据建模
- 实现适当的索引以优化查询性能
- 卡片内容应支持全文搜索
- 考虑实现数据缓存策略

### 用户体验
- AI 生成过程可能耗时,需要实现 loading 状态和进度反馈
- 考虑实现流式响应以改善用户体验
- 错误信息应友好且可操作
- 实现免费用户生成次数限制 (NEXT_PUBLIC_MAX_FREE_GENERATIONS)

### 安全性
- 敏感信息 (API 密钥) 必须存储在环境变量中
- 实施适当的身份验证和授权
- 对用户输入进行验证和清理
- API 路由应验证用户权限

## 开发阶段

项目当前处于**阶段一:项目初始化**完成阶段,即将进入**阶段二:AI 功能集成**。

下一步开发重点:
1. 实现 AI 生成 API (`/api/ai/generate`)
2. 集成图片存储服务
3. 创建基础的卡片数据模型
4. 开发 AI 生成测试页面

## TypeScript 规范

- 为所有函数和组件提供明确的类型定义
- 在 `types/` 目录中定义共享类型
- 避免使用 `any` 类型
- 使用严格的 TypeScript 配置
