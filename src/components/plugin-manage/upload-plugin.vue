<template>
  <sy-dialog
    v-model="visible"
    append-to-body
    title="上传技能"
    width="500px"
    :show-footer="false"
    :close-on-click-modal="false"
  >
    <file-upload
      v-if="visible"
      ref="fileUploadRef"
      v-model:file-list="fileList"
      v-loading="uploading"
      :limit="1"
      drag
      name="file"
      :disabled="uploading"
      :show-file-list="false"
      :auto-upload="true"
      :accept="ACCEPT_SUFFIXS"
      :action="UPLOAD_PLUGIN_URL"
      :headers="{ Authorization: `Bearer ${token}` }"
      :before-upload="handleBeforeUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        <p>拖拽文件至此或<em>点击上传</em></p>
        <p>支持 {{ ACCEPT_SUFFIXS.join('、') }} 类型文件</p>
      </div>
    </file-upload>
    <!-- <el-progress v-if="uploading" :percentage="uploadPercent" :status="uploadStatus" /> -->
  </sy-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, UploadRawFile, type UploadFile, type UploadProgressEvent } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

import SyDialog from '@/components/sy-dialog/index.vue'
import FileUpload from '@/components/file-upload/index.vue'

import { UPLOAD_PLUGIN_URL } from '@/api/plugin'
import { useUserStore } from '@/store'

enum Status {
  Success = 'success',
  Warning = 'warning',
  Exception = 'exception'
}

const emits = defineEmits(['success'])
const userStore = useUserStore()
const token = computed(() => userStore.accessToken)

const ACCEPT_SUFFIXS = ['zip']

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})

watch(visible, (value: boolean) => {
  if (value) {
    init()
  }
})

const fileList = ref<UploadFile[]>([])
const uploading = ref(false)
const uploadPercent = ref(0)
const uploadStatus = ref<'' | Status>('')

const init = () => {
  fileList.value = []
  uploadPercent.value = 0
  uploading.value = false
  uploadStatus.value = ''
}

const handleBeforeUpload = (rawFile: UploadRawFile) => {
  uploadStatus.value = ''
  uploading.value = true
}

const handleProgress = (event: UploadProgressEvent) => {
  if (event.percent) {
    uploadPercent.value = Math.round(event.percent)
  }
}

const handleSuccess = () => {
  uploading.value = false
  uploadStatus.value = Status.Success
  emits('success')
  ElMessage.success('上传成功')
  visible.value = false
}

const handleError = (error: any) => {
  uploading.value = false
  uploadStatus.value = Status.Exception
  fileList.value = []
  ElMessage.error(error?.message || error || '上传失败')
}
</script>
<style scoped lang="scss"></style>
