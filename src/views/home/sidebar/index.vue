<template>
  <div class="sidebar">
    <sidebar-header />
    <div class="sidebar-content"></div>
  </div>
</template>
<script lang="ts" setup>
import SidebarHeader from './sidebar-header/index.vue'
</script>
<style scoped lang="scss">
.sidebar {
  display: flex;
  width: 240px;
  height: 100%;
  background-color: #f1f5f9;
  transition: width 0.2s ease;
  border-right: 1px solid #e2e8f0;
  flex-direction: column;
  flex-shrink: 0;
}
</style>
