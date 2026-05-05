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

### 2026-05-05 — 登录成功仍停留在登录页

- **现象**：线上登录接口返回成功，跳转后仍回到 `/login`，无法进入首页。
- **根因**：生产环境 `NODE_ENV=production` 时会话 Cookie 带 `Secure`。若用户通过 **HTTP** 访问（如直连 `:3000`）或反代未正确传递 `X-Forwarded-Proto: https`，浏览器会 **丢弃** Set-Cookie，后续请求无会话，middleware/首页再次重定向到登录。
- **处理**：按请求的 `x-forwarded-proto` 与 URL 协议决定 `Secure`；支持环境变量 `SESSION_COOKIE_SECURE` 强制 true/false；登录成功后使用 `window.location.assign` 并支持 `?redirect=`。
- **涉及文件**：`src/lib/auth/cookies.ts`、`src/app/api/auth/login/route.ts`、`src/app/api/auth/logout/route.ts`、`src/app/login/page.tsx`
