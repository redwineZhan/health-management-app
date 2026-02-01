---
name: cursor-integration
description: Cursor IDE 集成 - 让 OpenClaw 使用 Cursor 账号的 AI 能力，支持代码生成、编辑、分析等功能
homepage: https://cursor.com
metadata: {"openclaw":{"emoji":"🖱️","requires":{"bins":["python3"],"apps":["Cursor"]},"install":[{"id":"cursor-app","kind":"app","name":"Cursor","url":"https://cursor.com","label":"Install Cursor IDE"}]}}
---

# Cursor IDE 集成

让 OpenClaw 能够使用 Cursor 账号的 AI 能力，进行代码生成、编辑、问答等操作，支持与 Spec-kit 工作流相结合的结构化开发。

## 功能特性

- 🤖 **AI 对话** - 使用 Cursor 账号与 AI 模型对话
- 📝 **代码生成** - 根据描述生成代码
- 🔧 **代码编辑** - 智能编辑和重构代码
- 📖 **代码解释** - 解释代码逻辑和功能
- 🐛 **Bug 修复** - 分析并修复代码问题
- 📋 **Spec-kit 集成** - 结合 Spec-kit 工作流进行结构化开发

## 前置要求

1. 安装 Cursor IDE: https://cursor.com
2. 登录 Cursor 账号
3. 确保 Cursor CLI 可用

## 运行

### 检查 Cursor 状态

```bash
python3 {baseDir}/scripts/cursor_cli.py status
```

### AI 对话

```bash
# 简单问答
python3 {baseDir}/scripts/cursor_cli.py chat "如何在 Python 中读取 JSON 文件？"

# 代码生成
python3 {baseDir}/scripts/cursor_cli.py generate "写一个快速排序算法" --language python

# 代码解释
python3 {baseDir}/scripts/cursor_cli.py explain --file ./my_code.py

# 代码审查
python3 {baseDir}/scripts/cursor_cli.py review --file ./my_code.py
```

### 在 Cursor 中打开文件

```bash
# 打开文件
python3 {baseDir}/scripts/cursor_cli.py open ./my_file.py

# 打开并定位到特定行
python3 {baseDir}/scripts/cursor_cli.py open ./my_file.py --line 42

# 打开文件夹
python3 {baseDir}/scripts/cursor_cli.py open ./my_project/
```

### MCP 集成

```bash
# 查看 MCP 服务器配置
python3 {baseDir}/scripts/cursor_cli.py mcp list

# 添加 MCP 服务器到 Cursor
python3 {baseDir}/scripts/cursor_cli.py mcp add --name "my-server" --command "node" --args "server.js"
```

## 配置

设置环境变量以自定义行为：

```bash
# Cursor 应用路径（默认自动检测）
export CURSOR_APP_PATH="/Applications/Cursor.app"

# 默认 AI 模型
export CURSOR_DEFAULT_MODEL="claude-3.5-sonnet"
```

## 与 OpenClaw 集成

在 OpenClaw 对话中使用：

```
用户: 用 Cursor 帮我写一个 React 组件
OpenClaw: [调用 cursor-integration 技能生成代码]

用户: 在 Cursor 中打开 ~/project/app.py
OpenClaw: [调用 cursor-integration 打开文件]
```

## Spec-kit 与 Cursor 相结合的开发工作流

### 1. 规划阶段 (Specification + Planning)

在项目开始前，使用 Spec-kit 方法论进行结构化规划：

```bash
# 使用 OpenClaw 工具集创建规格文件
openclaw specify create my-project
```

- 创建 `spec.md`: 详细需求规格
- 创建 `plan.md`: 技术实施计划
- 创建 `tasks.md`: 任务分解列表

### 2. 代码实现阶段 (Implementation)

#### 2.1 代码生成
在 Cursor 中打开项目文件夹，使用 AI 生成代码：

```bash
# 在 Cursor 中打开项目
python3 {baseDir}/scripts/cursor_cli.py open ./my-project/
```

在 Cursor 编辑器中，使用 `Cmd+K` 调用 AI 生成符合规格的代码。

#### 2.2 结合规格文件开发
- 将 `spec.md` 中的需求作为 AI 提示词
- 根据 `plan.md` 中的技术架构生成相应模块
- 按照 `tasks.md` 中的任务逐个实现

### 3. 开发最佳实践

#### 3.1 Cursor 与 OpenClaw 工具集的分工
- **代码开发**: 使用 Cursor IDE 进行编码
- **项目管理**: 使用 OpenClaw 工具集管理文件、环境配置
- **系统操作**: 使用 OpenClaw 工具集执行系统级任务
- **文档维护**: 使用 Cursor 编写技术文档，使用 OpenClaw 管理项目结构

#### 3.2 Spec-kit 工作流在 Cursor 中的应用
1. **规格驱动开发**: 在 Cursor 中打开 `spec.md` 作为开发参考
2. **增量实现**: 每个功能模块对应 spec 中的一个部分
3. **实时验证**: 代码完成后与原规格进行对比验证

#### 3.3 工作流程示例
```bash
# 1. 创建项目规格 (OpenClaw)
mkdir my-project && cd my-project
openclaw specify create --name "MyApp" --desc "My awesome app"

# 2. 打开 Cursor 进行开发 (OpenClaw)
python3 {baseDir}/scripts/cursor_cli.py open .

# 3. 在 Cursor 中根据 spec.md 和 plan.md 实现功能
#    使用 Cmd+K 生成代码，Cmd+L 进行解释和审查

# 4. 使用 OpenClaw 管理项目和部署
openclaw deploy to github
```

## Spec-kit + Cursor 开发案例

### 健康管理系统开发实例
1. **规格阶段**: 使用 OpenClaw 创建 spec.md 定义功能需求
2. **规划阶段**: 创建 plan.md 确定技术栈和架构
3. **任务分解**: 生成 tasks.md 进行工作量评估
4. **代码实现**: 在 Cursor 中根据规格文件逐步实现
5. **质量保证**: 使用 Cursor 的 AI 功能进行代码审查
6. **项目管理**: 使用 OpenClaw 工具集管理部署和发布

## 注意事项

- 需要先登录 Cursor 账号
- AI 功能使用 Cursor 账号的配额
- 部分功能需要 Cursor 应用在后台运行
- 推荐将 Spec-kit 工作流与 Cursor 强大的 AI 能力相结合
- 代码开发优先使用 Cursor，辅助任务使用 OpenClaw 工具集
