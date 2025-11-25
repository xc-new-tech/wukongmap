#!/bin/bash
# 一键设置 Vercel 环境变量脚本

echo "正在设置 Vercel 环境变量..."

# 生成 NEXTAUTH_SECRET
SECRET=$(openssl rand -base64 32)

echo "
请先确保已登录 Vercel CLI: vercel login

然后运行以下命令（将 YOUR_DOMAIN 替换为实际域名）：

vercel env add NEXTAUTH_SECRET production
# 输入值: $SECRET

vercel env add NEXTAUTH_URL production  
# 输入值: https://YOUR_DOMAIN.vercel.app

vercel env add NEXT_PUBLIC_APP_URL production
# 输入值: https://YOUR_DOMAIN.vercel.app

# 从 .env.local 添加其他变量
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add OPENROUTER_API_KEY production
"
