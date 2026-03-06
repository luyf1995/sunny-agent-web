<template>
  <div class="tool-call">
    <component :is="COMPONENT_MAP[data.name]" :data="data"></component>
  </div>
</template>
<script setup lang="ts">
import { markRaw } from 'vue'

import TodoList from './todo-list.vue'
import WriteFile from './write-file.vue'
import ReadFile from './read-file.vue'
import BashTool from './bash-tool.vue'

import { ToolCall, ToolCallName } from '@/api/chat/types'

interface Props {
  data: ToolCall
}
const props = defineProps<Props>()

const COMPONENT_MAP = {
  [ToolCallName.WriteFile]: markRaw(WriteFile),
  [ToolCallName.ReadFile]: markRaw(ReadFile),
  [ToolCallName.TodoWrite]: markRaw(TodoList),
  [ToolCallName.TodoRead]: markRaw(TodoList),
  [ToolCallName.BashTool]: markRaw(BashTool)
}
</script>

<style scoped lang="scss">
.tool-call {
  padding: 10px;
  font-size: 12px;
  background-color: #f1f5f9;
  border: var(--border);
}
</style>
