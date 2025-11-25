-- 修复 image_url 字段长度限制问题
-- Base64 编码的图片数据可能非常长，需要使用 TEXT 类型而不是 VARCHAR(500)

ALTER TABLE cards
ALTER COLUMN image_url TYPE TEXT;

-- 同时修改 users 表的 avatar 字段（以防将来也遇到同样问题）
ALTER TABLE users
ALTER COLUMN avatar TYPE TEXT;

-- 确认修改
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'cards' AND column_name = 'image_url';
