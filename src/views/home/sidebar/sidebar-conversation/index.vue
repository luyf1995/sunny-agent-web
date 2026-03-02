<template>
  <div v-memo="[collapsed]" class="sidebar-panel" :class="{ collapsed }">
    <div class="sidebar-panel__header">
      <messages-square v-if="!collapsed" :size="18" class="sidebar-panel__icon" />
      <conversation-popover v-else :list="conversationList">
        <template #reference="{ show }">
          <messages-square :size="20" class="sidebar-panel__icon" @click.stop="show" />
        </template>
      </conversation-popover>

      <template v-if="!collapsed">
        <span>对话</span>
        <button-icon title="新建对话" class="sidebar-panel__btn" @click="handleAdd">
          <message-square-plus :size="16" />
        </button-icon>
      </template>
    </div>

    <div v-if="!collapsed" class="sidebar-panel__content">
      <conversation-list :list="conversationList" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { MessagesSquare, MessageSquarePlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import ConversationList from '@/components/conversations/conversation-list.vue'
import ConversationPopover from '@/components/conversations/conversation-popover.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const current = ref<any>()
const conversationList = ref<any>([
  {
    name: 'New Conversation'
  }
])

/**
 * 新建对话
 */
const handleAdd = () => {
  conversationList.value.push({
    name: 'New Conversation'
  })
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
