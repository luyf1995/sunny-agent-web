<template>
  <sy-dialog v-model="visible" width="400px" title="重命名对话">
    <el-form ref="renameFormRef" :model="renameForm" label-position="top" :rules="rules" @submit.prevent>
      <el-form-item label="对话名称" prop="title">
        <el-input v-model="renameForm.title" placeholder="输入对话名称" clearable :maxlength="64"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <sy-button type="primary" :disabled="!renameForm.title" @click="handleRename">确定</sy-button>
      </div>
    </template>
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElForm, ElMessage } from 'element-plus'

import SyButton from '@/components/sy-button/index.vue'
import SyDialog from '@/components/sy-dialog/index.vue'

import { EditSessionParams, SessionInfo } from '@/api/session/types'
import { editSession } from '@/api/session'

interface Props {
  data?: SessionInfo
}

const props = defineProps<Props>()

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})

const emits = defineEmits<{
  (e: 'success', data?: SessionInfo): void
}>()

watch(visible, (value: boolean) => {
  if (value) {
    init()
  }
})

const renameForm = ref<EditSessionParams>({
  session_id: '',
  title: ''
})
const renameFormRef = ref<typeof ElForm>()
const rules = ref({
  title: [{ required: true, message: '请输入对话名称', trigger: 'blur' }]
})

const init = () => {
  if (props.data) {
    renameForm.value = {
      session_id: props.data.session_id,
      title: props.data.title
    }
  }
}

const doValidate = (callback: (params: EditSessionParams) => void) => {
  renameFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      callback(renameForm.value)
    } else {
      return false
    }
  })
}

const handleRename = () => {
  doValidate((params: EditSessionParams) => {
    if (!params.session_id) {
      ElMessage({
        type: 'error',
        message: '会话ID不能为空'
      })
      return
    }
    editSession(params).then(() => {
      emits('success', {
        ...props.data!,
        title: params.title
      })
      ElMessage({
        type: 'success',
        message: '重命名成功'
      })
      visible.value = false
    })
  })
}
</script>
<style scoped lang="scss"></style>
