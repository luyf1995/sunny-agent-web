# Ask User 多问题展示优化规范

## Why
当前的 ask-user 组件只显示第一个问题，需要支持显示后端返回的所有问题，并提供更好的用户交互体验，包括单选按钮选项、其他选项输入框、以及所有问题回答完成后才能提交的功能。

## What Changes
- 修改 `ask-user.vue` 组件，支持显示多个问题
- 使用单选按钮列表展示选项
- 选择"其他"选项时，在该选项下方显示输入框
- 所有问题都回答完成后，才能点击提交按钮
- 提交时将所有回答一起发送给后端

## Impact
- Affected specs: Ask User 组件
- Affected code: 
  - `src/components/chat-container/components/tool-call/ask-user.vue` (修改)

## ADDED Requirements

### Requirement: 多问题展示
系统应显示后端返回的所有问题。

#### Scenario: 显示多个问题
- **WHEN** 后端返回多个问题
- **THEN** 按顺序显示所有问题，每个问题独立展示

### Requirement: 单选按钮选项
系统应使用单选按钮列表展示选项。

#### Scenario: 选项展示
- **WHEN** 显示问题选项
- **THEN** 每个选项前有单选按钮，用户只能选择一个选项

### Requirement: 其他选项输入框
系统应在选择"其他"选项时显示输入框。

#### Scenario: 选择其他选项
- **WHEN** 用户选择"其他"选项
- **THEN** 在该选项下方显示输入框，允许用户手动输入回答

#### Scenario: 切换选项
- **WHEN** 用户从"其他"选项切换到其他选项
- **THEN** 输入框隐藏，清空已输入的内容

### Requirement: 提交按钮控制
系统应在所有问题都回答后才允许提交。

#### Scenario: 部分问题未回答
- **WHEN** 存在未回答的问题
- **THEN** 提交按钮禁用

#### Scenario: 所有问题已回答
- **WHEN** 所有问题都已选择选项或输入内容
- **THEN** 提交按钮启用，用户可以提交

### Requirement: 批量提交回答
系统应将所有问题的回答一起提交。

#### Scenario: 提交回答
- **WHEN** 用户点击提交按钮
- **THEN** 将所有问题的回答组合后发送给后端
