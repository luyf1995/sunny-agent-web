<template>
  <div class="skill-suggestion">
    <div
      v-for="(item, index) in list"
      :key="item.id"
      class="skill-item"
      :class="{ 'is-selected': index === selectedIndex }"
      @click="handleSelect(index, item)"
    >
      <span class="skill-item__name">{{ item.name }}</span>
      <span class="skill-item__desc">{{ item.desc }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  list: any[]
}>()

const selectedIndex = defineModel('selectedIndex', {
  type: Number,
  default: 0
})
const emit = defineEmits(['selected'])

/**
 * 选择回调
 * @param {number} index 选中的索引
 * @param {any} item
 */
const handleSelect = (index: number, item: any) => {
  emit('selected', {
    index,
    command: item.command
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

  &__name {
    font-size: 14px;
    font-weight: 500;
    color: #2563eb;
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
