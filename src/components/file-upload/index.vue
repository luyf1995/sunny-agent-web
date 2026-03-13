<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    :auto-upload="autoUpload"
    :action="typeof action === 'string' ? action : undefined"
    :http-request="typeof action === 'function' ? httpRequest : undefined"
    :name="name"
    :limit="limit"
    :data="data"
    :before-upload="handleBeforeUpload"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-progress="handleProgress"
    :on-change="handleChange"
    v-bind="$attrs"
  >
    <template #default>
      <slot name="default">
        <el-button type="primary" :icon="Upload">上传</el-button>
      </slot>
    </template>
    <template #tip>
      <div class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </template>
  </el-upload>
</template>
<script setup lang="ts">
import {
  ElMessage,
  type UploadProgressEvent,
  type UploadFile,
  type UploadFiles,
  type UploadRawFile,
  type UploadUserFile,
  UploadRequestOptions,
  UploadInstance
} from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { Awaitable } from 'element-plus/es/utils/typescript'
import { HttpCode } from '@/utils/request'
import { ref } from 'vue'

interface Props {
  action?: string | ((formData: FormData) => Promise<any>) // 请求URL | 自定义上传请求
  name?: string // 上传的文件字段名

  limit?: number // 允许上传的最大数量
  accept?: string[] // 支持的文件后缀 eg: json、pcd、doc、docx、xlsx ...
  autoUpload?: boolean // 自动上传

  data?: any // 额外参数

  beforeUpload?: (rawFile: UploadRawFile) => Awaitable<void | undefined | null | boolean | File | Blob> // 文件上传前的回调
  onExceed?: (files: File[], uploadFiles: UploadUserFile[]) => void // 超出限制时的回调
  onSuccess?: (response: any, uploadFile?: UploadFile, uploadFiles?: UploadFiles) => void // 文件上传成功时的回调
  onError?: (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void // 文件上传失败时的回调
  onProgress?: (error: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => void // 文件上传时的回调
}

const props = withDefaults(defineProps<Props>(), {
  action: undefined,
  autoUpload: true,
  name: 'file',
  fileList: () => [],
  limit: undefined,
  accept: undefined
})

const emits = defineEmits<{
  (e: 'update:file-list', fileList: UploadUserFile[]): void
}>()

// 文件列表
// fileList?: UploadUserFile[]
const fileList = defineModel<UploadUserFile[]>('fileList', {
  default() {
    return []
  }
})

const uploadRef = ref<UploadInstance>()

/**
 * 自定义文件上传请求
 * @param {UploadRequestOptions} options
 */
const httpRequest = (options: UploadRequestOptions) => {
  if (typeof props.action !== 'function') return
  const formData = new FormData()
  formData.append('file', options.file)

  if (props.data) {
    for (let key in props.data) {
      formData.append(key, props.data[key])
    }
  }

  props
    .action(formData)
    .then(data => {
      options.onSuccess?.(data)
    })
    .catch(error => {
      options.onError?.(error)
    })
}

/**
 * 文件上传前的回调
 */
const handleBeforeUpload = (rawFile: UploadRawFile) => {
  if (!props.autoUpload) return

  const fileName = rawFile.name.toLocaleLowerCase()
  const suffix = fileName.split('.').slice(-1)?.[0]

  const accept = props.accept
  if (Array.isArray(accept) && !accept.includes(suffix)) {
    ElMessage({
      type: 'warning',
      message: `仅支持 ${accept.toString()} 后缀的文件！`,
      showClose: true
    })
    return false
  }

  return props.beforeUpload ? props.beforeUpload(rawFile) : true
}

/**
 * 超出限制时的回调
 * @param {File[]} files 本次上传的文件
 * @param {UploadUserFile[]} uploadFiles 已经上传的文件
 */
const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  ElMessage({
    type: 'warning',
    message: `上传文件数量不能超过${props.limit}!`,
    showClose: true
  })

  props.onExceed && props.onExceed(files, uploadFiles)
}

/**
 * 文件上传成功时的回调（http通信成功，业务代码不一定成功）
 * @param {any} response 响应数据
 * @param {UploadFile} uploadFile 上传成功的文件
 * @param {UploadFiles} uploadFiles 已经上传的文件
 */
const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (!props.autoUpload) return

  const { code, message, data } = response
  if (code === HttpCode.ERROR) {
    props.onError && props.onError(response, uploadFile, uploadFiles)
    // 失败
    ElMessage({
      type: 'error',
      message: message,
      showClose: true
    })
  } else {
    // 成功
    props.onSuccess && props.onSuccess(response, uploadFile, uploadFiles)

    const newFileList = [
      ...(fileList.value || []),
      {
        id: data?.id,
        name: data?.name
      }
    ] as UploadUserFile[]
    emits('update:file-list', newFileList)
  }
}
/**
 * 文件上传失败时的回调
 * @param {Error} error 响应数据
 * @param {UploadFile} uploadFile 上传的文件
 * @param {UploadFiles} uploadFiles 已经上传的文件
 */
const handleError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (!props.autoUpload) return
  let message
  try {
    message = error.message && JSON.parse(error.message)
  } catch (error) {
    message = error.message
    // console.log('file-upload error', error)
  } finally {
    console.log('message', message)
    props.onError && props.onError(message, uploadFile, uploadFiles)
  }
}

/**
 * 文件上传时的钩子
 * @param {UploadProgressEvent} event
 * @param {UploadFile} uploadFile 上传的文件
 * @param {UploadFiles} uploadFiles 已经上传的文件
 */
const handleProgress = (event: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (!props.autoUpload) return

  props.onProgress && props.onProgress(event, uploadFile, uploadFiles)
  return true
}

/**
 * 移除文件
 * @param {UploadFiles} uploadFiles
 * @param {number} uid
 */
const removeFileFromList = (uploadFiles: UploadFiles, uid: number) => {
  const index = uploadFiles.findIndex(item => item.uid === uid)
  if (index !== -1) {
    uploadFiles.splice(index, 1)
  }
}
/**
 * 文件变更回调（仅在autoUpload为false时有用）
 * @param {UploadFile} uploadFile
 * @param {UploadFiles} uploadFiles
 */
const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (props.autoUpload) return

  if (uploadFile.status !== 'ready') return

  const fileName = uploadFile.name.toLocaleLowerCase()
  const suffix = fileName.split('.').pop() as string
  if (props.accept && props.accept.includes(suffix)) {
    ElMessage({
      type: 'warning',
      message: `仅支持 ${props.accept.toString()} 后缀的文件！`,
      showClose: true,
      grouping: true
    })
    removeFileFromList(uploadFiles, uploadFile.uid)
    return false
  }

  if (fileList.value.find(item => item.name === uploadFile.name)) {
    ElMessage({
      type: 'warning',
      message: `请勿重复上传相同名称的文件：${uploadFile.name}`,
      showClose: true,
      grouping: true
    })
    removeFileFromList(uploadFiles, uploadFile.uid)
    return false
  }

  fileList.value.push(uploadFile)
  return true
}

const submit = () => {
  uploadRef.value?.submit()
}
defineExpose({
  submit
})
</script>
<style scoped lang="scss">
.el-upload__tip {
  float: right;
  margin-top: 0;
  margin-left: 30px;
}
</style>
