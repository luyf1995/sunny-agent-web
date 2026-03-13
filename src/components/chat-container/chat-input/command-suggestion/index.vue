<template>
  <div class="skill-suggestion">
    <div
      v-for="(item, index) in list"
      :key="item.full_command"
      class="skill-item"
      :class="{ 'is-selected': index === selectedIndex }"
      @click="handleSelect(index, item)"
    >
      <div class="skill-item__title">
        <square-terminal class="skill-item__icon" :size="14" />
        <span class="skill-item__name">{{ item.full_command }}</span>
      </div>
      <span class="skill-item__desc">{{ item.command_description }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SquareTerminal } from 'lucide-vue-next'

import { CommandInfo } from '@/api/plugin/types'

const props = defineProps<{
  list: CommandInfo[]
}>()

const selectedIndex = defineModel('selectedIndex', {
  type: Number,
  default: 0
})
const emit = defineEmits(['selected'])

/**
 * 选择回调
 * @param {number} index 选中的索引
 * @param {CommandInfo} command 选中的命令项
 */
const handleSelect = (index: number, command: CommandInfo) => {
  emit('selected', {
    index,
    command
  })
}
</script>
<style scoped lang="scss">
.skill-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  cursor: pointer;

  &.is-selected {
    background-color: #f1f5f9;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #2563eb;
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
  }

  &__desc {
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #64748b;
  }
}
</style>
