# AI对话流式渲染中工具调用显示实现计划

## 需求概述
在AI对话流式渲染中，如果碰到工具调用，需要在流式中渲染工具显示，工具渲染完后继续markdown的渲染。

## 现状分析

### 当前代码结构
1. **use-chat.ts**: 处理SSE流式事件，已有 `ChatSSEEvent.ToolCall` 和 `ChatSSEEvent.ToolResult` 的处理逻辑
2. **types.ts**: 定义了 `ToolCall` 接口，但字段与实际使用存在不一致（`id` vs `step`）
3. **message-bubble.vue**: 只渲染了markdown内容，没有渲染工具调用
4. **stream-markdown/index.vue**: 使用 markstream-vue 库渲染markdown

### 存在的问题
1. `ToolCall` 类型定义中是 `id` 字段，但 `use-chat.ts` 中使用的是 `step` 字段
2. 消息气泡组件没有渲染工具调用
3. 缺少工具调用显示组件

## 实施步骤

### 步骤1: 统一ToolCall类型定义
- 修改 `src/api/chat/types.ts` 中的 `ToolCall` 接口
- 添加 `step` 字段，确保与后端返回数据一致
- 添加 `result` 字段用于存储工具调用结果

### 步骤2: 创建工具调用显示组件
- 创建 `src/components/chat-container/message-list/tool-call-item.vue`
- 显示工具名称、参数、状态和结果
- 支持展开/收起功能
- 显示加载动画（running状态）

### 步骤3: 创建工具调用列表组件
- 创建 `src/components/chat-container/message-list/tool-call-list.vue`
- 渲染所有工具调用
- 支持流式更新

### 步骤4: 修改消息气泡组件
- 修改 `src/components/chat-container/message-list/message-bubble.vue`
- 在markdown渲染之前或之间插入工具调用渲染
- 确保工具调用和markdown内容正确交替显示

### 步骤5: 优化流式渲染逻辑
- 确保 `use-chat.ts` 中的工具调用处理逻辑正确
- 处理工具调用和文本内容的交替显示

## 技术方案

### ToolCall 类型定义
```typescript
export interface ToolCall {
  id?: string
  step: number
  name: string
  args: Record<string, any>
  status: 'running' | 'done' | 'error'
  result?: any
  output?: string
}
```

### 工具调用显示组件结构
```vue
<template>
  <div class="tool-call-item" :class="status">
    <div class="tool-header" @click="toggleExpand">
      <div class="tool-icon">
        <component :is="statusIcon" />
      </div>
      <div class="tool-name">{{ name }}</div>
      <div class="tool-status">{{ statusText }}</div>
    </div>
    <div class="tool-body" v-if="expanded">
      <div class="tool-args" v-if="args">
        <pre>{{ JSON.stringify(args, null, 2) }}</pre>
      </div>
      <div class="tool-result" v-if="result">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
```

### 消息气泡组件修改
```vue
<template>
  <div class="message-bubble">
    <div class="message-avatar">...</div>
    <div class="message-body">
      <!-- 工具调用列表 -->
      <tool-call-list v-if="message.toolCalls?.length" :tool-calls="message.toolCalls" />
      <!-- Markdown内容 -->
      <div class="message-content">
        <markdown :message="message" />
      </div>
    </div>
  </div>
</template>
```

## 文件清单

### 需要创建的文件
1. `src/components/chat-container/message-list/tool-call-item.vue` - 单个工具调用组件
2. `src/components/chat-container/message-list/tool-call-list.vue` - 工具调用列表组件

### 需要修改的文件
1. `src/api/chat/types.ts` - 更新 ToolCall 类型定义
2. `src/components/chat-container/message-list/message-bubble.vue` - 添加工具调用渲染
3. `src/hooks/use-chat.ts` - 确保工具调用处理逻辑正确（可选）

## 验收标准
1. 工具调用在流式渲染过程中正确显示
2. 工具调用状态（running/done/error）正确展示
3. 工具调用结果正确显示
4. 工具调用渲染完成后，markdown内容继续正常渲染
5. UI风格与现有系统保持一致
