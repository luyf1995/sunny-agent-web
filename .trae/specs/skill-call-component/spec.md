# Skill Call 组件开发规范

## Why
在AI流式回复中，当AI调用技能（skill）时，需要一个专门的组件来展示技能调用的状态和结果，提升用户体验和信息可读性。

## What Changes
- 在 `types.ts` 中添加 `SkillCall` 相关类型定义
- 在 `ToolCallName` 枚举中添加 `SkillCall` 类型
- 创建 `skill-call.vue` 组件，用于展示技能调用的状态和结果
- 在 `tool-call/index.vue` 中注册新组件
- 在 `use-chat.ts` 中处理 `skill_call` 事件

## Impact
- Affected specs: 工具调用组件系统
- Affected code: 
  - `src/api/chat/types.ts` (修改)
  - `src/components/chat-container/components/tool-call/skill-call.vue` (新建)
  - `src/components/chat-container/components/tool-call/index.vue` (修改)
  - `src/hooks/use-chat.ts` (修改)

## ADDED Requirements

### Requirement: Skill Call 类型定义
系统应在类型定义中添加 SkillCall 相关类型。

#### Scenario: 类型定义
- **WHEN** 定义 SkillCall 类型
- **THEN** args 包含 skill_name 字段（string类型），result 包含 status 字段（string类型）和 error 字段（string类型，可选）

### Requirement: Skill Call 组件展示
系统应提供专门的 Skill Call 组件来展示技能调用的过程和结果。

#### Scenario: 调用进行中
- **WHEN** 工具状态为 `running`
- **THEN** 显示技能图标动画和"正在调用技能..."提示

#### Scenario: 调用成功
- **WHEN** 工具状态为 `success`
- **THEN** 显示技能名称和成功状态

#### Scenario: 调用失败
- **WHEN** 工具状态为 `error`
- **THEN** 显示技能名称和错误信息

### Requirement: 事件处理
系统应在流式响应中正确处理 skill_call 事件。

#### Scenario: 接收 skill_call 事件
- **WHEN** 收到 skill_call 事件
- **THEN** 创建新的工具调用记录并添加到消息内容中

#### Scenario: 接收 skill_result 事件
- **WHEN** 收到 skill_result 事件
- **THEN** 更新对应的工具调用状态和结果
