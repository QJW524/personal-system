# 多阶段构建说明：
# - base: 统一 Node 运行环境
# - deps: 安装依赖（npm ci）
# - builder: 生成 Prisma Client + 构建 Next.js
# - runner: 只保留运行所需文件，减小镜像体积

FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 生成 Prisma Client，供应用运行时查询数据库
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# 只复制运行产物，不带源码与开发依赖
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
