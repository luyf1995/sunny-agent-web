# Ask User 覆盖层展示规范

## Why
当前的 ask-user 组件在 message-list 中显示，用户体验不佳。需要将其改为覆盖在聊天输入框上方的形式，并提供多个问题时的左右切换功能，提升用户交互体验。

## What Changes
- 将 ask-user 组件从 message-list 中移除，改为在 chat-container 中以覆盖层形式展示
- 覆盖层覆盖聊天输入框区域
- 多个问题时，增加左右切换功能，每次只显示一个问题
- 提供问题进度指示器

## Impact
- Affected specs: Ask User 组件、Chat Container
- Affected code: 
  - `src/components/chat-container/index.vue` (修改)
  - `src/components/chat-container/components/tool-call/ask-user.vue` (修改)
  - `src/components/chat-container/components/tool-call/index.vue` (修改)
  - `src/hooks/use-chat.ts` (修改)
  - `src/api/chat/types.ts` (修改)

## ADDED Requirements

### Requirement: 覆盖层展示
系统应将 ask-user 组件以覆盖层形式展示在聊天输入框上方。

#### Scenario: 显示覆盖层
- **WHEN** 收到 ask_user 工具调用
- **THEN** 在聊天输入框上方显示覆盖层，隐藏聊天输入框

#### Scenario: 隐藏覆盖层
- **WHEN** 用户提交回答后
- **THEN** 隐藏覆盖层，恢复显示聊天输入框

### Requirement: 问题切换
系统应支持多个问题的左右切换功能。

#### Scenario: 显示单个问题
- **WHEN** 有多个问题时
- **THEN** 每次只显示一个问题，用户可以通过左右按钮切换

#### Scenario: 切换问题
- **WHEN** 用户点击左右切换按钮
- **THEN** 切换到上一个或下一个问题，并显示当前问题进度

#### Scenario: 进度指示
- **WHEN** 显示问题时
- **THEN** 显示当前问题序号和总问题数（如 1/3）

### Requirement: 提交控制
系统应在当前问题回答后才允许切换到下一题或提交。

#### Scenario: 未回答时禁用切换
- **WHEN** 当前问题未回答
- **THEN** 禁用"下一题"按钮或"提交"按钮

#### Scenario: 已回答时启用切换
- **WHEN** 当前问题已回答
- **THEN** 启用"下一题"按钮或"提交"按钮

## MODIFIED Requirements

### Requirement: 数据传递
系统应通过全局状态传递 ask-user 数据。

#### Scenario: 接收 ask-user 数据
- **WHEN** 收到 ask_user 工具调用
- **THEN** 将数据存储到全局状态，触发覆盖层显示
