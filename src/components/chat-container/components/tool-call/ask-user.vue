<template>
  <div class="ask-user">
    <div class="ask-user__header">
      <HelpCircle :size="16" class="ask-user__icon" />
      <span class="ask-user__title">需要您的回答</span>
    </div>

    <div class="ask-user__questions">
      <div v-for="(q, qIndex) in questions" :key="qIndex" class="ask-user__question-item">
        <div class="ask-user__question-text">
          <span class="ask-user__question-number">{{ qIndex + 1 }}.</span>
          {{ q.question }}
        </div>
        <div class="ask-user__options">
          <div v-for="(option, oIndex) in getDisplayOptions(q)" :key="oIndex" class="ask-user__option-item">
            <label class="ask-user__option-label">
              <input
                type="radio"
                :name="`question-${qIndex}`"
                :value="option"
                :checked="answers[qIndex]?.selected === option"
                @change="handleSelectOption(qIndex, option)"
              />
              <span class="ask-user__option-radio"></span>
              <span class="ask-user__option-text">{{ option }}</span>
            </label>
            <div v-if="option === '其他' && answers[qIndex]?.selected === '其他'" class="ask-user__custom-input">
              <el-input v-model="answers[qIndex].customValue" placeholder="请输入您的回答..." size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ask-user__footer">
      <el-button type="primary" :disabled="!canSubmit" @click="handleSubmit"> 提交 </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, reactive, watch } from 'vue'
import { HelpCircle } from 'lucide-vue-next'
import { ToolCall, ToolCallAskUserArgs, QuestionItem } from '@/api/chat/tool-call'

interface Props {
  data: ToolCall
}

const props = defineProps<Props>()

const sendMessage = inject<(text: string) => Promise<void>>('sendMessage')

interface Answer {
  selected: string
  customValue: string
}

const questions = computed<QuestionItem[]>(() => {
  const args = props.data.args as ToolCallAskUserArgs
  return args?.questions || []
})

const answers = reactive<Answer[]>([])

watch(
  () => questions.value,
  newQuestions => {
    answers.length = 0
    newQuestions.forEach(() => {
      answers.push({ selected: '', customValue: '' })
    })
  },
  { immediate: true }
)

const getDisplayOptions = (question: QuestionItem): string[] => {
  const options = question.options || []
  return [...options, '其他']
}

const handleSelectOption = (qIndex: number, option: string) => {
  answers[qIndex].selected = option
  if (option !== '其他') {
    answers[qIndex].customValue = ''
  }
}

const canSubmit = computed(() => {
  return answers.every(answer => {
    if (!answer.selected) return false
    if (answer.selected === '其他' && !answer.customValue.trim()) return false
    return true
  })
})

const handleSubmit = async () => {
  if (!canSubmit.value || !sendMessage) return

  const responseText = answers
    .map((answer, index) => {
      const question = questions.value[index]
      const answerText = answer.selected === '其他' ? answer.customValue.trim() : answer.selected
      return `问题${index + 1}: ${question.question}\n回答: ${answerText}`
    })
    .join('\n\n')

  await sendMessage(responseText)
}
</script>

<style scoped lang="scss">
.ask-user {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ask-user__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ask-user__icon {
  color: #f59e0b;
}

.ask-user__title {
  font-weight: 500;
  color: #1e293b;
}

.ask-user__questions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ask-user__question-item {
  padding: 12px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.ask-user__question-text {
  margin-bottom: 12px;
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.5;
}

.ask-user__question-number {
  margin-right: 4px;
  color: #3b82f6;
}

.ask-user__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ask-user__option-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ask-user__option-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }

  input[type='radio'] {
    display: none;
  }

  input[type='radio']:checked + .ask-user__option-radio {
    background-color: #3b82f6;
    border-color: #3b82f6;

    &::after {
      opacity: 1;
    }
  }

  input[type='radio']:checked ~ .ask-user__option-text {
    color: #3b82f6;
    font-weight: 500;
  }
}

.ask-user__option-radio {
  position: relative;
  width: 16px;
  height: 16px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  transition: all 0.2s;

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

.ask-user__option-text {
  font-size: 13px;
  color: #475569;
}

.ask-user__custom-input {
  margin-left: 36px;
}

.ask-user__footer {
  display: flex;
  justify-content: flex-end;
}
</style>
