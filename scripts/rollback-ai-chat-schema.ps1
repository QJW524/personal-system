<#
.SYNOPSIS
  使用 Prisma 对当前 DATABASE_URL 执行 rollback-ai-chat-schema.sql，去掉 AI 对话相关表与 pgvector 扩展。

.DESCRIPTION
  需在仓库根目录执行；读取 .env 中的 DATABASE_URL（由 prisma 自动加载）。
  执行前请备份数据库；DROP EXTENSION vector 会影响同库内其它使用 vector 的表。
#>
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$sql = Join-Path $PSScriptRoot 'rollback-ai-chat-schema.sql'
$schema = Join-Path $root 'prisma\schema.prisma'

if (-not (Test-Path $sql)) {
  throw "Missing $sql"
}
if (-not (Test-Path $schema)) {
  throw "Missing $schema"
}

Write-Host "Executing $sql against DATABASE_URL from .env ..."
npx prisma db execute --file $sql --schema $schema
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
Write-Host 'Done. 若 Prisma Client 需刷新，请在无进程占用引擎时执行: npx prisma generate'
