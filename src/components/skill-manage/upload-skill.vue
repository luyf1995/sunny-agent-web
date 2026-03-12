<template>
  <sy-dialog v-model="visible" append-to-body title="上传技能" width="500px" :show-footer="false">
    <file-upload
      v-if="visible"
      ref="fileUploadRef"
      v-model:file-list="fileList"
      :limit="1"
      drag
      name="file"
      :auto-upload="true"
      :accept="acceptSuffixs"
      :action="handleUpload"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">
        <p>拖拽文件至此或<em>点击上传</em></p>
        <p>支持 {{ acceptSuffixs.join('、') }} 类型文件</p>
      </div>
    </file-upload>
    <el-progress v-if="uploading" :percentage="uploadPercent" :status="uploadStatus" />
  </sy-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, type UploadFile, type UploadProgressEvent } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

import SyDialog from '@/components/sy-dialog/index.vue'
import FileUpload from '@/components/file-upload/index.vue'

import { uploadSkill } from '@/api/skill'

enum UploadSkillStatusEnum {
  Success = 'success',
  Warning = 'warning',
  Exception = 'exception'
}

const acceptSuffixs = ['zip']

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

const fileList = ref<UploadFile[]>([])

const uploading = ref(false)
const uploadPercent = ref(0)
const uploadStatus = ref<'' | UploadSkillStatusEnum>('')

const init = () => {
  fileList.value = []
  uploadPercent.value = 0
  uploading.value = false
  uploadStatus.value = ''
}

const handleUpload = async (formData: FormData) => {
  uploading.value = true
  uploadStatus.value = ''
  uploadPercent.value = 0

  try {
    const result = await uploadSkill(formData, progressEvent => {
      if (progressEvent.total) {
        uploadPercent.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })
    return result
  } catch (error) {
    throw error
  }
}

const handleProgress = (event: UploadProgressEvent) => {
  if (event.percent) {
    uploadPercent.value = Math.round(event.percent)
  }
}

const handleSuccess = () => {
  uploading.value = false
  uploadStatus.value = UploadSkillStatusEnum.Success
  ElMessage.success('上传成功')
  emits('success')
  setTimeout(() => {
    visible.value = false
  }, 500)
}

const handleError = (error: any) => {
  uploading.value = false
  uploadStatus.value = UploadSkillStatusEnum.Exception
  ElMessage.error(error?.message || '上传失败')
}
</script>
<style scoped lang="scss"></style>
