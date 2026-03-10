# Tasks

- [x] Task 1: 修改 project-item 组件实现重命名和删除功能
  - [x] 1.1 添加 renameVisible ref 和 renameData ref 控制重命名弹框
  - [x] 1.2 引入 save-project 组件用于重命名
  - [x] 1.3 实现 handleRename 方法打开重命名弹框
  - [x] 1.4 实现 handleDelete 方法，包含确认对话框和 API 调用
  - [x] 1.5 添加 deleted 和 renamed 事件定义
  - [x] 1.6 实现 handleRenameSuccess 方法触发 renamed 事件

- [x] Task 2: 修改 sidebar-project 组件处理事件
  - [x] 2.1 在 project-list 上添加 @renamed 和 @deleted 事件监听
  - [x] 2.2 实现 handleRenamed 方法更新列表中的项目名称
  - [x] 2.3 实现 handleDeleted 方法从列表中移除项目并清空选中状态

- [x] Task 3: 修改 project-list 组件传递事件
  - [x] 3.1 添加 renamed 和 deleted 事件定义
  - [x] 3.2 在 project-item 上监听 renamed 和 deleted 事件并向上传递

# Task Dependencies
- Task 2 依赖 Task 1 和 Task 3
