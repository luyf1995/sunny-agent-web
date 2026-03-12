# Web Fetch 组件开发规范

## Why
在AI对话流式渲染中，当AI调用网络获取工具时，需要一个专门的组件来展示获取过程，提升用户体验。

## What Changes
- 创建 `web-fetch.vue` 组件，用于展示网络获取工具调用的状态
- 在 `tool-call/index.vue` 中注册新组件
- 组件只需展示 loading 效果，显示"网络获取中..."提示

## Impact
- Affected specs: 工具调用组件系统
- Affected code: 
  - `src/components/chat-container/components/tool-call/web-fetch.vue` (新建)
  - `src/components/chat-container/components/tool-call/index.vue` (修改)

## ADDED Requirements

### Requirement: Web Fetch 组件展示
系统应提供专门的 Web Fetch 组件来展示网络获取工具调用的过程。

#### Scenario: 获取进行中
- **WHEN** 工具状态为 `running`
- **THEN** 显示下载图标动画和"网络获取中..."提示

#### Scenario: 获取成功
- **WHEN** 工具状态为 `success`
- **THEN** 显示"网络获取完成"提示

#### Scenario: 获取失败
- **WHEN** 工具状态为 `error`
- **THEN** 显示错误信息
