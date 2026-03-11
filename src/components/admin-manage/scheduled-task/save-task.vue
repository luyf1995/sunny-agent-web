<template>
  <sy-dialog
    v-model="visible"
    :title="dialogType === DialogTypeEnum.ADD ? '创建定时任务' : '编辑定时任务'"
    append-to-body
    :width="580"
  >
    <div v-if="visible" class="task-dialog__body">
      <el-form ref="saveFormRef" :model="saveForm" :rules="rules" label-position="top">
        <el-form-item label="标题" prop="name">
          <el-input v-model="saveForm.name" placeholder="AI新闻摘要" :maxlength="64" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="saveForm.description" placeholder="请输入描述" :maxlength="64" clearable></el-input>
        </el-form-item>
        <el-form-item label="提示词" prop="input_text">
          <el-input
            v-model="saveForm.input_text"
            type="textarea"
            placeholder="搜索昨天最具影响力的AI新闻，并向我发送一份简要摘要。"
            clearable
            :maxlength="999"
            :autosize="{ minRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="计划" prop="planType">
          <div class="plan-panel">
            <el-select v-model="saveForm.planType" placeholder="请选择" class="flex-1" @change="handlePlanTypeChange">
              <el-option v-for="item in PLAN_TYPES" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

            <el-select
              v-if="saveForm.planType === PlanType.Weekly"
              v-model="saveForm.weekDay"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
              class="flex-1"
            >
              <el-option v-for="item in WEEK_DAYS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

            <el-select
              v-if="saveForm.planType === PlanType.Monthly"
              v-model="saveForm.monthDay"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
              class="flex-1"
            >
              <el-option v-for="item in MONTH_DAYS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

            <el-date-picker
              v-if="saveForm.planType === PlanType.NoRepeat"
              v-model="saveForm.date"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择"
              class="flex-1"
            />

            <el-time-picker
              v-model="saveForm.time"
              placeholder="请选择"
              format="HH:mm"
              value-format="HH:mm"
              class="flex-1"
            />
          </div>
        </el-form-item>
        <el-form-item label="到期日期" prop="expires_at">
          <el-date-picker
            v-model="saveForm.expires_at"
            :disabled-date="disabledExpireDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择"
            class="flex-1"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="task-dialog__footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dialogType === DialogTypeEnum.ADD ? handleAdd() : handleEdit()">
          确定
        </el-button>
      </div>
    </template>
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

import SyDialog from '@/components/sy-dialog/index.vue'

import { createScheduledTask, editScheduledTask } from '@/api/scheduled-task'
import { PLAN_TYPES, PlanType, WEEK_DAYS, MONTH_DAYS } from './utils'
import { cronToPlan, planToCron } from './cron'
import { DialogTypeEnum } from '@/api/common/types'
import { SaveScheduledTaskParams, ScheduledTaskInfo } from '@/api/scheduled-task/types'

interface Props {
  dialogType: DialogTypeEnum
  data?: ScheduledTaskInfo
}
const props = defineProps<Props>()

interface SaveForm {
  name: string
  description: string
  input_text: string
  planType: PlanType
  weekDay: string[]
  monthDay: string[]
  date: string
  time: string
  expires_at: string
}

const DEFAULT_FORM = {
  name: '',
  description: '',
  input_text: '',
  planType: PlanType.NoRepeat,
  weekDay: [],
  monthDay: [],
  date: '',
  time: '',
  expires_at: ''
}

const emits = defineEmits(['success'])

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})
watch(visible, value => {
  if (value) {
    init()
  }
})

const saveFormRef = ref()
const saveForm = ref<SaveForm>(cloneDeep(DEFAULT_FORM))

const rules = ref({
  name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  input_text: [{ required: true, message: '请输入提示词', trigger: 'blur' }],
  planType: [{ required: true, message: '请选择计划', trigger: 'change' }]
})

/**
 * 初始化
 */
const init = () => {
  if (props.dialogType === DialogTypeEnum.EDIT) {
    const plan = cronToPlan(props.data!.cron_expr)
    saveForm.value = {
      ...saveForm.value,
      ...plan,
      name: props.data!.name,
      description: props.data!.description || '',
      input_text: props.data!.input_text || ''
    }
  } else {
    saveForm.value = cloneDeep(DEFAULT_FORM)
    saveForm.value.time = new Date().toLocaleTimeString().substring(0, 5)
    handlePlanTypeChange()
  }
}

/**
 * 禁用到期日期
 */
const disabledExpireDate = (date: Date) => {
  return date.getTime() < Date.now()
}

/**
 * 计划类型改变
 */
const handlePlanTypeChange = () => {
  const today = new Date()
  const date = today.getDate()
  const day = today.getDay()

  switch (saveForm.value.planType) {
    case PlanType.Weekly:
      saveForm.value.weekDay = [day.toString()]
      break
    case PlanType.Monthly:
      saveForm.value.monthDay = [date.toString()]
      break
    case PlanType.NoRepeat:
      saveForm.value.date = dayjs(today).format('YYYY-MM-DD')
      break
  }
  console.log(saveForm.value)
}

/**
 * 校验
 * @param {Fucntion} callback
 */
const doValidate = (callback: (params: SaveScheduledTaskParams) => void) => {
  saveFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const sortedWeekDay = [...saveForm.value.weekDay].sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      const sortedMonthDay = [...saveForm.value.monthDay].sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

      const cron = planToCron({
        planType: saveForm.value.planType,
        time: saveForm.value.time,
        weekDay: sortedWeekDay,
        monthDay: sortedMonthDay,
        date: saveForm.value.date
      })

      const params: SaveScheduledTaskParams = {
        name: saveForm.value.name,
        description: saveForm.value.description,
        input_text: saveForm.value.input_text,
        cron_expr: cron,
        expires_at: saveForm.value.expires_at ?? ''
      }

      callback(params)
    } else {
      return false
    }
  })
}

/**
 * 新增
 */
const handleAdd = () => {
  doValidate((params: SaveScheduledTaskParams) => {
    createScheduledTask(params).then(() => {
      ElMessage({
        type: 'success',
        message: '新增成功'
      })
      emits('success')
      visible.value = false
    })
  })
}
/**
 * 编辑
 */
const handleEdit = () => {
  doValidate((params: SaveScheduledTaskParams) => {
    editScheduledTask(props.data!.id, params).then(() => {
      ElMessage({
        type: 'success',
        message: '编辑成功'
      })
      emits('success')
      visible.value = false
    })
  })
}
</script>
<style scoped lang="scss">
.plan-panel {
  flex: 1;
  display: flex;
  gap: 10px;
  overflow: hidden;
}

:deep(.flex-1) {
  flex: 1;
}
</style>
