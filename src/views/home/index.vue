<template>
  <div class="page-layout">
    <sidebar class="sidebar-layout"></sidebar>
    <main class="main-layout"></main>
  </div>
</template>
<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
</script>
<style scoped lang="scss">
.page-layout {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
