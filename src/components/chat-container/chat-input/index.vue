<template>
  <div class="chat-input">
    <div class="agent-list">
      <div class="agent-item">
        <search :size="16" />
        <span class="agent-item__name">深度研究</span>
      </div>
      <div class="agent-item">
        <database :size="16" />
        <span class="agent-item__name">数据库</span>
      </div>
    </div>
    <div class="input-container">
      <textarea v-model="message" class="input-textarea" placeholder="输入问题..." rows="1"></textarea>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Search, Database } from 'lucide-vue-next'

const message = ref('')
</script>
<style scoped lang="scss">
.chat-input {
  .agent-list {
    display: flex;
    justify-content: flex-start;
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 8px;

    .agent-item {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      font-size: 13px;
      background-color: #f8fafc;
      border: var(--border);
      border-radius: 20px;
      transition: all 0.15s;
      gap: 6px;
      cursor: pointer;

      &:hover {
        background-color: #f1f5f9;
        border-color: var(--primary-color);
      }
    }
  }

  .input-container {
    position: relative;
    margin: 0 16px 16px;
    background: #f1f5f9;
    border: var(--border);
    border-radius: 12px;

    .input-textarea {
      padding: 12px 16px;
      width: 100%;
      min-height: 56px;
      max-height: 200px;
      font-size: 14px;
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      line-height: 1.5;
    }
  }
}
</style>
