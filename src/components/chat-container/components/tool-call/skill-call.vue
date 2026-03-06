<template>
  <div class="skill-call">
    <div class="skill-call__header">
      <Wand2 :size="16" class="skill-call__icon" :class="{ 'skill-call__icon--spinning': isRunning }" />
      <span class="skill-call__title">技能调用</span>
      <span class="skill-call__name">{{ skillName }}</span>
    </div>

    <div v-if="isRunning" class="skill-call__status">正在调用技能...</div>

    <div v-else-if="isError" class="skill-call__error">
      <AlertCircle :size="14" />
      <span>{{ result?.error || '调用失败' }}</span>
    </div>

    <div v-else-if="isSuccess" class="skill-call__success">
      <CheckCircle :size="14" />
      <span>调用成功</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Wand2, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { ToolCall, ToolCallSkillCallArgs, ToolCallSkillCallResult, ToolCallStatus } from '@/api/chat/types'

interface Props {
  data: ToolCall
}

const props = defineProps<Props>()

const skillName = computed<string>(() => (props.data.args as ToolCallSkillCallArgs)?.skill_name || '')

const result = computed<ToolCallSkillCallResult>(() => props.data.result as ToolCallSkillCallResult)

const isRunning = computed(() => props.data.status === ToolCallStatus.Running)

const isSuccess = computed(() => props.data.status === ToolCallStatus.Success)

const isError = computed(() => props.data.status === ToolCallStatus.Error)
</script>

<style scoped lang="scss">
.skill-call {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-call__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-call__icon {
  color: #8b5cf6;

  &--spinning {
    animation: spin 1s linear infinite;
  }
}

.skill-call__title {
  font-weight: 500;
  color: #1e293b;
}

.skill-call__name {
  padding: 2px 8px;
  font-size: 12px;
  color: #64748b;
  background-color: #f1f5f9;
  border-radius: 4px;
}

.skill-call__status {
  font-size: 12px;
  color: #94a3b8;
}

.skill-call__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ef4444;
  gap: 6px;
}

.skill-call__success {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #10b981;
  gap: 6px;
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
