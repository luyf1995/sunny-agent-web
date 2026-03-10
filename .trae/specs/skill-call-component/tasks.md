# Tasks

- [x] Task 1: 添加 SkillCall 类型定义
  - [x] SubTask 1.1: 在 types.ts 中添加 ToolCallSkillCallArgs 接口（包含 skill_name 字段）
  - [x] SubTask 1.2: 在 types.ts 中添加 ToolCallSkillCallResult 接口（包含 status 和 error 字段）
  - [x] SubTask 1.3: 在 ToolCallName 枚举中添加 SkillCall 类型
  - [x] SubTask 1.4: 更新 ToolCall 接口的 args 和 result 联合类型

- [x] Task 2: 创建 skill-call.vue 组件
  - [x] SubTask 2.1: 定义组件 Props 接口，接收 ToolCall 类型数据
  - [x] SubTask 2.2: 实现调用状态展示（running/success/error）
  - [x] SubTask 2.3: 显示技能名称
  - [x] SubTask 2.4: 添加组件样式，保持与其他工具组件风格一致

- [x] Task 3: 注册 skill-call 组件
  - [x] SubTask 3.1: 在 tool-call/index.vue 中导入 SkillCall 组件
  - [x] SubTask 3.2: 在 COMPONENT_MAP 中添加 SkillCall 映射

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
