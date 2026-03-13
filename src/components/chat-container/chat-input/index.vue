<template>
  <div class="chat-input">
    <div class="input-container">
      <div
        ref="inputRef"
        class="input-textarea"
        :class="{ 'is-empty': isEmpty }"
        contenteditable="true"
        @keydown="handleKeyDown"
        @input="handleInput"
        @blur="handleBlur"
        @paste="handlePaste"
      ></div>
      <div class="input-toolbar">
        <div class="input-toolbar__left"></div>
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
import { computed, ref, watch, nextTick, onMounted } from 'vue'
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

const inputRef = ref<HTMLDivElement | null>(null)
const isEmpty = ref(true)
const currentInputText = ref('')

const filteredCommandList = computed(() => {
  if (!currentInputText.value.startsWith(COMMAND_SYMBOL)) return []
  const query = currentInputText.value.slice(1).toLowerCase()
  if (!query) return comandList.value
  return comandList.value.filter(
    item => item.command_name.toLowerCase().includes(query) || item.command_description.toLowerCase().includes(query)
  )
})

const commandSuggestionsVisible = ref(false)
const commandSuggestionIndex = ref(0)

const getTextContent = (): string => {
  if (!inputRef.value) return ''
  const clone = inputRef.value.cloneNode(true) as HTMLDivElement
  const chips = clone.querySelectorAll('.command-chip')
  chips.forEach(chip => {
    chip.replaceWith(chip.getAttribute('data-command') || '')
  })
  return clone.textContent || ''
}

const updateIsEmpty = () => {
  const text = getTextContent()
  isEmpty.value = text.trim() === ''
}

const resetCursor = () => {
  if (!inputRef.value) return

  inputRef.value.innerHTML = ''
  const selection = window.getSelection()
  if (!selection) return

  const range = document.createRange()
  range.setStart(inputRef.value, 0)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}

const handleCommandSelected = (command: CommandInfo) => {
  if (!inputRef.value) return

  inputRef.value.focus()

  const selection = window.getSelection()
  if (!selection) return

  let range: Range

  if (selection.rangeCount > 0 && inputRef.value.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    range = selection.getRangeAt(0)
  } else {
    range = document.createRange()
    range.selectNodeContents(inputRef.value)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const textNode = range.startContainer

  if (textNode.nodeType === Node.TEXT_NODE) {
    const text = textNode.textContent || ''
    const slashIndex = text.lastIndexOf(COMMAND_SYMBOL)
    if (slashIndex !== -1) {
      range.setStart(textNode, slashIndex)
      range.setEnd(textNode, text.length)
      range.deleteContents()
    }
  }

  const chip = document.createElement('span')
  chip.className = 'command-chip'
  chip.contentEditable = 'false'
  chip.textContent = command.command_name
  chip.setAttribute('data-command', command.full_command)

  range.insertNode(chip)

  const space = document.createTextNode('\u00A0')
  range.setStartAfter(chip)
  range.insertNode(space)

  range.setStartAfter(space)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)

  commandSuggestionsVisible.value = false
  updateIsEmpty()
}

const handleCommandSuggestionSelected = ({ command }: { index: number; command: CommandInfo }) => {
  handleCommandSelected(command)
}

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

  if (e.key === 'Backspace') {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (range.collapsed && range.startOffset === 0) {
      const container = range.startContainer
      if (container.nodeType === Node.TEXT_NODE) {
        const prev = container.previousSibling
        if (prev && prev.nodeType === Node.ELEMENT_NODE && (prev as Element).classList?.contains('command-chip')) {
          e.preventDefault()
          ;(prev as Element).remove()
          updateIsEmpty()
          return
        }
      }
    }
  }

  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleInput = (e: InputEvent) => {
  if (!inputRef.value) return

  const target = e.target as HTMLDivElement
  target.style.height = 'auto'
  target.style.height = Math.min(target.scrollHeight, 200) + 'px'

  updateIsEmpty()

  if (isEmpty.value) {
    resetCursor()
    return
  }

  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const textNode = range.startContainer

  if (textNode.nodeType === Node.TEXT_NODE) {
    const text = textNode.textContent || ''
    const cursorPos = range.startOffset
    let startPos = cursorPos
    while (startPos > 0 && text[startPos - 1] !== COMMAND_SYMBOL && text[startPos - 1] !== ' ') {
      startPos--
    }
    if (startPos > 0 && text[startPos - 1] === COMMAND_SYMBOL) {
      currentInputText.value = text.substring(startPos - 1, cursorPos)
    } else {
      currentInputText.value = ''
    }
  } else {
    currentInputText.value = ''
  }

  if (currentInputText.value.startsWith(COMMAND_SYMBOL) && filteredCommandList.value.length > 0) {
    commandSuggestionsVisible.value = true
    commandSuggestionIndex.value = 0
  } else {
    commandSuggestionsVisible.value = false
  }
}

const handleBlur = () => {
  setTimeout(() => {
    commandSuggestionsVisible.value = false
  }, 200)
}

const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

const handleSend = async () => {
  if (props.isStreaming) {
    handleAbort()
    return
  }

  const text = getTextContent()
  message.value = text
  if (text.trim() === '') return
  emits('send', text)

  if (inputRef.value) {
    inputRef.value.innerHTML = ''
    inputRef.value.style.height = 'auto'
  }
  isEmpty.value = true
  currentInputText.value = ''
}

const handleAbort = () => {
  emits('abort')
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>
<style scoped lang="scss">
.chat-input {
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
      overflow-y: auto;
      padding: 12px 16px;
      width: 100%;
      min-height: 56px;
      max-height: 200px;
      font-size: 14px;
      white-space: pre-wrap;
      outline: none;
      line-height: 1.5;
      overflow-wrap: break-word;

      &.is-empty::before {
        content: '输入问题...';
        color: #94a3b8;
        pointer-events: none;
      }

      :deep(.command-chip) {
        display: inline-block;
        padding: 2px 8px;
        margin: 0 2px;
        font-weight: 600;
        color: #2563eb;
        background-color: #dbeafe;
        border-radius: 4px;
        user-select: all;
        cursor: pointer;

        &:hover {
          background-color: #bfdbfe;
        }
      }
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
