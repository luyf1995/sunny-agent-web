<template>
  <sy-dialog
    v-model="visible"
    :show-footer="false"
    title="技能管理"
    modal-class="skill-dialog"
    body-class="skill-dialog__body"
    width="800px"
    top="10vh"
  >
    <div class="skill-manage">
      <div class="skill-manage__sidebar">
        <div class="skill-manage__header">
          <el-input v-model="searchKeyword" placeholder="搜索技能" clearable size="small" class="search-input">
            <template #prefix>
              <search :size="14" />
            </template>
          </el-input>
          <button-icon @click="handleUpload">
            <plus />
          </button-icon>
        </div>
        <div v-if="filteredSkillList.length > 0" class="skill-manage__list">
          <div
            v-for="item in filteredSkillList"
            :key="item.name"
            class="skill-manage__sidebar-item"
            :class="{ 'is-active': selectedSkill?.name === item.name }"
            @click="selectedSkill = item"
          >
            <div class="skill-item__header">
              <div class="skill-item__icon">
                <puzzle :size="16" />
              </div>
              <div class="skill-item__name">{{ item.name }}</div>
              <span class="status-dot" :class="{ 'is-enabled': item.is_enabled }"></span>
            </div>
          </div>
        </div>
        <div v-else class="skill-manage__empty-sidebar">
          <div class="empty-icon">
            <inbox :size="32" />
          </div>
          <div class="empty-text">暂无技能</div>
          <div class="empty-hint">点击上方按钮上传技能</div>
        </div>
      </div>
      <div class="skill-manage__content">
        <template v-if="selectedSkill">
          <div class="skill-detail">
            <div class="skill-detail__header">
              <div class="skill-detail__icon">
                <puzzle :size="24" />
              </div>
              <div class="skill-detail__info">
                <div class="skill-detail__name">{{ selectedSkill.name }}</div>
                <div class="skill-detail__meta">
                  <el-tag :type="selectedSkill.is_enabled ? 'success' : 'info'">{{
                    selectedSkill.is_enabled ? '已启用' : '已禁用'
                  }}</el-tag>
                </div>
              </div>
              <div class="skill-detail__actions">
                <el-switch
                  :model-value="selectedSkill.is_enabled"
                  size="small"
                  @change="handleToggleEnable(selectedSkill)"
                />
                <el-button type="danger" text size="small" @click="handleDelete(selectedSkill)">
                  <template #icon>
                    <trash-2 :size="14" />
                  </template>
                  删除
                </el-button>
              </div>
            </div>
            <div class="skill-detail__section">
              <div class="section-title">描述</div>
              <div class="section-content">
                {{ selectedSkill.description || '暂无描述' }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="skill-manage__empty-content">
            <div class="empty-illustration">
              <puzzle :size="64" />
            </div>
            <div class="empty-title">选择一个技能查看详情</div>
            <div class="empty-desc">从左侧列表中选择一个技能，查看其详细信息和操作选项</div>
          </div>
        </template>
      </div>
    </div>
    <upload-skill v-model="uploadDialogVisible" @success="fetchSkillList" />
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Puzzle, Inbox, Trash2, Search } from 'lucide-vue-next'

import SyDialog from '@/components/sy-dialog/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'
import UploadSkill from './upload-skill.vue'

import { getSkillList, deleteSkill, enableSkill } from '@/api/skill'
import { SkillInfo } from '@/api/skill/types'

const visible = defineModel('modelValue', {
  default: false,
  type: Boolean
})

watch(visible, () => {
  if (visible.value) {
    fetchSkillList()
  }
})

const pluginList = ref<SkillInfo[]>([])
const selectedSkill = ref<SkillInfo | null>(null)
const searchKeyword = ref('')

const filteredSkillList = computed(() => {
  if (!searchKeyword.value.trim()) {
    return pluginList.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return pluginList.value.filter(item => item.name.toLowerCase().includes(keyword))
})

/**
 * 获取技能列表
 */
const fetchSkillList = async () => {
  try {
    const { data } = await getSkillList()
    pluginList.value = data?.skills ?? []

    if (pluginList.value.length > 0) {
      if (!selectedSkill.value) {
        selectedSkill.value = pluginList.value[0]
      } else {
        selectedSkill.value = pluginList.value.find(item => item.name === selectedSkill.value?.name) || null
      }
    } else {
      selectedSkill.value = null
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
 * @param {SkillInfo} skill 技能
 */
const handleToggleEnable = async (skill: SkillInfo) => {
  console.log(skill)
  try {
    await enableSkill(skill.name, !skill.is_enabled)
    ElMessage.success('操作成功！')
    fetchSkillList()
  } catch (error) {
    skill.is_enabled = !skill.is_enabled
    console.log(error)
  }
}

/**
 * 删除技能
 * @param {SkillInfo} skill 技能
 */
const handleDelete = async (skill: SkillInfo) => {
  try {
    await ElMessageBox.confirm(`是否确认删除？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteSkill(skill.name)
    ElMessage.success('删除成功')
    fetchSkillList()
    if (selectedSkill.value?.name === skill.name) {
      selectedSkill.value = pluginList.value[0] || null
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<style scoped lang="scss">
@use './index';
</style>
<style lang="scss">
.skill-dialog {
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
