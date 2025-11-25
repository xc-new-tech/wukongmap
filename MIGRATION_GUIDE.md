# MongoDB → Supabase PostgreSQL 迁移指南

## ✅ 已完成的迁移

1. **依赖包**
   - ✅ 卸载: mongoose, bcryptjs
   - ✅ 安装: @supabase/supabase-js, bcrypt

2. **配置文件**
   - ✅ `lib/db/supabase.ts` - Supabase客户端配置
   - ✅ `.env.local` - 添加Supabase环境变量

3. **数据库Schema**
   - ✅ `supabase-schema.sql` - 完整的数据库结构脚本

4. **已迁移的API**
   - ✅ `app/api/auth/register/route.ts` - 注册API
   - ✅ `app/api/auth/[...nextauth]/route.ts` - NextAuth配置
   - ✅ `app/api/ai/generate/route.ts` - 卡片生成API

---

## ⚠️ 需要手动操作

### 步骤1: 在Supabase执行SQL脚本

1. 访问: https://supabase.com/dashboard/project/hmhgqbfwudnnrvxirjvq
2. 点击左侧 **SQL Editor**
3. 点击 **New Query**
4. 复制 `supabase-schema.sql` 所有内容并粘贴
5. 点击 **Run** 执行

### 步骤2: 禁用RLS策略（开发阶段）

由于我们使用NextAuth而不是Supabase Auth，需要临时禁用RLS或调整策略。

在SQL Editor中执行：

```sql
-- 临时禁用RLS（仅开发阶段）
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
ALTER TABLE collections DISABLE ROW LEVEL SECURITY;
```

或者修改RLS策略为：

```sql
-- 删除现有策略
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- 创建更宽松的策略（开发阶段）
CREATE POLICY "Allow all operations for users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations for cards" ON cards FOR ALL USING (true);
CREATE POLICY "Allow all operations for collections" ON collections FOR ALL USING (true);
```

---

## 🔧 需要迁移的API文件

### 1. app/api/cards/route.ts

将MongoDB查询改为Supabase:

```typescript
// 旧代码
const cards = await Card.find(query)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean()

// 新代码
let query = supabase
  .from('cards')
  .select('*', { count: 'exact' })
  .eq('user_id', session.user.id)
  .order('created_at', { ascending: false })
  .range(skip, skip + limit - 1)

if (search.trim()) {
  query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
}

const { data: cards, count } = await query
```

### 2. app/api/cards/[id]/route.ts

```typescript
// GET - 获取单个卡片
const { data: card } = await supabase
  .from('cards')
  .select('*')
  .eq('id', params.id)
  .single()

// 增加浏览次数
await supabase
  .from('cards')
  .update({ view_count: (card.view_count || 0) + 1 })
  .eq('id', params.id)

// DELETE - 删除卡片
await supabase
  .from('cards')
  .delete()
  .eq('id', params.id)
  .eq('user_id', session.user.id)
```

### 3. app/api/usage/route.ts

```typescript
const { data: user } = await supabase
  .from('users')
  .select('usage_count')
  .eq('id', session.user.id)
  .single()

const usageCount = user?.usage_count || 0
const remaining = Math.max(0, MAX_FREE_GENERATIONS - usageCount)
```

---

## 📦 删除不再需要的文件

```bash
rm -rf lib/db/mongodb.ts
rm -rf lib/db/models/
```

---

## 🧪 测试步骤

完成迁移后，按顺序测试以下功能：

1. **注册新用户**
   - 访问 `/register`
   - 填写信息并提交
   - 检查Supabase Dashboard → Table Editor → users

2. **登录**
   - 访问 `/login`
   - 使用刚注册的账号登录

3. **生成卡片**
   - 在首页输入知识点生成卡片
   - 检查Supabase Dashboard → Table Editor → cards

4. **查看卡片列表**
   - 访问 `/cards`
   - 检查是否显示生成的卡片

5. **查看卡片详情**
   - 点击某张卡片
   - 检查详情页和浏览次数是否增加

6. **测试用量限制**
   - 生成多张卡片（直到达到10次限制）
   - 检查是否正确显示剩余次数
   - 达到限制后是否禁用生成按钮

---

## 🐛 常见问题

### 问题1: RLS权限错误

**错误**: `new row violates row-level security policy`

**解决**: 参考上面"步骤2: 禁用RLS策略"

### 问题2: 环境变量未生效

**解决**: 重启开发服务器
```bash
# Ctrl+C 停止
npm run dev
```

### 问题3: bcrypt vs bcryptjs

已从bcryptjs迁移到bcrypt。如果遇到问题：
```bash
npm rebuild bcrypt
```

---

## 📝 字段名称映射

| MongoDB (Mongoose) | PostgreSQL (Supabase) |
|-------------------|----------------------|
| `_id`             | `id` (UUID)          |
| `userId`          | `user_id`            |
| `imageUrl`        | `image_url`          |
| `isPublic`        | `is_public`          |
| `viewCount`       | `view_count`          |
| `likeCount`       | `like_count`          |
| `usageCount`      | `usage_count`         |
| `cardIds`         | `card_ids`            |
| `createdAt`       | `created_at`          |
| `updatedAt`       | `updated_at`          |

注意: PostgreSQL使用snake_case，MongoDB使用camelCase。

---

## ✨ 下一步

完成上述步骤后，您的应用将完全运行在Supabase上！

如果需要，我可以帮您完成剩余API的迁移代码。
