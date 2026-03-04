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
      <textarea
        v-model="message"
        class="input-textarea"
        placeholder="输入问题..."
        rows="1"
        @keydown="handleKeyDown"
        @input="handleInput"
      ></textarea>
      <div class="input-toolbar">
        <div class="input-toolbar__left">
          <file-upload />
          <skill-selector
            v-model="selectedSkills"
            :list="skillList"
            @selected="({ command }) => handleSkillSelected(command)"
          />
        </div>
      </div>
      <div v-if="skillSuggestionsVisible" class="skill-suggestion-container">
        <skill-suggestion
          v-model:selected-index="skillSuggestionIndex"
          :list="filteredSkills"
          @selected="({ command }) => handleSkillSuggestionSelected(command)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { Search, Database } from 'lucide-vue-next'

import FileUpload from './file-upload/index.vue'
import SkillSelector from './skill-selector/index.vue'
import SkillSuggestion from './skill-suggestion/index.vue'

const COMMAND_SYMBOL = '/'

const message = ref('')

const skillList = ref([
  {
    id: 1,
    name: 'skill1',
    desc: '这是一个技能描述',
    command: '/skill1'
  },
  {
    id: 2,
    name: 'skill2',
    desc: '这是另一个技能描述',
    command: '/skill2'
  },
  {
    id: 3,
    name: 'skill3',
    desc: '这是另一个技能描述',
    command: '/skill2'
  },
  {
    id: 4,
    name: 'skill4',
    desc: '这是另一个技能描述',
    command: '/skill2'
  }
])

// 已选中skill列表
const selectedSkills = ref<string[]>([])

// 过滤后的skill列表
const filteredSkills = computed(() => {
  if (!message.value.startsWith(COMMAND_SYMBOL)) return []
  const query = message.value.slice(1).toLowerCase()
  return skillList.value.filter(
    skill => skill.name.toLowerCase().includes(query) || skill.desc.toLowerCase().includes(query)
  )
})
// 技能建议
const skillSuggestionsVisible = ref(false)
const skillSuggestionIndex = ref(0)
/**
 * 技能选择回调
 * @param {string} skill 选中的技能
 * @param {boolean} pre 是否前置添加空格
 */
const handleSkillSelected = (skill: string, pre: boolean = true) => {
  message.value += (pre ? ' ' : '') + skill + ' '
}
/**
 * 技能建议选择回调
 * @param {string} skill 选中的技能
 */
const handleSkillSuggestionSelected = (skill: string) => {
  handleSkillSelected(skill, false)
  if (selectedSkills.value.includes(skill)) return
  selectedSkills.value.push(skill)
}

watch(message, value => {
  // skill 建议显隐控制
  if (value.startsWith(COMMAND_SYMBOL) && filteredSkills.value.length > 0) {
    skillSuggestionsVisible.value = true
    skillSuggestionIndex.value = 0
  } else {
    skillSuggestionsVisible.value = false
  }

  // 提取消息中的skill命令
  const matches = value.match(/\/([a-zA-Z0-9_-]+)/g) || []
  const skillNames = matches.map(m => m.slice(1))
  console.log('skillNames', value)
  // 过滤出已选中的skill
  selectedSkills.value = skillNames.filter(name => selectedSkills.value.includes(name))
  console.log(1111, selectedSkills.value)
})

/**
 * 键盘按下回调
 * @param {KeyboardEvent} e 键盘事件
 */
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.isComposing) {
    return
  }

  if (skillSuggestionsVisible.value && filteredSkills.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      skillSuggestionIndex.value = Math.min(skillSuggestionIndex.value + 1, filteredSkills.value.length - 1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      skillSuggestionIndex.value = Math.max(skillSuggestionIndex.value - 1, 0)
      return
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleSkillSuggestionSelected(filteredSkills.value[skillSuggestionIndex.value].name)
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      skillSuggestionsVisible.value = false
      return
    }
  }

  // if (e.key === 'Enter' && !e.shiftKey) {
  //   e.preventDefault()
  //   handleSubmit()
  // }
}

/**
 * 输入回调
 * @param {InputEvent} e 输入
 */
const handleInput = (e: InputEvent) => {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = Math.min(target.scrollHeight, 200) + 'px'
}
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

    &:focus-within {
      border-color: #2563eb;
    }

    .input-textarea {
      padding: 12px 16px;
      width: 100%;
      min-height: 56px;
      max-height: 200px;
      font-size: 14px;
      line-height: 1.5;
    }

    .input-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;

      &__left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .skill-suggestion-container {
      position: absolute;
      right: 0;
      bottom: 100%;
      left: 0;
      z-index: 100;
      overflow-y: auto;
      margin-bottom: 4px;
      max-height: 240px;
      background-color: #fff;
      border: var(--border);
      border-radius: 8px;
      box-shadow: 0 -4px 12px rgb(0 0 0 / 10%);
    }
  }
}
</style>
