-- 还原「AI 对话 / 知识库 / pgvector」相关库结构，与当前仓库 prisma/schema 对齐（仅 User / SiteProfile / Highlight）。
-- 适用：曾应用过已删除的迁移 `20260506035355_add_chat_knowledge_ai` 的本地或自建库。
-- 执行（在仓库根目录）：
--   npx prisma db execute --file scripts/rollback-ai-chat-schema.sql --schema prisma/schema.prisma
-- 或：.\scripts\rollback-ai-chat-schema.ps1
--
-- 注意：若同一库内其它应用仍依赖 extension `vector`，请注释掉本文件末尾 DROP EXTENSION 段后再执行。

BEGIN;

DELETE FROM "_prisma_migrations"
WHERE "migration_name" = '20260506035355_add_chat_knowledge_ai'
   OR "migration_name" LIKE '20260506035355%';

DROP TABLE IF EXISTS "KnowledgeChunk" CASCADE;
DROP TABLE IF EXISTS "KnowledgeSource" CASCADE;
DROP TABLE IF EXISTS "ChatMessage" CASCADE;
DROP TABLE IF EXISTS "ChatConversation" CASCADE;

-- Prisma 常见枚举名（若建表时未用枚举而是 Text，以下语句无影响）
DROP TYPE IF EXISTS "ChatMessageRole" CASCADE;
DROP TYPE IF EXISTS "ChatRole" CASCADE;
DROP TYPE IF EXISTS "KnowledgeSourceStatus" CASCADE;
DROP TYPE IF EXISTS "KnowledgeSourceKind" CASCADE;
DROP TYPE IF EXISTS "KnowledgeChunkStatus" CASCADE;

-- 仅当确认无其它表使用 vector 时保留此行；否则请注释后手动处理 extension
DROP EXTENSION IF EXISTS vector CASCADE;

COMMIT;
