<template>
  <div class="write-file" :class="isSuccess ? 'success' : 'error'">
    <pencil-line :size="14" class="write-file__icon" />
    <div class="write-file__info">
      <div class="write-file__path">
        {{ filename }}
      </div>
      <div class="write-file__msg" :title="result.error">
        {{ result.error }}
      </div>
    </div>
    <div class="write-file__result">
      <component :is="isSuccess ? FileCheck : TriangleAlert" :size="14" />
      {{ isSuccess ? '成功' : '失败' }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { PencilLine, TriangleAlert, FileCheck } from 'lucide-vue-next'

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
.write-file {
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
    .write-file__result {
      color: #67c23a;
    }
  }

  &.error {
    .write-file__result {
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
