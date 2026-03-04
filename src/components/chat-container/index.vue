<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>Sunny Agents</h1>
      <span class="thread-id">线程: 26099b3b</span>
    </div>
    <div class="chat-message"></div>
    <chat-input />
  </div>
</template>
<script setup lang="ts">
import ChatInput from './chat-input/index.vue'
</script>
<style scoped lang="scss">
.chat-container {
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  height: 100%;
  flex-direction: column;

  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: var(--border);
    flex-shrink: 0;

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }

    .thread-id {
      font-size: 12px;
      color: #94a3b8;
    }
  }

  .chat-message {
    overflow-y: auto;
    padding: 20px;
    min-height: 0;
    flex: 1;
    scroll-behavior: smooth;
  }
}
</style>
