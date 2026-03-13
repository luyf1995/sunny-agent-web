<template>
  <div class="present-files">
    <div class="present-files__header">
      <FileText :size="16" class="present-files__icon" :class="{ 'present-files__icon--spinning': isRunning }" />
      <span class="present-files__title">文件展示</span>
    </div>

    <div v-if="isRunning" class="present-files__status">正在加载文件...</div>

    <div v-else-if="isError" class="present-files__error">
      <AlertCircle :size="14" />
      <span>{{ result?.error || '加载失败' }}</span>
    </div>

    <div v-else-if="isSuccess && result?.files?.length" class="present-files__content">
      <!-- <div class="present-files__message" v-if="result.message">{{ result.message }}</div> -->
      <div class="present-files__list">
        <a
          v-for="(file, index) in result.files"
          :key="index"
          :href="file.download_url"
          :download="file.name"
          class="present-files__item"
        >
          <div class="present-files__item-icon">
            <FileIcon :size="20" />
          </div>
          <div class="present-files__item-info">
            <div class="present-files__item-name">{{ file.name }}</div>
            <div class="present-files__item-path">{{ file.path }}</div>
          </div>
          <Download :size="16" class="present-files__item-download" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileText, AlertCircle, Download, FileIcon } from 'lucide-vue-next'
import { ToolCall, ToolCallPresentFilesResult, ToolCallStatus } from '@/api/chat/tool-call'

interface Props {
  data: ToolCall
}

const props = defineProps<Props>()

const result = computed<ToolCallPresentFilesResult>(() => props.data.result as ToolCallPresentFilesResult)

const isRunning = computed(() => props.data.status === ToolCallStatus.Running)

const isSuccess = computed(() => props.data.status === ToolCallStatus.Success)

const isError = computed(() => props.data.status === ToolCallStatus.Error)
</script>

<style scoped lang="scss">
.present-files {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.present-files__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.present-files__icon {
  color: #10b981;

  &--spinning {
    animation: spin 1s linear infinite;
  }
}

.present-files__title {
  font-weight: 500;
  color: #1e293b;
}

.present-files__status {
  font-size: 12px;
  color: #94a3b8;
}

.present-files__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ef4444;
  gap: 6px;
}

.present-files__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.present-files__message {
  padding: 8px 10px;
  font-size: 13px;
  color: #475569;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  line-height: 1.5;
}

.present-files__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.present-files__item {
  display: flex;
  align-items: center;
  padding: 12px;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
  gap: 12px;

  &:hover {
    border-color: #10b981;
    box-shadow: 0 2px 8px rgb(16 185 129 / 10%);

    .present-files__item-download {
      color: #10b981;
    }
  }
}

.present-files__item-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: #10b981;
  background-color: #f0fdf4;
  border-radius: 8px;
}

.present-files__item-info {
  flex: 1;
  min-width: 0;
}

.present-files__item-name {
  overflow: hidden;
  font-size: 14px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1e293b;
  font-weight: 500;
}

.present-files__item-path {
  overflow: hidden;
  margin-top: 2px;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #94a3b8;
}

.present-files__item-download {
  color: #94a3b8;
  transition: color 0.2s;
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
