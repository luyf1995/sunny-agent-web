# Tasks

- [x] Task 1: 创建对话消息缓存管理器
  - [x] SubTask 1.1: 创建 `ConversationCache` 接口定义，包含 messages、isStreaming、abortController 等字段
  - [x] SubTask 1.2: 创建 `conversationCacheStore`，使用 Map 按 session_id 存储各对话缓存
  - [x] SubTask 1.3: 实现 getCache、setCache、removeCache 等方法

- [x] Task 2: 重构 useChat hook 支持多对话缓存
  - [x] SubTask 2.1: 修改 sendMessage 函数，将消息存入对应对话的缓存
  - [x] SubTask 2.2: 修改流式事件处理，更新对应对话缓存中的消息
  - [x] SubTask 2.3: 添加 getCurrentConversationMessages 方法，获取当前对话的消息
  - [x] SubTask 2.4: 添加 isConversationStreaming 方法，判断指定对话是否在流式中

- [x] Task 3: 修改 chat-container 组件适配缓存机制
  - [x] SubTask 3.1: 修改 watch currentConversation 逻辑，从缓存加载消息
  - [x] SubTask 3.2: 切换对话时不中断流式请求，而是切换显示的消息
  - [x] SubTask 3.3: 处理新建对话时的缓存逻辑

- [x] Task 4: 处理边界情况
  - [x] SubTask 4.1: 处理对话删除时清理缓存
  - [x] SubTask 4.2: 处理组件卸载时清理已完成对话的缓存
  - [x] SubTask 4.3: 处理新建对话流式中切换的场景

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4 依赖 Task 3
