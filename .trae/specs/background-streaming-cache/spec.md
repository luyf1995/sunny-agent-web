# 后台流式回复缓存 Spec

## Why
当用户在对话中发送消息后，流式回复过程中切换到其他对话时，当前实现会中断流式请求，导致用户无法看到完整的回复。需要实现后台继续回复的功能，将消息缓存到对应对话中，用户切换回去时可以看到完整回复或继续流式显示。

## What Changes
- 重构 `useChat` hook，支持多对话消息缓存
- 新增对话消息缓存管理器，按 `session_id` 存储消息
- 切换对话时，后台流式请求继续运行，消息存入对应对话缓存
- 切换回对话时，从缓存加载消息，如流式未完成则继续显示

## Impact
- Affected specs: 无
- Affected code: 
  - `src/hooks/use-chat.ts`
  - `src/components/chat-container/index.vue`
  - `src/store/module.ts` (可能需要新增缓存状态)

## ADDED Requirements

### Requirement: 多对话消息缓存
系统 SHALL 为每个对话维护独立的消息缓存，支持后台流式回复继续运行。

#### Scenario: 流式回复中切换对话
- **GIVEN** 用户在对话 A 中发送消息，流式回复正在进行
- **WHEN** 用户切换到对话 B 或新建对话
- **THEN** 系统 SHALL 继续对话 A 的流式请求，将消息存入对话 A 的缓存中
- **AND** 对话 B 正常显示，不受对话 A 流式请求影响

#### Scenario: 切换回流式中的对话
- **GIVEN** 对话 A 的流式回复正在后台进行
- **WHEN** 用户切换回对话 A
- **THEN** 系统 SHALL 从缓存加载对话 A 的消息
- **AND** 如流式未完成，继续显示流式回复内容

#### Scenario: 流式回复完成
- **GIVEN** 对话 A 的流式回复在后台完成
- **WHEN** 用户切换回对话 A
- **THEN** 系统 SHALL 显示完整的回复内容

### Requirement: 流式状态管理
系统 SHALL 为每个对话维护独立的流式状态。

#### Scenario: 多对话流式状态
- **GIVEN** 对话 A 正在流式回复
- **WHEN** 用户切换到对话 B 并发送消息
- **THEN** 对话 B 开始新的流式回复
- **AND** 对话 A 的流式回复继续在后台运行
- **AND** 两个对话的流式状态相互独立

### Requirement: 缓存清理
系统 SHALL 在适当时机清理对话缓存以释放内存。

#### Scenario: 缓存清理时机
- **WHEN** 对话流式回复完成且用户已查看
- **OR** 用户删除对话
- **OR** 组件卸载
- **THEN** 系统 SHALL 清理该对话的缓存
