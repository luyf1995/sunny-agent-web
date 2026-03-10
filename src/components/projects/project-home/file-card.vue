<template>
  <div class="card">
    <div class="card-header">
      <span>文件</span>
      <el-button class="card-header__btn" type="primary" @click="uploadFileDialogVisible = true">
        <plus :size="16" />
      </el-button>
    </div>
    <div class="card-body">
      <div class="file-info">
        <file-text :size="16" />
        <span>测试文件.txt</span>
      </div>
      <div class="tips">{{ projectFiles?.length ?? 0 }} 个文件</div>
    </div>
  </div>
  <upload-file v-model="uploadFileDialogVisible" :project="project"></upload-file>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Plus, FileText } from 'lucide-vue-next'

import UploadFile from '../upload-file/index.vue'

import { ProjectDetail } from '@/api/project/types'
import { getProjectFiles } from '@/api/project'

interface Props {
  project: ProjectDetail
}

const props = defineProps<Props>()

const emits = defineEmits(['upload'])

const uploadFileDialogVisible = ref(false)

const projectFiles = ref<FileInfo[]>()
/**
 * 获取项目文件列表
 */
const fetchProjectFiles = async () => {
  try {
    if (props.project && props.project.file_count) {
      const { data } = await getProjectFiles(props.project.id)
      console.log('data', data)
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => props.project,
  () => fetchProjectFiles(),
  {
    immediate: true
  }
)
</script>
<style scoped lang="scss">
@use './card';

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
</style>
