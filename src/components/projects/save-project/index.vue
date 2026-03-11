<template>
  <sy-dialog v-model="visible" width="400px" title="新建项目" @keyup.enter="handleSubmit">
    <el-form ref="saveFormRef" :model="saveForm" label-position="top" :rules="rules" @submit.prevent>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="saveForm.name" placeholder="输入项目名称" clearable :maxlength="64"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <sy-button type="primary" :disabled="!saveForm.name" @click="handleSubmit">确定</sy-button>
      </div>
    </template>
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElForm, ElMessage } from 'element-plus'

import SyButton from '@/components/sy-button/index.vue'
import SyDialog from '@/components/sy-dialog/index.vue'

import { ProjectInfo, SaveProjectParams } from '@/api/project/types'
import { DialogTypeEnum } from '@/api/common/types'

interface Props {
  dialogType: DialogTypeEnum
  data?: ProjectInfo // 编辑数据
  onCreate?: (params: SaveProjectParams) => void // 新增回调
  onEdit?: (projectId: string, params: SaveProjectParams) => void // 编辑回调
}

const props = defineProps<Props>()

const DEFAULT_FORM = {
  name: ''
}

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})
const emits = defineEmits<{
  (e: 'success', data?: ProjectInfo): void
}>()

watch(visible, (value: boolean) => {
  if (value) {
    init()
  }
})

const saveForm = ref<SaveProjectParams>({ ...DEFAULT_FORM })
const saveFormRef = ref<typeof ElForm>()
const rules = ref({
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
})

/**
 * 初始化
 */
const init = () => {
  if (props.dialogType === DialogTypeEnum.EDIT) {
    saveForm.value = { ...(props.data || {}) } as SaveProjectParams
  } else {
    saveForm.value = { ...DEFAULT_FORM }
  }
}

/**
 * 校验
 * @param {Fucntion} callback
 */
const doValidate = (callback: (params: SaveProjectParams) => void) => {
  saveFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      callback(saveForm.value)
    } else {
      return false
    }
  })
}

const handleSubmit = () => {
  props.dialogType === DialogTypeEnum.ADD ? handleAdd() : handleEdit()
}

/**
 * 新增
 */
const handleAdd = () => {
  doValidate(async (params: SaveProjectParams) => {
    props.onCreate?.(params)
    ElMessage({
      type: 'success',
      message: '新增成功'
    })
    visible.value = false
  })
}
/**
 * 编辑
 */
const handleEdit = () => {
  doValidate(async (params: SaveProjectParams) => {
    await props.onEdit?.(props.data!.id, params)

    ElMessage({
      type: 'success',
      message: '编辑成功'
    })
    visible.value = false
  })
}
</script>
<style scoped lang="scss"></style>
