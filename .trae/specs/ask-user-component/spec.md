# Ask User 组件开发规范

## Why
在AI流式回复中，当AI需要向用户询问问题时，需要一个专门的组件来展示问题并收集用户回答，支持预设选项和手动输入，回答后发送新消息给后端继续对话。

## What Changes
- 创建 `ask-user.vue` 组件，用于展示问题、选项和收集用户回答
- 在选项列表末尾添加"其他"选项，支持用户手动输入
- 用户回答后，发送新消息给后端继续对话
- 在 `tool-call/index.vue` 中注册新组件

## Impact
- Affected specs: 工具调用组件系统
- Affected code: 
  - `src/components/chat-container/components/tool-call/ask-user.vue` (新建)
  - `src/components/chat-container/components/tool-call/index.vue` (修改)

## ADDED Requirements

### Requirement: Ask User 组件展示
系统应提供专门的 Ask User 组件来展示问题和收集用户回答。

#### Scenario: 展示问题
- **WHEN** 工具状态为 `running`
- **THEN** 显示问题文本和选项列表

#### Scenario: 展示预设选项
- **WHEN** 后端返回选项列表
- **THEN** 显示所有预设选项，并在末尾添加"其他"选项

#### Scenario: 用户选择预设选项
- **WHEN** 用户点击预设选项
- **THEN** 将选项作为回答，发送新消息给后端

#### Scenario: 用户选择"其他"选项
- **WHEN** 用户点击"其他"选项
- **THEN** 显示输入框，允许用户手动输入回答

#### Scenario: 用户手动输入回答
- **WHEN** 用户在输入框中输入内容并提交
- **THEN** 将输入内容作为回答，发送新消息给后端

### Requirement: 发送回答消息
用户回答后，系统应发送新消息给后端继续对话。

#### Scenario: 发送回答
- **WHEN** 用户完成回答（选择选项或手动输入）
- **THEN** 发送包含回答的新消息给后端，继续对话流程
