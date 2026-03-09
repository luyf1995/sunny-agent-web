<template>
  <div class="sidebar-panel" :class="{ collapsed }">
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
      <conversation-list :list="conversationList" @deleted="handleDeleted" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { MessagesSquare, MessageSquarePlus } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import ConversationList from '@/components/conversations/conversation-list/index.vue'
import ConversationPopover from '@/components/conversations/conversation-popover/index.vue'

import { getConversationList } from '@/api/conversation'
import { ConversationInfo } from '@/api/conversation/types'
import { useModuleStore } from '@/store'
import { ModuleType } from '@/store/module'
import eventBus from '@/utils/event-bus'

const props = defineProps<{
  collapsed: boolean
}>()

const moduleStore = useModuleStore()

const conversationList = ref<ConversationInfo[]>([])

/**
 * 获取会话列表
 */
const getList = async () => {
  try {
    const { data } = await getConversationList()
    conversationList.value = data?.items ?? []
  } catch (error) {
    console.error(error)
  }
}
getList()

eventBus.on('conversation:unshift', async (conversation: ConversationInfo) => {
  conversationList.value.unshift(conversation)
  moduleStore.setCurrentConversation(conversation ?? null)
})

/**
 * 新建对话
 */
const handleAdd = () => {
  moduleStore.setCurrentModuleType(ModuleType.Conversation)
  moduleStore.setCurrentConversation(null)
}

/**
 * 删除会话
 * @param {string} id 会话ID
 */
const handleDeleted = (id: string) => {
  moduleStore.setCurrentConversation(null)

  getList()
}
</script>
<style scoped lang="scss">
@use '../sidebar-panel';
</style>
