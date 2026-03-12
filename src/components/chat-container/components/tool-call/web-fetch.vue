<template>
  <div class="web-fetch">
    <div class="web-fetch__header">
      <earth-lock :size="16" class="web-fetch__icon" :class="{ 'web-fetch__icon--spinning': isRunning }" />
      <span class="web-fetch__title">网络获取</span>
    </div>

    <div v-if="isRunning" class="web-fetch__status">网络获取中...</div>

    <div v-else-if="isError" class="web-fetch__error">
      <AlertCircle :size="14" />
      <span>{{ result?.error || '获取失败' }}</span>
    </div>

    <div v-else-if="isSuccess" class="web-fetch__success">
      <a :href="result?.url" target="_blank">{{ result?.url }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EarthLock, AlertCircle } from 'lucide-vue-next'
import { ToolCall, ToolCallWebFetchResult, ToolCallStatus } from '@/api/chat/tool-call'

interface Props {
  data: ToolCall
}

const props = defineProps<Props>()

const result = computed<ToolCallWebFetchResult>(() => props.data.result as ToolCallWebFetchResult)

const isRunning = computed(() => props.data.status === ToolCallStatus.Running)

const isSuccess = computed(() => props.data.status === ToolCallStatus.Success)

const isError = computed(() => props.data.status === ToolCallStatus.Error)
</script>

<style scoped lang="scss">
.web-fetch {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.web-fetch__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.web-fetch__icon {
  color: #3b82f6;

  &--spinning {
    animation: spin 1s linear infinite;
  }
}

.web-fetch__title {
  font-weight: 500;
  color: #1e293b;
}

.web-fetch__status {
  font-size: 12px;
  color: #94a3b8;
}

.web-fetch__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ef4444;
  gap: 6px;
}

.web-fetch__success {
  font-size: 12px;
  color: #22c55e;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
