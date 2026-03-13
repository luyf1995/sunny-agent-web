<template>
  <div class="cron-create" :class="statusClass">
    <div class="cron-create__header">
      <div class="cron-create__header-left">
        <div class="cron-create__icon-wrapper">
          <Loader2 v-if="isRunning" :size="18" class="cron-create__icon cron-create__icon--spinning" />
          <CalendarClock v-else :size="18" class="cron-create__icon" />
        </div>
        <div class="cron-create__title-wrapper">
          <div class="cron-create__title">{{ name }}</div>
          <div class="cron-create__subtitle">定时任务</div>
        </div>
      </div>
    </div>

    <div v-if="isRunning" class="cron-create__status">
      <span>正在创建定时任务...</span>
    </div>

    <div v-else-if="isError" class="cron-create__error">
      <AlertCircle :size="14" />
      <span>{{ result?.error || '创建定时任务失败' }}</span>
    </div>

    <template v-else-if="isSuccess">
      <div class="cron-create__divider"></div>
      <div class="cron-create__info">
        <div class="cron-create__info-row">
          <span class="cron-create__info-label">计划</span>
          <span class="cron-create__info-value">{{ repeatText }}</span>
        </div>
        <div class="cron-create__info-row">
          <span class="cron-create__info-label">下次运行</span>
          <span class="cron-create__info-value">{{ nextRunTimeText }}</span>
        </div>
      </div>
      <div v-if="description" class="cron-create__description">
        {{ description }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CalendarClock, Loader2, AlertCircle } from 'lucide-vue-next'
import { ToolCall, ToolCallCronCreateArgs, ToolCallCronCreateResult, ToolCallStatus } from '@/api/chat/tool-call'
import { formatCronDisplay } from '@/components/admin-manage/scheduled-task/cron'

interface Props {
  data: ToolCall
}

const props = defineProps<Props>()

const args = computed<ToolCallCronCreateArgs>(() => props.data.args as ToolCallCronCreateArgs)
const result = computed<ToolCallCronCreateResult>(() => props.data.result as ToolCallCronCreateResult)

const name = computed(() => args.value?.name || result.value?.name || '定时任务')
const description = computed(() => args.value?.description || result.value?.description || '')
const cronExpr = computed(() => args.value?.cron_expr || result.value?.cron_expr || '')
const nextRunTime = computed(() => result.value?.next_run_at || '')

const isRunning = computed(() => props.data.status === ToolCallStatus.Running)
const isSuccess = computed(() => props.data.status === ToolCallStatus.Success)
const isError = computed(() => props.data.status === ToolCallStatus.Error)

const statusClass = computed(() => ({
  'cron-create--running': isRunning.value,
  'cron-create--success': isSuccess.value,
  'cron-create--error': isError.value
}))

/**
 * 解析 cron 表达式为中文描述
 * 简化版本，支持常见的每天、每周等格式
 */
const repeatText = computed(() => {
  return formatCronDisplay(cronExpr.value)
})

/**
 * 格式化下次运行时间
 */
const nextRunTimeText = computed(() => {
  if (!nextRunTime.value) return '-'

  const date = new Date(nextRunTime.value)
  if (isNaN(date.getTime())) return nextRunTime.value

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[date.getDay()]
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = date.getHours() < 12 ? '上午' : '下午'

  return `${year}年${month}月${day}日 (${weekDay}) 的${period} ${hours}:${minutes}`
})
</script>

<style scoped lang="scss">
.cron-create {
  display: flex;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  flex-direction: column;
}

.cron-create--error {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.cron-create__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.cron-create__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cron-create__icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background-color: #f1f5f9;
  border-radius: 8px;
}

.cron-create__icon {
  color: #475569;

  &--spinning {
    color: #3b82f6;
    animation: spin 1s linear infinite;
  }
}

.cron-create--error .cron-create__icon-wrapper {
  background-color: #fee2e2;
}

.cron-create--error .cron-create__icon {
  color: #ef4444;
}

.cron-create__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cron-create__title {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

.cron-create__subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.cron-create__status {
  padding: 0 16px 16px;
  font-size: 13px;
  color: #64748b;
}

.cron-create__error {
  display: flex;
  align-items: center;
  padding: 0 16px 16px;
  font-size: 13px;
  color: #ef4444;
  gap: 6px;
}

.cron-create__divider {
  margin: 0 16px;
  height: 1px;
  background-color: #e2e8f0;
}

.cron-create__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.cron-create__info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.cron-create__info-label {
  color: #64748b;
}

.cron-create__info-value {
  color: #1e293b;
  font-weight: 500;
}

.cron-create__description {
  padding: 12px 16px;
  font-size: 13px;
  color: #64748b;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  line-height: 1.5;
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
