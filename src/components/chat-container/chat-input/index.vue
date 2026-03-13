<template>
  <div class="chat-input">
    <!-- <div class="agent-list">
      <div class="agent-item">
        <search :size="16" />
        <span class="agent-item__name">深度研究</span>
      </div>
      <div class="agent-item">
        <database :size="16" />
        <span class="agent-item__name">数据库</span>
      </div>
    </div> -->
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
          <!-- <file-upload />
          <command-selector
            v-model="comandList"
            :list="comandList"
            @selected="({ command }) => handleCommandSelected(command)"
          /> -->
        </div>
        <div class="input-toolbar__right">
          <el-button type="primary" title="发送" class="send-btn" @click="handleSend()">
            <component :is="isStreaming ? Pause : Send" :size="18" />
          </el-button>
        </div>
      </div>
      <div v-if="commandSuggestionsVisible" class="command-suggestion-container">
        <command-suggestion
          v-model:selected-index="commandSuggestionIndex"
          :list="filteredCommandList"
          @selected="handleCommandSuggestionSelected"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Send, Pause } from 'lucide-vue-next'
import { cloneDeep } from 'lodash-es'

import CommandSuggestion from './command-suggestion/index.vue'

import { useCommandStore } from '@/store'
import { CommandInfo } from '@/api/plugin/types'

const COMMAND_SYMBOL = '/'

interface Props {
  isStreaming: boolean
}

const props = defineProps<Props>()

const message = defineModel('modelValue', {
  type: String,
  default: ''
})

const emits = defineEmits(['send', 'abort'])

const commandStore = useCommandStore()
const storeCommandList = computed(() => commandStore.commands)

const comandList = ref<CommandInfo[]>([])

commandStore.fetchCommands()
watch(
  storeCommandList,
  value => {
    comandList.value = cloneDeep(value) ?? []
  },
  {
    immediate: true
  }
)

// 过滤后的command列表
const filteredCommandList = computed(() => {
  if (!message.value.startsWith(COMMAND_SYMBOL)) return []
  const query = message.value.slice(1).toLowerCase()
  if (!query) return comandList.value
  return comandList.value.filter(
    item => item.command_name.toLowerCase().includes(query) || item.command_description.toLowerCase().includes(query)
  )
})
// 技能建议
const commandSuggestionsVisible = ref(false)
const commandSuggestionIndex = ref(0)
/**
 * 技能选择回调
 * @param {CommandInfo} command 选中的技能
 * @param {boolean} pre 是否前置添加空格
 */
const handleCommandSelected = (command: CommandInfo, pre: boolean = true) => {
  message.value += (pre ? ' ' : '') + command.full_command.slice(1) + ' '
}
/**
 * 技能建议选择回调
 */
const handleCommandSuggestionSelected = ({ index, command }: { index: number; command: CommandInfo }) => {
  handleCommandSelected(command, false)
}

watch(message, value => {
  // command 建议显隐控制
  if (value.startsWith(COMMAND_SYMBOL) && filteredCommandList.value.length > 0) {
    commandSuggestionsVisible.value = true
    commandSuggestionIndex.value = 0
  } else {
    commandSuggestionsVisible.value = false
  }
})

/**
 * 键盘按下回调
 * @param {KeyboardEvent} e 键盘事件
 */
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.isComposing) {
    return
  }

  if (commandSuggestionsVisible.value && filteredCommandList.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      commandSuggestionIndex.value = Math.min(commandSuggestionIndex.value + 1, filteredCommandList.value.length - 1)
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      commandSuggestionIndex.value = Math.max(commandSuggestionIndex.value - 1, 0)
      return
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      handleCommandSuggestionSelected({
        index: commandSuggestionIndex.value,
        command: filteredCommandList.value[commandSuggestionIndex.value]
      })
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      commandSuggestionsVisible.value = false
      return
    }
  }

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
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

/**
 * 发送聊天消息
 */
const handleSend = async () => {
  if (props.isStreaming) {
    handleAbort()
    return
  }

  if (message.value.trim() === '') return
  emits('send', message.value)
  message.value = ''
}
/**
 * 取消发送
 */
const handleAbort = () => {
  emits('abort')
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

      .send-btn {
        width: 42px;
        height: 42px;
      }
    }

    .command-suggestion-container {
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
