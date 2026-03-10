# Tasks

- [x] Task 1: 添加全局状态管理 ask-user 数据
  - [x] SubTask 1.1: 在 use-chat.ts 中添加 askUserQuestion 状态
  - [x] SubTask 1.2: 在 use-chat.ts 中添加 showAskUser 计算属性
  - [x] SubTask 1.3: 处理 ask_user 工具调用事件，设置 askUserQuestion 数据

- [x] Task 2: 修改 chat-container 组件
  - [x] SubTask 2.1: 在 chat-container 中添加 ask-user 覆盖层
  - [x] SubTask 2.2: 根据 showAskUser 状态显示/隐藏覆盖层
  - [x] SubTask 2.3: 覆盖层显示时隐藏聊天输入框

- [x] Task 3: 重构 ask-user 组件
  - [x] SubTask 3.1: 修改组件接收 QuestionItem[] 数据
  - [x] SubTask 3.2: 实现单个问题展示
  - [x] SubTask 3.3: 实现左右切换功能
  - [x] SubTask 3.4: 实现进度指示器
  - [x] SubTask 3.5: 实现单题提交逻辑
  - [x] SubTask 3.6: 更新组件样式为覆盖层样式

- [x] Task 4: 清理旧代码
  - [x] SubTask 4.1: 从 tool-call/index.vue 中移除 AskUser 组件注册

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 2 和 Task 3
