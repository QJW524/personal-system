## Context

当前仓库将 `openspec/specs/` 作为系统行为的长期基线文档，但这些 spec 主要以英文书写，只有个别段落已经转为中文。对日常维护者来说，这种不统一的语言状态会抬高阅读成本，也容易让后续新增或归档的规格继续出现风格漂移。

这次改动的目标不是改变任何系统行为，而是在不破坏 OpenSpec 工作流与验证机制的前提下，把基线规格整理成更适合当前仓库维护习惯的简体中文版本。

## Goals / Non-Goals

**Goals:**

- 将现有基线 spec 的可读文本统一整理为简体中文，降低理解与维护门槛。
- 保留所有会影响 OpenSpec 解析或校验的结构锚点，例如 `### Requirement:`、`#### Scenario:`、`SHALL`、`WHEN`、`THEN`。
- 在翻译过程中保持每条 requirement 与 scenario 的既有语义不变。
- 为未来维护补上一条显式约束，避免归档新 change 后基线 spec 再次回到随意的中英混排状态。

**Non-Goals:**

- 不修改任何业务能力、接口契约、数据库结构或部署流程。
- 不重命名现有 capability 目录，也不改变 OpenSpec 的文件组织方式。
- 不把所有结构性标题都翻译掉，以免引入不必要的工具兼容性风险。

## Decisions

- 只翻译人类可读文本，不翻译验证敏感的结构关键字。
  - 这样可以最大化中文可读性，同时把 `openspec validate --all --strict` 的兼容风险降到最低。
  - 相比“整份 spec 全量中文化”，这种做法保留了更稳定的工具锚点。

- 将“中文基线规格维护”建模为新的仓库级 capability，而不是修改既有业务 capability 的行为定义。
  - 现有 `project-workbench`、`session-authentication` 等 spec 描述的是产品能力，本次并不改变这些能力本身。
  - 新 capability 可以显式沉淀文档维护约束，又不会暗示业务语义发生变更。

- 在翻译时统一术语，但不做概念重写。
  - 例如保留 `Redis session`、`Playwright`、`GitHub Actions`、`Docker Compose` 等技术名词。
  - 对“用户 / 访客 / 系统 / 仓库 / 工作台”等中文表述做统一，减少同义混用。

## Risks / Trade-offs

- [Risk] 翻译过程中可能引入细微语义漂移。→ Mitigation: 逐条 requirement 与 scenario 对照原文改写，只做等义转换，不补充新约束。
- [Risk] 如果误改了结构关键字，OpenSpec 校验可能失效。→ Mitigation: 明确保留 `Requirement` / `Scenario` 标题格式与 `SHALL`、`WHEN`、`THEN` 关键字，并在收尾时运行严格校验。
- [Risk] 保留少量英文结构词会让文档不是“百分之百纯中文”。→ Mitigation: 优先保证工具兼容性，把阅读负担最大的正文内容全部中文化。

## Migration Plan

1. 先补齐这次 change 的 proposal、design、spec 与 tasks artifact。
2. 将 `openspec/specs/` 下现有 baseline spec 的可读文本统一翻译为简体中文。
3. 运行 `openspec validate --all --strict`，确认结构未被破坏。
4. 如果仓库环境允许，再运行 `npm run test:run`、`npm run lint` 与 `npm run build` 作为最终质量闸门。

Rollback strategy:

- 如果中文化后的文本被认为不够准确，可回退到上一个基线版本，并保留本次 change artifact 继续迭代措辞。
- 如果验证发现结构兼容性问题，优先恢复结构关键字与标题格式，再重新整理正文措辞。

## Open Questions

- 当前范围已经足够收敛，暂无阻塞实现的开放问题。
