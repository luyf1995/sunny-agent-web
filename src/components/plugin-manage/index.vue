<template>
  <sy-dialog
    v-model="visible"
    :show-footer="false"
    title="插件管理"
    modal-class="plugin-dialog"
    body-class="plugin-dialog__body"
    width="800px"
    top="10vh"
  >
    <div class="plugin-manage">
      <div class="plugin-manage__sidebar">
        <div class="plugin-manage__header">
          <el-input v-model="searchKeyword" placeholder="搜索插件" clearable size="small" class="search-input">
            <template #prefix>
              <search :size="14" />
            </template>
          </el-input>
          <button-icon @click="handleUpload">
            <plus />
          </button-icon>
        </div>
        <div v-if="filteredPluginList.length > 0" class="plugin-manage__list">
          <div
            v-for="item in filteredPluginList"
            :key="item.name"
            class="plugin-manage__sidebar-item"
            :class="{ 'is-active': selectedPlugin?.name === item.name }"
            @click="selectedPlugin = item"
          >
            <div class="plugin-item__header">
              <div class="plugin-item__icon">
                <puzzle :size="16" />
              </div>
              <div class="plugin-item__name">{{ item.name }}</div>
              <span class="status-dot" :class="{ 'is-enabled': item.is_active }"></span>
            </div>
          </div>
        </div>
        <div v-else class="plugin-manage__empty-sidebar">
          <div class="empty-icon">
            <inbox :size="32" />
          </div>
          <div class="empty-text">暂无插件</div>
          <div class="empty-hint">点击上方按钮上传插件</div>
        </div>
      </div>
      <div class="plugin-manage__content">
        <template v-if="selectedPlugin">
          <div class="plugin-detail">
            <div class="plugin-detail__header">
              <div class="plugin-detail__icon">
                <puzzle :size="24" />
              </div>
              <div class="plugin-detail__info">
                <div class="plugin-detail__name">{{ selectedPlugin.name }}</div>
                <div class="plugin-detail__meta">
                  <el-tag :type="selectedPlugin.is_active ? 'success' : 'info'">{{
                    selectedPlugin.is_active ? '已启用' : '已禁用'
                  }}</el-tag>
                </div>
              </div>
              <div class="plugin-detail__actions">
                <el-switch
                  :model-value="selectedPlugin.is_active"
                  size="small"
                  @change="handleToggleEnable(selectedPlugin)"
                />
                <el-button type="danger" text size="small" @click="handleDelete(selectedPlugin)">
                  <template #icon>
                    <trash-2 :size="14" />
                  </template>
                  删除
                </el-button>
              </div>
            </div>
            <div class="plugin-detail__section">
              <div class="section-title">描述</div>
              <div class="section-content">
                {{ selectedPlugin.description || '暂无描述' }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="plugin-manage__empty-content">
            <div class="empty-illustration">
              <puzzle :size="64" />
            </div>
            <div class="empty-title">选择一个插件查看详情</div>
            <div class="empty-desc">从左侧列表中选择一个插件，查看其详细信息和操作选项</div>
          </div>
        </template>
      </div>
    </div>
    <upload-plugin v-model="uploadDialogVisible" @success="fetchPluginList" />
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Puzzle, Inbox, Trash2, Search } from 'lucide-vue-next'

import SyDialog from '@/components/sy-dialog/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'
import UploadPlugin from './upload-plugin.vue'

import { getPluginList, deletePlugin, enablePlugin, getPluginFiles } from '@/api/plugin'
import { PluginInfo } from '@/api/plugin/types'

const visible = defineModel('modelValue', {
  default: false,
  type: Boolean
})

watch(visible, () => {
  if (visible.value) {
    fetchPluginList()
  }
})

const pluginList = ref<PluginInfo[]>([])
const selectedPlugin = ref<PluginInfo | null>(null)
const searchKeyword = ref('')

const filteredPluginList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return pluginList.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return pluginList.value.filter(item => item.name.toLowerCase().includes(keyword))
})

/**
 * 获取插件列表
 */
const fetchPluginList = async () => {
  try {
    const { data } = await getPluginList()
    pluginList.value = data?.plugins ?? []

    if (pluginList.value.length > 0) {
      if (!selectedPlugin.value) {
        selectedPlugin.value = pluginList.value[0]
      } else {
        selectedPlugin.value = pluginList.value.find(item => item.name === selectedPlugin.value?.name) || null
      }
    } else {
      selectedPlugin.value = null
    }
  } catch (error) {
    console.log(error)
  }
}

const uploadDialogVisible = ref(false)
const handleUpload = () => {
  uploadDialogVisible.value = true
}

/**
 * 切换启用状态
 * @param {PluginInfo} plugin 插件
 */
const handleToggleEnable = async (plugin: PluginInfo) => {
  console.log(plugin)
  try {
    await enablePlugin(plugin.name, !plugin.is_active)
    ElMessage.success('操作成功！')
    fetchPluginList()
  } catch (error) {
    plugin.is_active = !plugin.is_active
    console.log(error)
  }
}

/**
 * 删除插件
 * @param {PluginInfo} plugin 插件
 */
const handleDelete = async (plugin: PluginInfo) => {
  try {
    await ElMessageBox.confirm(`是否确认删除？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deletePlugin(plugin.name)
    ElMessage.success('删除成功')
    fetchPluginList()
    if (selectedPlugin.value?.name === plugin.name) {
      selectedPlugin.value = pluginList.value[0] || null
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 查询插件文件
 * @param {string} pluginName 插件名称
 */
const fetchPluginFiles = async (pluginName: string) => {
  try {
    const { data } = await getPluginFiles(pluginName)
    selectedPlugin.value = data
  } catch (error) {
    console.log(error)
  }
}
</script>
<style scoped lang="scss">
@use './index';
</style>
<style lang="scss">
.plugin-dialog {
  .el-dialog {
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 900px;
    height: 80vh;
    max-height: 700px;

    .el-dialog__body {
      flex: 1;
    }
  }
}
</style>
