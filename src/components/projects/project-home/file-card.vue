<template>
  <div class="card">
    <div class="card-header">
      <span>文件</span>
      <el-button class="card-header__btn">
        <plus :size="16" />
      </el-button>
    </div>
    <div class="card-body">
      <div class="file-info">
        <file-text :size="16" />
        <span>测试文件.txt</span>
      </div>
      <div class="tips">2 个文件</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Plus, FileText } from 'lucide-vue-next'
</script>
<style scoped lang="scss">
@use './card';

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
</style>
