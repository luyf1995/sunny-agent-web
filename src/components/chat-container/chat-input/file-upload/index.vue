<template>
  <el-popover placement="top-start" :width="200" trigger="click">
    <button-icon class="upload-btn">
      <paperclip :size="18" />
      从本地添加文件
    </button-icon>
    <template #reference>
      <button-icon class="toolbar-btn">
        <plus :size="18" />
      </button-icon>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { Plus, Paperclip } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
</script>
<style scoped lang="scss">
@use '../toolbar-btn';

.upload-btn {
  justify-content: flex-start;
  padding: 12px 16px;
  width: 100%;
  font-size: 14px;
  text-align: left;
  gap: 10px;
}
</style>
