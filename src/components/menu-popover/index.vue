<template>
  <el-popover :visible="visible" placement="bottom-end" :width="140" popper-class="menu-popper-class" v-bind="attrs">
    <ul v-click-outside="handleClickOutside" class="menu-list">
      <li
        v-for="item in props.menus"
        :key="item.label"
        class="menu-item"
        :class="item.class"
        :style="item.style"
        @click="handleClickItem(item)"
      >
        <component :is="item.icon" v-if="typeof item.icon === 'function'" class="menu-item__icon" :size="13" />
        <div class="menu-item__label">{{ item.label }}</div>
      </li>
    </ul>
    <template #reference>
      <slot name="reference" :show="handleShow">
        <ellipsis-vertical :size="14" @click.stop="handleShow" />
      </slot>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { type Component, ref, useAttrs } from 'vue'
import { ClickOutside as vClickOutside } from 'element-plus'
import { EllipsisVertical } from 'lucide-vue-next'

interface MenuItem {
  icon?: Component
  label: string
  onClick: (...args: any[]) => any
  class?: string | Record<string, any>
  style?: string | Record<string, any>
}

interface Props {
  menus: MenuItem[]
}

const props = defineProps<Props>()
const attrs = useAttrs()

const visible = ref(false)
/**
 * 显示
 */
const handleShow = (e: MouseEvent) => {
  e.stopPropagation()
  visible.value = true
}
/**
 * 点击项
 * @param {MenuItem} item
 */
const handleClickItem = (item: MenuItem) => {
  item.onClick(() => {
    visible.value = false
  })
}
/**
 * 点击外部
 */
const handleClickOutside = () => {
  visible.value = false
}
</script>
<style scoped lang="scss">
.menu-list {
  padding: 0;
  margin: 0;
  color: #374151;
  list-style: none;
  font-weight: 500;

  .menu-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
      background-color: #f3f4f6;
    }
  }
}
</style>
<style lang="scss">
.menu-popper-class {
  padding: 4px !important;
}
</style>
