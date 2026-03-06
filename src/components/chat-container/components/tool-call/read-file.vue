<template>
  <div class="read-file" :class="result.status === ToolCallStatus.Success ? 'success' : 'error'">
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
      <component
        :is="result.status === ToolCallStatus.Success ? FileCheck : TriangleAlert"
        :size="14"
        class="result-icon"
      />
      <span>{{ result.status === ToolCallStatus.Success ? 'Success' : 'Error' }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { FolderSearch, TriangleAlert, FileCheck } from 'lucide-vue-next'

import { ToolCall, ToolCallReadFileArgs, ToolCallReadFileResult, ToolCallStatus } from '@/api/chat/types'

interface Props {
  data: ToolCall
}
const props = defineProps<Props>()

const path = computed(() => (props.data.args as ToolCallReadFileArgs).path)
const filename = computed(() => path.value.split('/').pop() || '/')

const result = computed(() => props.data.result as ToolCallReadFileResult)
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
