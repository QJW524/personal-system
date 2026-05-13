# 问题解决沉淀

本文件由 Agent 在排障/修复后追加条目，便于回顾与避免重复踩坑。

## 写入模板（复制到新条目）

```markdown
### YYYY-MM-DD — 简短标题

- **现象**：
- **根因**：
- **处理**：
- **涉及文件**：（可选）`path/to/file`
```

---

### 2026-05-06 — 兼容网关报 /v1/responses 404 与 embeddings 401

- **现象**：`OPENAI_BASE_URL` 指向 LiteLLM 等代理时，对话请求访问 `/v1/responses` 返回 404；RAG 向量请求 `/v1/embeddings` 返回 401（token 未在代理侧登记）。
- **根因**：`@ai-sdk/openai` v3 默认 `openai(model)` 使用 Responses API；多数兼容网关仅实现 Chat Completions。Embedding 与 Chat 共用 Key 时，代理若未开通 embedding 或 Key 未入库会 401。
- **处理**：语言模型改为 `openai.chat(model)` 走 `/chat/completions`；向量侧支持可选 `OPENAI_EMBEDDING_API_KEY` / `OPENAI_EMBEDDING_BASE_URL` 与对话网关分离。
- **涉及文件**：`src/lib/ai/resolve-language-model.ts`、`src/lib/ai/openai-client.ts`、`src/lib/ai/resolve-embedding-model.ts`、`.env.example`

### 2026-05-06 — 登录页被 /chat 样式串扰

- **现象**：聊天页与登录页均使用 CSS Modules 时，登录布局出现异常（与聊天侧深色/栅格等视觉混杂）。
- **根因**：两页模块中存在相同**局部类名**（如 `layout`、`header`、`title` 等），在部分构建/开发环境下类名哈希冲突或层叠顺序导致非预期样式命中。
- **处理**：聊天样式迁至 `chat-shell.module.css`，类名统一 `chat*` 前缀；登录根 `.page` 增加 `isolation: isolate` 兜底；会话路由改为 `/chat/[id]`（可选 catch-all），去掉 `?c=`。
- **涉及文件**：`src/app/chat/chat-shell.module.css`、`src/components/chat-workbench.tsx`、`src/app/chat/[[...slug]]/page.tsx`、`src/app/login/page.module.css`

### 2026-05-06 — next build 报 React 版本不一致

- **现象**：执行 `npm run build` 时在 Collecting page data 阶段崩溃，提示 `react` 与 `react-dom` 版本不一致（如 19.2.5 vs 19.0.0）。
- **根因**：新增依赖解析树将 `react` 提升到较新补丁版本，而 `react-dom` 仍锁定在旧补丁，Next 在构建期校验两者必须完全一致。
- **处理**：将 `react` 与 `react-dom` 显式对齐到同一补丁版本（如 `19.2.5`）后重装依赖并重建。
- **涉及文件**：`package.json`、`package-lock.json`

### 2026-05-05 — 登录成功仍停留在登录页

- **现象**：线上登录接口返回成功，跳转后仍回到 `/login`，无法进入首页。
- **根因**：生产环境 `NODE_ENV=production` 时会话 Cookie 带 `Secure`。若用户通过 **HTTP** 访问（如直连 `:3000`）或反代未正确传递 `X-Forwarded-Proto: https`，浏览器会 **丢弃** Set-Cookie，后续请求无会话，middleware/首页再次重定向到登录。
- **处理**：按请求的 `x-forwarded-proto` 与 URL 协议决定 `Secure`；支持环境变量 `SESSION_COOKIE_SECURE` 强制 true/false；登录成功后使用 `window.location.assign` 并支持 `?redirect=`。
- **涉及文件**：`src/lib/auth/cookies.ts`、`src/app/api/auth/login/route.ts`、`src/app/api/auth/logout/route.ts`、`src/app/login/page.tsx`
