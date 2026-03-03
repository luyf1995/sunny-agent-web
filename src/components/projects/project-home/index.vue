<template>
  <div class="project-home">
    <div class="project-home-content">
      <div class="project-home-header">
        <div class="project-home-icon">
          <folder :size="48" />
        </div>
        <h1 class="project-home-title">123</h1>
        <p class="project-home-meta">由 admin 创建 · 3月2日 更新</p>
      </div>
      <div class="project-home-chat">
        <chat-input></chat-input>
      </div>
      <div class="project-home-cards">
        <file-card></file-card>
        <skill-card></skill-card>
      </div>
      <div class="project-home-conversations">
        <h2 class="conversations-title">会话</h2>
        <div class="conversations-list">
          <div class="conversation-item">
            <message-square :size="16" />
            <span class="conversation-item__title">New Conversation</span>
            <span class="conversation-item__time">2小时前</span>
          </div>
          <div class="conversation-item">
            <message-square :size="16" />
            <span class="conversation-item__title">New Conversation</span>
            <span class="conversation-item__time">5小时前</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Folder, MessageSquare } from 'lucide-vue-next'
import ChatInput from './chat-input.vue'
import FileCard from './file-card.vue'
import SkillCard from './skill-card.vue'
</script>
<style scoped lang="scss">
@use './index';
</style>
