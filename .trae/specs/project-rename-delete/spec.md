# 项目模块重命名和删除功能 Spec

## Why
项目模块目前缺少重命名和删除功能的实际实现，菜单项只打印日志。需要参考 session 模块的实现方式，为项目模块添加完整的重命名和删除功能。

## What Changes
- 在 `project-item` 组件中实现重命名功能，复用现有的 `save-project` 弹框
- 在 `project-item` 组件中实现删除功能，包含确认对话框
- 在父组件中处理 `renamed` 和 `deleted` 事件

## Impact
- Affected code:
  - `src/components/projects/project-item/index.vue`
  - `src/views/home/sidebar/sidebar-project/index.vue`

## ADDED Requirements

### Requirement: 项目重命名功能
系统应提供项目重命名功能，允许用户通过菜单项修改项目名称。

#### Scenario: 重命名项目成功
- **WHEN** 用户点击项目菜单中的"重命名"选项
- **THEN** 显示重命名弹框，预填充当前项目名称
- **WHEN** 用户输入新名称并确认
- **THEN** 调用 API 更新项目名称，更新列表中的项目名称，显示成功提示

#### Scenario: 重命名取消
- **WHEN** 用户点击取消或关闭弹框
- **THEN** 不执行任何更新操作

### Requirement: 项目删除功能
系统应提供项目删除功能，允许用户删除项目。

#### Scenario: 删除项目成功
- **WHEN** 用户点击项目菜单中的"删除项目"选项
- **THEN** 显示确认对话框
- **WHEN** 用户确认删除
- **THEN** 调用 API 删除项目，从列表中移除项目，如果删除的是当前项目则清空选中状态

#### Scenario: 删除取消
- **WHEN** 用户在确认对话框中点击取消
- **THEN** 不执行任何删除操作
