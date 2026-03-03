<template>
  <div class="database-layout">
    <div class="database-header">
      <div class="database-header__title">
        <span>资料库</span>
        <span v-if="selectedList.length" class="database-header__selected">已选 {{ selectedList.length }} 个</span>
      </div>
      <button-icon>
        <lucide-chevron-left />
      </button-icon>
    </div>
    <div class="database-action">
      <el-button type="primary" class="action-btn">
        <plus :size="16" />
        添加资料
      </el-button>
    </div>
    <div class="databbase-check-all">
      <button @click="handleSelectAll">
        <span>全选</span>
        <component :is="isSelectAll ? SquareCheckBig : Square" :size="16" />
      </button>
    </div>
    <div class="database-list">
      <div
        v-for="item in fileList"
        :key="item.id"
        class="database-item"
        :class="{ selected: isSelected(item.id) }"
        @click="handleSelect(item)"
      >
        <div class="database-item__menu">
          <menu-popover :menus="buildMenus()" :width="120" placement="right-start"></menu-popover>
        </div>
        <div class="database-item__icon">
          <file-text :size="18"></file-text>
        </div>
        <div class="database-item__info">
          <span class="database-item__name">测试文档.txt</span>
          <span class="database-item__meta">200B</span>
        </div>
        <div class="database-item__check">
          <component :is="isSelected(item.id) ? SquareCheckBig : Square" :size="16" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { LucideChevronLeft, Plus, Square, SquareCheckBig, FileText, Pencil, Trash2 } from 'lucide-vue-next'

import ButtonIcon from '@/components/button-icon/index.vue'
import MenuPopover from '@/components/menu-popover/index.vue'
import { computed, ref } from 'vue'

const fileList = [
  {
    id: 1,
    name: '测试文档1.txt',
    size: '200B'
  },
  {
    id: 2,
    name: '测试文档2.txt',
    size: '100B'
  }
]

const selectedList = ref<number[]>([])

/**
 * 单个选择
 * @param {*} item
 */
const handleSelect = item => {
  if (selectedList.value.includes(item.id)) {
    selectedList.value = selectedList.value.filter(id => id !== item.id)
  } else {
    selectedList.value.push(item.id)
  }
}
/**
 * 是否选中
 * @param {number} id
 */
const isSelected = id => {
  return selectedList.value.includes(id)
}

const isSelectAll = computed(() => {
  const selectedLength = selectedList.value.length
  return selectedLength > 0 && selectedLength === fileList.length
})

/**
 * 全选
 */
const handleSelectAll = () => {
  if (isSelectAll.value) {
    selectedList.value = []
  } else {
    selectedList.value = fileList.map(item => item.id)
  }
}

/**
 * 构建菜单
 */
const buildMenus = () => {
  return [
    {
      icon: Pencil,
      label: '重命名',
      onClick: next => {
        console.log('重命名')
        next()
      }
    },
    {
      icon: Trash2,
      label: '删除',
      onClick: next => {
        console.log('删除')
        next()
      },
      style: {
        color: '#e53e3e'
      }
    }
  ]
}
</script>
<style scoped lang="scss">
@use './index';
</style>
