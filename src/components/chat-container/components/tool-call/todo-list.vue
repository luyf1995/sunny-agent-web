<template>
  <div class="todo-list">
    <div v-if="result?.title" class="todo-title">{{ result.title }}</div>
    <div v-for="item in todoList" :key="item.id" class="todo-item" :class="[getStatusConfig(item.status).className]">
      <component :is="getStatusConfig(item.status).icon" :size="16" class="todo-item__icon" />
      <span class="todo-item__content">{{ item.content }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

import { Loader, CircleCheckBig, Circle } from 'lucide-vue-next'

import { ToolCall, TodoItem, TodoItemStatus, ToolCallTodoArgs, ToolCallTodoResult } from '@/api/chat/types'

interface Props {
  data: ToolCall
}
const props = defineProps<Props>()

const todoList = computed<TodoItem[]>(() => (props.data?.args as ToolCallTodoArgs)?.todos || [])

const result = computed<ToolCallTodoResult>(() => props.data.result as ToolCallTodoResult)

/**
 * 根据状态获取图标
 */
const getStatusConfig = (status: TodoItemStatus) => {
  if (status === TodoItemStatus.Completed) {
    return {
      icon: CircleCheckBig,
      className: 'todo-item--completed'
    }
  } else if (status === TodoItemStatus.InProgress) {
    return {
      icon: Loader,
      className: 'todo-item--in-progress'
    }
  }
  return {
    icon: Circle,
    className: ''
  }
}
</script>
<style scoped lang="scss">
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  .todo-item__icon {
    color: #94a3b8;
  }

  &--completed {
    .todo-item__icon {
      color: #67c23a;
    }

    .todo-item__content {
      text-decoration: line-through;
      color: #999ca1;
    }
  }
}
</style>
