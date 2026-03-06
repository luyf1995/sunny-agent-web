<template>
  <div class="bash-tool">
    <div class="bash-tool__header">
      <span class="bash-tool__icon">$</span>
      <span class="bash-tool__titil">Bash</span>
    </div>
    <div class="bash-tool__command">
      {{ command }}
    </div>
    <div class="bash-tool__result">
      {{ data.status === ToolCallStatus.Success ? result.stdout : result.error }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ToolCall, ToolCallBashToolArgs, ToolCallBashToolResult, ToolCallStatus } from '@/api/chat/types'

interface Props {
  data: ToolCall
}
const props = defineProps<Props>()

const command = computed(() => (props.data.args as ToolCallBashToolArgs).command)

const result = computed(() => props.data.result as ToolCallBashToolResult)
</script>
<style scoped lang="scss">
.bash-tool {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bash-tool__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bash-tool__icon {
  color: #67c23a;
}

.bash-tool__result {
  color: #94a3b8;
}
</style>
