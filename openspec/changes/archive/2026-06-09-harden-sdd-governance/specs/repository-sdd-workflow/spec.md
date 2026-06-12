## ADDED Requirements

### Requirement: 统一仓库验证入口
仓库 SHALL 提供一个仓库级 npm 验证脚本，用于按固定顺序执行 OpenSpec strict validation、单元测试、lint 和 production build。该入口 SHALL 作为本地收尾、agent 交接和 CI 验证的默认质量门槛。

#### Scenario: 开发者执行统一验证
- **WHEN** 开发者或 CI 执行仓库级验证脚本
- **THEN** 该脚本会执行 `openspec validate --all --strict`、`npm run test:run`、`npm run lint` 和 `npm run build`

#### Scenario: 任一质量门槛失败
- **WHEN** 统一验证入口中的任一命令失败
- **THEN** 整个验证入口会以失败状态退出，并阻止该变更被视为完成

### Requirement: CI 强制质量门槛
仓库 SHALL 提供 GitHub Actions CI workflow，在 pull request 和 `main` push 上安装依赖并执行统一仓库验证入口。CI workflow SHALL 与部署 workflow 分离，使验证证据和发布动作保持清晰边界。

#### Scenario: Pull request 被创建或更新
- **WHEN** 某个 pull request 针对仓库主干创建或更新
- **THEN** GitHub Actions 会运行统一仓库验证入口，并在失败时标记该 CI run 失败

#### Scenario: Main 分支收到提交
- **WHEN** 某个提交进入 `main` 分支
- **THEN** GitHub Actions 会运行统一仓库验证入口，为后续部署提供主干验证证据

### Requirement: PR 追溯清单
仓库 SHALL 提供 pull request 模板，要求贡献者声明关联 OpenSpec change、用户可见影响、数据库影响、环境变量影响、部署影响、验证证据和归档状态。

#### Scenario: 贡献者准备提交 PR
- **WHEN** 贡献者打开新的 pull request
- **THEN** PR 描述模板会提示填写 OpenSpec change、影响范围和验证证据

#### Scenario: 变更包含特殊影响面
- **WHEN** 某个 PR 涉及数据库、环境变量、部署、认证、权限或 API contract
- **THEN** PR 描述会提供对应清单项，用于显式记录影响和评审关注点

### Requirement: Baseline 规格完整性
仓库 SHALL 避免在 `openspec/specs/` 的基线规格中保留 `TBD`、`TODO`、`待补充` 或等价占位文本。归档 change 或修改 baseline spec 时，贡献者 SHALL 补齐 Purpose 和可读说明，使基线规格能够作为长期真相来源阅读。

#### Scenario: 贡献者检查 baseline specs
- **WHEN** 贡献者准备完成某个会影响 OpenSpec 基线的变更
- **THEN** `openspec/specs/` 中不应遗留 Purpose 或 Requirement 层面的占位文本

#### Scenario: Change 归档后产生新的 baseline spec
- **WHEN** 某个 OpenSpec change 归档并生成或更新 baseline spec
- **THEN** 归档后的 baseline spec 会包含明确 Purpose，并继续通过严格 OpenSpec 校验

### Requirement: 规格漂移防护
仓库 SHALL 在 OpenSpec proposal、design、tasks 或 PR 描述中显式记录环境变量、数据库 schema、API contract、部署、认证和权限影响。若实现或配置暴露出尚未纳入 baseline spec 的稳定系统能力，贡献者 SHALL 新增或修改对应 OpenSpec capability，或明确说明该能力不属于本次范围。

#### Scenario: 变更修改环境变量示例
- **WHEN** 某个变更新增、删除或改变 `.env.example` 中的环境变量语义
- **THEN** 对应 proposal、design、tasks 或 PR 描述会记录环境变量影响，并在需要时更新相关 baseline spec

#### Scenario: 变更发现未规格化的稳定能力
- **WHEN** 贡献者发现仓库中存在稳定运行能力但 `openspec/specs/` 没有对应基线规格
- **THEN** 贡献者会创建或更新 OpenSpec change 来补齐该能力，或在当前 change 中明确记录为何暂不纳入范围
