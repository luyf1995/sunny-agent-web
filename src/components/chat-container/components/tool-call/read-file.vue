<template>
  <div class="read-file" :class="isSuccess ? 'success' : 'error'">
    <folder-search :size="14" class="read-file__icon" />
    <div class="read-file__info">
      <div class="read-file__path">
        {{ filename }}
      </div>
      <div class="read-file__msg" :title="result.error">
        {{ result.error }}
      </div>
    </div>
    <div class="read-file__result">
      <component :is="isSuccess ? FileCheck : TriangleAlert" :size="14" class="result-icon" />
      <span>{{ isSuccess ? 'Success' : 'Error' }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { FolderSearch, TriangleAlert, FileCheck } from 'lucide-vue-next'

import { ToolCall, ToolCallReadFileArgs, ToolCallReadFileResult, ToolCallStatus } from '@/api/chat/tool-call'

interface Props {
  data: ToolCall
}
const props = defineProps<Props>()

const path = computed(() => (props.data.args as ToolCallReadFileArgs).path)
const filename = computed(() => path.value.split('/').pop() || '/')

const result = computed(() => props.data.result as ToolCallReadFileResult)

// const isRunning = computed(() => props.data.status === ToolCallStatus.Running)

const isSuccess = computed(() => props.data.status === ToolCallStatus.Success)

const isError = computed(() => props.data.status === ToolCallStatus.Error)
</script>
<style scoped lang="scss">
.read-file {
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  gap: 8px;

  &__icon {
    color: #e6a23c;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 8px;
    overflow: hidden;
  }

  &.success {
    .read-file__result {
      color: #67c23a;
    }
  }

  &.error {
    .read-file__result {
      color: #e6a23c;
    }
  }

  &__result {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  &__msg {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999ca1;
  }
}
</style>
