<template>
  <div class="file-list">
    <div v-for="item in uploadingFiles" :key="item.id" :class="['input-file-card', item.status]">
      <div class="input-file-icon">
        <FileText :size="20" />
      </div>
      <div class="input-file-info">
        <span class="input-file-name">{{ getFileName(item.file.name) }}</span>
        <span class="input-file-meta">
          {{ getFileExtension(item.file.name) }} · {{ formatSize(item.file.size) }}
          <template v-if="item.status === 'uploading'"> · {{ item.progress }}%</template>
        </span>
      </div>
      <button class="input-file-remove" title="移除" @click="removeUploadingFile(item.id)">
        <X :size="14" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText, X } from 'lucide-vue-next'

interface UploadingFile {
  id: string
  file: File
  status: 'uploading' | 'success' | 'error'
  progress?: number
}

defineProps<{
  uploadingFiles: UploadingFile[]
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

const getFileName = (name: string): string => {
  return name.replace(/\.[^/.]+$/, '')
}

const getFileExtension = (name: string): string => {
  return name.slice(name.lastIndexOf('.') + 1).toUpperCase()
}

const formatSize = (size: number): string => {
  if (size === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(size) / Math.log(k))
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const removeUploadingFile = (id: string) => {
  emit('remove', id)
}
</script>

<style scoped lang="scss">
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px 0;
}

.input-file-card {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  gap: 10px;
  transition: all 0.15s;

  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }

  &.success {
    .input-file-icon {
      color: #10b981;
    }
  }

  &.error {
    .input-file-icon {
      color: #ef4444;
    }
  }

  &.uploading {
    .input-file-icon {
      color: #3b82f6;
    }
  }

  .input-file-icon {
    display: flex;
    align-items: center;
    color: #64748b;
  }

  .input-file-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;

    .input-file-name {
      overflow: hidden;
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #1e293b;
    }

    .input-file-meta {
      font-size: 11px;
      color: #94a3b8;
    }
  }

  .input-file-remove {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    color: #94a3b8;
    background: none;
    border: none;
    border-radius: 4px;
    transition: all 0.15s;
    cursor: pointer;

    &:hover {
      color: #ef4444;
      background-color: #fee2e2;
    }
  }
}
</style>
