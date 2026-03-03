<template>
  <sy-dialog v-model="visible" width="400px" title="新建项目">
    <el-form ref="addFormRef" :model="addForm" label-position="top">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="addForm.name" placeholder="输入项目名称" clearable :maxlength="64"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <sy-button @click="visible = false">取消</sy-button>
        <sy-button type="primary" :disabled="!addForm.name" @click="handleSubmit">创建项目</sy-button>
      </div>
    </template>
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElForm } from 'element-plus'

import SyButton from '@/components/sy-button/index.vue'
import SyDialog from '@/components/sy-dialog/index.vue'

const DEFAULT_FORM = {
  name: ''
}

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})
const emits = defineEmits<{
  (e: 'success'): void
}>()

watch(visible, (value: boolean) => {
  if (value) {
    init()
  }
})

const addForm = ref({ ...DEFAULT_FORM })
const addFormRef = ref<typeof ElForm>()

/**
 * 初始化
 */
const init = () => {
  addForm.value = { ...DEFAULT_FORM }
}

/**
 * 提交
 */
const handleSubmit = async () => {
  visible.value = false
  emits('success')
}
</script>
<style scoped lang="scss"></style>
