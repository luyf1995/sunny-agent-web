<template>
  <el-popover v-model:visible="visible" placement="top-start" :width="320" trigger="click">
    <div v-click-outside="() => (visible = false)" class="skill-panel">
      <div class="skill-panel__search">
        <el-input v-model="keywords" placeholder="搜索技能..." class="search-input">
          <template #prefix>
            <search :size="16" />
          </template>
        </el-input>
      </div>
      <div class="skill-panel__list">
        <div
          v-for="item in showSkillList"
          :key="item.id"
          class="skill-item"
          :class="{ 'is-selected': isSelected(item) }"
          @click="handleSelect(item)"
        >
          <div class="skill-item__name">
            <puzzle :size="14" />
            {{ item.name }}
            <span v-if="isSelected(item)" class="skill-check">✓</span>
          </div>
          <div class="skill-item__desc">{{ item.desc }}</div>
        </div>
      </div>
    </div>
    <template #reference>
      <button-icon class="toolbar-btn">
        <puzzle :size="18" />
        <span v-if="selectedSkills.length" class="toolbar-btn-badge">
          {{ selectedSkills.length }}
        </span>
      </button-icon>
    </template>
  </el-popover>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Puzzle, Search } from 'lucide-vue-next'
import { ClickOutside as vClickOutside } from 'element-plus'

import ButtonIcon from '@/components/button-icon/index.vue'

const props = defineProps<{
  list: any[]
}>()

const selectedSkills = defineModel<string[]>('modelValue', {
  default: () => []
})
const emits = defineEmits<{
  (e: 'selected', skill: { command: string; skills: string[] }): void
}>()

const visible = ref(false)
const keywords = ref('')

const showSkillList = computed(() => {
  if (keywords.value) {
    return props.list.filter(item => item.name.includes(keywords.value))
  }
  return props.list
})

/**
 * 选择技能回调
 * @param {} skill
 */
const handleSelect = skill => {
  if (selectedSkills.value.includes(skill.command)) return
  selectedSkills.value.push(skill.command)
  visible.value = false
  emits('selected', {
    command: skill.command,
    skills: selectedSkills.value
  })
}

/**
 * 是否选中
 */
const isSelected = item => {
  return selectedSkills.value.includes(item.command)
}
</script>
<style scoped lang="scss">
@use '../toolbar-btn';

.skill-panel {
  &__search {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: var(--border);

    .search-input {
      :deep(.el-input__wrapper) {
        border: none;
        box-shadow: none;

        &.is-focus {
          box-shadow: none;
        }
      }
    }
  }

  &__list {
    overflow-y: auto;
    height: 280px;

    .skill-item {
      padding: 10px 12px;
      cursor: pointer;

      &.is-selected {
        background-color: #f1f5f9;

        .skill-item__name {
          color: #2563eb;
        }
      }

      &:hover {
        background-color: #f1f5f9;
      }

      &__name {
        display: flex;
        align-items: center;
        margin-bottom: 2px;
        font-size: 14px;
        gap: 6px;
        font-weight: 500;
        color: #1e293b;
      }

      &__desc {
        overflow: hidden;
        padding-left: 20px;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #64748b;
      }

      .skill-check {
        margin-left: auto;
        font-size: 12px;
        color: #2563eb;
      }
    }
  }
}
</style>
