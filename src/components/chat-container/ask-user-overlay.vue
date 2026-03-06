<template>
  <div class="ask-user-overlay">
    <div class="ask-user-overlay__content">
      <div class="ask-user-overlay__header">
        <HelpCircle :size="18" class="ask-user-overlay__icon" />
        <span class="ask-user-overlay__title">需要您的回答</span>
        <span class="ask-user-overlay__progress">{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <button class="ask-user-overlay__close" @click="handleClose">
          <X :size="16" />
        </button>
      </div>

      <div class="ask-user-overlay__body">
        <div class="ask-user-overlay__question">
          {{ currentQuestion?.question }}
        </div>

        <div class="ask-user-overlay__options">
          <div v-for="(option, index) in displayOptions" :key="index" class="ask-user-overlay__option-item">
            <label class="ask-user-overlay__option-label">
              <input
                type="radio"
                :name="'current-question'"
                :value="option"
                :checked="currentAnswer?.selected === option"
                @change="handleSelectOption(option)"
              />
              <span class="ask-user-overlay__option-radio"></span>
              <span class="ask-user-overlay__option-text">{{ option }}</span>
            </label>
            <div v-if="option === '其他' && currentAnswer?.selected === '其他'" class="ask-user-overlay__custom-input">
              <el-input v-model="currentAnswer.customValue" placeholder="请输入您的回答..." size="small" />
            </div>
          </div>
        </div>
      </div>

      <div class="ask-user-overlay__footer">
        <el-button v-if="questions.length > 1" :disabled="currentIndex === 0" @click="handlePrev">
          <ChevronLeft :size="16" />
          上一题
        </el-button>
        <div v-else></div>

        <el-button v-if="!isLastQuestion" type="primary" :disabled="!canGoNext" @click="handleNext">
          下一题
          <ChevronRight :size="16" />
        </el-button>
        <el-button v-else type="primary" :disabled="!canSubmit" @click="handleSubmit"> 提交 </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { HelpCircle, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import type { QuestionItem } from '@/api/chat/types'

interface Props {
  questions: QuestionItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', answers: string[]): void
  (e: 'close'): void
}>()

interface Answer {
  selected: string
  customValue: string
}

const currentIndex = ref(0)
const answers = reactive<Answer[]>([])

watch(
  () => props.questions,
  newQuestions => {
    answers.length = 0
    newQuestions.forEach(() => {
      answers.push({ selected: '', customValue: '' })
    })
    currentIndex.value = 0
  },
  { immediate: true }
)

const currentQuestion = computed(() => props.questions[currentIndex.value])

const currentAnswer = computed(() => answers[currentIndex.value])

const displayOptions = computed(() => {
  const options = currentQuestion.value?.options || []
  return [...options, '其他']
})

const isLastQuestion = computed(() => currentIndex.value === props.questions.length - 1)

const canGoNext = computed(() => {
  if (!currentAnswer.value?.selected) return false
  if (currentAnswer.value.selected === '其他' && !currentAnswer.value.customValue.trim()) return false
  return true
})

const canSubmit = computed(() => {
  return answers.every(answer => {
    if (!answer.selected) return false
    if (answer.selected === '其他' && !answer.customValue.trim()) return false
    return true
  })
})

const handleSelectOption = (option: string) => {
  if (currentAnswer.value) {
    currentAnswer.value.selected = option
    if (option !== '其他') {
      currentAnswer.value.customValue = ''
    }
  }
}

const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const handleNext = () => {
  if (canGoNext.value && currentIndex.value < props.questions.length - 1) {
    currentIndex.value++
  }
}

const handleSubmit = () => {
  if (!canSubmit.value) return

  const result = answers.map(answer => {
    return answer.selected === '其他' ? answer.customValue.trim() : answer.selected
  })

  emit('submit', result)
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.ask-user-overlay {
  margin: 0 16px 16px;
  animation: slide-up 0.2s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ask-user-overlay__content {
  overflow: hidden;
  width: 100%;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
}

.ask-user-overlay__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.ask-user-overlay__icon {
  color: #f59e0b;
}

.ask-user-overlay__title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}

.ask-user-overlay__progress {
  padding: 2px 8px;
  font-size: 12px;
  color: #64748b;
  background-color: #e2e8f0;
  border-radius: 10px;
}

.ask-user-overlay__close {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    color: #475569;
    background-color: #e2e8f0;
  }
}

.ask-user-overlay__body {
  padding: 12px;
}

.ask-user-overlay__question {
  margin-bottom: 10px;
  font-size: 13px;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.5;
}

.ask-user-overlay__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ask-user-overlay__option-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ask-user-overlay__option-label {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }

  input[type='radio'] {
    display: none;
  }

  input[type='radio']:checked + .ask-user-overlay__option-radio {
    background-color: #3b82f6;
    border-color: #3b82f6;

    &::after {
      opacity: 1;
    }
  }

  input[type='radio']:checked ~ .ask-user-overlay__option-text {
    color: #3b82f6;
    font-weight: 500;
  }
}

.ask-user-overlay__option-radio {
  position: relative;
  width: 14px;
  height: 14px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }
}

.ask-user-overlay__option-text {
  font-size: 13px;
  color: #475569;
}

.ask-user-overlay__custom-input {
  margin-left: 32px;
}

.ask-user-overlay__footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
</style>
