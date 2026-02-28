<template>
  <div class="sidebar-header">
    <div class="sidebar-logo">
      <logo-icon :width="24" :height="24" />
      <h1 class="sidebar-title">Sunny Agent</h1>
    </div>
    <button class="collapse-btn" title="收起">
      <collapse-icon />
    </button>
  </div>
</template>
<script setup lang="ts">
import LogoIcon from '@/components/svgs/logo-icon.vue'
import CollapseIcon from '@/components/svgs/collapse-icon.vue'
</script>
<style scoped lang="scss">
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  overflow: hidden;
  color: #1e40af;
  gap: 10px;
  line-height: 25px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
}

.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 8px;
  transition:
    background 0.2s,
    color 0.2s;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: #1e293b;
    background-color: #f1f5f9;
  }
}
</style>
