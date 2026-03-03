<template>
  <div class="project-workspace">
    <div class="database-panel panel-card">
      <project-database></project-database>
    </div>
    <div class="chat-panel panel-card"></div>
  </div>
</template>
<script setup lang="ts">
import ProjectDatabase from '../project-database/index.vue'
</script>
<style scoped lang="scss">
@use './index';
</style>
