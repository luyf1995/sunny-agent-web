<template>
  <el-popover :visible="visible" placement="right-start" :width="200">
    <div v-click-outside="close" class="popover-panel">
      <div class="popover-panel__header">
        <div>对话列表</div>
        <button-icon>
          <x :size="16" />
        </button-icon>
      </div>
      <div class="popover-panel__body">
        <conversation-item v-for="item in list" :key="item.name" :data="item" :show-menu="false"> </conversation-item>
      </div>
    </div>
    <template #reference>
      <slot name="reference" :show="show" />
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { X } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import ConversationItem from './conversation-item.vue'

interface Conversation {
  name: string
}

const props = defineProps<{
  list: Conversation[]
}>()

const visible = ref(false)
/**
 * 显示弹出层
 */
const show = () => (visible.value = true)
/**
 * 关闭弹出层
 */
const close = () => (visible.value = false)
</script>
<style scoped lang="scss">
.popover-panel {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    font-size: 14px;
    color: #1e293b;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 500;
  }

  &__body {
    padding: 8px;
  }
}
</style>
