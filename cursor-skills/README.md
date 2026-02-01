# Cursor + Spec-kit 集成开发指南

本指南介绍如何将 Cursor IDE 与 Spec-kit 工作流相结合，实现高效的结构化软件开发。

## 目录
1. [概述](#概述)
2. [前置要求](#前置要求)
3. [工作流程](#工作流程)
4. [最佳实践](#最佳实践)
5. [案例研究](#案例研究)

## 概述

将 Cursor 强大的 AI 驱动代码生成功能与 Spec-kit 的结构化项目管理方法相结合，可以实现：

- 更高效的代码开发
- 更清晰的项目结构
- 更好的需求追踪
- 更规范的开发流程

## 前置要求

- [Cursor IDE](https://cursor.com) 已安装并登录
- OpenClaw 工具集已安装
- Node.js 环境
- Git

## 工作流程

### 1. 项目初始化阶段

```bash
# 创建新项目目录
mkdir my-awesome-project
cd my-awesome-project

# 使用 OpenClaw 创建规格文件
openclaw specify create --name "MyAwesomeProject" --desc "An awesome project using Cursor + Spec-kit"
```

此命令将在项目中创建以下文件：
- `spec.md` - 详细的需求规格说明书
- `plan.md` - 技术实施计划
- `tasks.md` - 具体任务分解清单

### 2. 规格设计阶段

在规格设计阶段，使用 OpenClaw 工具集来完善这三个核心文档：

```bash
# 编辑规格文件
openclaw edit spec.md
openclaw edit plan.md
openclaw edit tasks.md
```

### 3. 代码开发阶段

#### 3.1 启动开发环境

```bash
# 在 Cursor 中打开项目
python3 {baseDir}/scripts/cursor_cli.py open .
```

#### 3.2 基于规格的开发

在 Cursor 编辑器中：

1. 打开 `spec.md` 作为参考
2. 根据 `tasks.md` 中的具体任务逐个实现
3. 使用 `Cmd+K` (macOS) 或 `Ctrl+K` (Windows/Linux) 调用 AI 生成代码
4. 使用 `Cmd+L` (macOS) 或 `Ctrl+L` (Windows/Linux) 进行代码解释和审查

#### 3.3 AI 提示词示例

结合规格文件的 AI 提示词：

```
根据 spec.md 中的需求，使用 plan.md 中的技术架构，实现 tasks.md 中的第X个任务。

具体要求：
- 遵循项目中已有的代码风格
- 符合 spec.md 中的功能需求
- 使用 plan.md 中指定的技术栈
- 保持代码的可维护性
```

### 4. 项目管理与协作

使用 OpenClaw 工具集进行项目管理和协作：

```bash
# 查看任务进度
openclaw task list

# 更新任务状态
openclaw task update <task-id> --status completed

# 创建里程碑
openclaw milestone create --name "MVP完成" --due-date 2025-12-31
```

## 最佳实践

### 1. 工具分工原则

| 任务类型 | 推荐工具 |
|---------|---------|
| 代码编写/编辑 | Cursor IDE |
| 代码审查 | Cursor AI 功能 |
| 项目结构管理 | OpenClaw 工具集 |
| 文件管理 | OpenClaw 工具集 |
| 系统配置 | OpenClaw 工具集 |
| 需求管理 | OpenClaw 工具集 + 规格文件 |

### 2. 工作流程建议

1. **规划阶段**：使用 OpenClaw 创建和维护规格文件
2. **开发阶段**：在 Cursor 中根据规格实现功能
3. **验证阶段**：使用 Cursor AI 审查代码是否符合规格
4. **管理阶段**：使用 OpenClaw 跟踪进度和部署

### 3. 代码质量保证

- 定期使用 Cursor 的 AI 功能审查代码
- 保持规格文件与实现的一致性
- 编写单元测试验证功能实现
- 使用 OpenClaw 进行自动化测试

### 4. 团队协作

- 规格文件作为团队沟通的核心文档
- 定期同步规格变更
- 使用版本控制管理规格和代码
- 建立代码审查流程

## 案例研究

### 健康管理系统开发实例

以之前开发的健康管理系统为例：

#### 1. 规格阶段
- `spec.md` 定义了三大核心功能：身体指标查看、中医药减重指导、社区训练营
- `plan.md` 确定了技术栈：Node.js/React/PostgreSQL
- `tasks.md` 将项目分解为多个可执行的任务

#### 2. 开发阶段
- 在 Cursor 中根据规格文件逐一实现功能模块
- 使用 AI 生成符合架构的代码
- 保持与原始需求的一致性

#### 3. 管理阶段
- 使用 OpenClaw 工具集管理项目进度
- 部署到 GitHub

## 故障排除

### 常见问题

1. **Cursor 未响应 AI 请求**
   - 检查网络连接
   - 确认 Cursor 账号已登录且订阅有效

2. **规格文件与实现不一致**
   - 定期回顾规格文件
   - 使用 AI 功能比较代码与规格

3. **项目结构混乱**
   - 严格按照 plan.md 中的架构组织代码
   - 定期使用 OpenClaw 工具整理项目结构

## 扩展阅读

- [Cursor 官方文档](https://docs.cursor.com)
- [Spec-kit 方法论](https://spec-kit.example.com) (假设链接)
- [OpenClaw 工具集文档](https://docs.openclaw.ai)

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个集成开发指南。

## 许可证

MIT