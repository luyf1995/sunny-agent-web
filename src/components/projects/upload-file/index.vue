<template>
  <sy-dialog v-model="visible" title="上传文件" width="500px" :show-footer="!startLoading" @submit="handleSubmitUpload">
    <file-upload
      v-if="visible"
      ref="fileUploadRef"
      v-model:file-list="fileList"
      :limit="maxCount"
      drag
      multiple
      show-file-list
      :name="name"
      :auto-upload="false"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        <p>拖拽文件至此或<em>点击上传</em></p>
        <p>支持 {{ ACCEPT_SUFFIXS.toString() }} 类型文件</p>
        <p>最多同时支持上传 {{ maxCount }} 个文件</p>
      </div>
    </file-upload>
    <el-progress v-if="startLoading" :percentage="uploadPercent" />
  </sy-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, UploadFiles } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

import SyDialog from '@/components/sy-dialog/index.vue'
import FileUpload from '@/components/file-upload/index.vue'

import { ProjectDetail } from '@/api/project/types'
import { uploadProjectFiles } from '@/api/project'

// 允许上传的文件后缀
const ACCEPT_SUFFIXS = ['txt', 'md', 'pdf', 'xlsx', 'docx']
// 允许同时上传的文件数
const ACCEPT_MAX_COUNT = 5

interface Props {
  project: ProjectDetail
  maxCount?: number
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxCount: ACCEPT_MAX_COUNT,
  name: 'files'
})

const emits = defineEmits(['success'])

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})

watch(visible, (value: boolean) => {
  if (value) {
    init()
  }
})

const fileList = ref<UploadFiles>([])
const fileUploadRef = ref()

const init = () => {
  fileList.value = []
  uploadPercent.value = 0
  startLoading.value = false
}

let uploadPercent = ref(0)
let startLoading = ref(false)

/**
 * 确认上传
 */
const handleSubmitUpload = () => {
  if (!props.project?.id) {
    ElMessage({
      type: 'warning',
      message: `项目信息不能为空`,
      showClose: true
    })
    return
  }

  if (fileList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: `请上传文件`,
      showClose: true
    })
    return
  }
  startLoading.value = true
  const formData = new FormData()
  for (let item of fileList.value) {
    formData.append(props.name, item.raw as Blob)
  }

  uploadProjectFiles(props.project.id, formData, progressEvent => {
    uploadPercent.value = Math.round((progressEvent.loaded / (progressEvent.total || 0)) * 100)
  })
    .then(() => {
      ElMessage({
        type: 'success',
        message: '上传成功！',
        showClose: true
      })
      visible.value = false
      emits('success')
    })
    .finally(() => {
      startLoading.value = false
    })
}
</script>
<style scoped lang="scss"></style>
