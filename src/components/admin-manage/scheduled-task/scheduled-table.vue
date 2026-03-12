<template>
  <div class="scheduled-table">
    <sy-table
      v-model:page="searchForm.page"
      v-model:size="searchForm.page_size"
      :columns="columns"
      :data="tableData"
      :pagination="true"
      :border="false"
      :height="tableHeight"
      :total="total"
      @page-change="fetchList"
    ></sy-table>
  </div>

  <save-task
    v-model="saveDialogVisible"
    :dialog-type="saveDialogType"
    :data="saveDialogData"
    @success="fetchList"
  ></save-task>
</template>
<script setup lang="tsx">
import { ref, VNode } from 'vue'
import { CirclePlay, SquarePen, Trash2 } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

import ButtonIcon from '@/components/button-icon/index.vue'
import SyTable from '@/components/sy-table/index.vue'
import SaveTask from './save-task.vue'

import { getScheduledTaskList, deleteScheduledTask, editScheduledTask } from '@/api/scheduled-task'
import useTableHeight from '@/hooks/use-table-height'
import { ScheduledTaskInfo } from '@/api/scheduled-task/types'
import { DialogTypeEnum } from '@/api/common/types'
import { formatCronDisplay } from './cron'

const { tableHeight } = useTableHeight(['.scheduled-table'], 16)

const tableData = ref<ScheduledTaskInfo[]>([])

const searchForm = ref({
  page: 1,
  page_size: 15
})
const total = ref(0)

const columns = ref([
  {
    prop: 'name',
    label: '标题',
    align: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'username',
    label: '计划于',
    align: 'left',
    showOverflowTooltip: true,
    slot: (h: () => VNode, { row }: { row: ScheduledTaskInfo }) => {
      return formatCronDisplay(row.cron_expr)
    }
  },
  {
    prop: 'enabled',
    label: '状态',
    align: 'left',
    width: 90,
    slot: (h: () => VNode, { row }: { row: ScheduledTaskInfo }) => {
      return <el-switch modelValue={row.enabled} onChange={() => handleStatusChange(row)} />
    }
  },
  {
    prop: 'action',
    label: '操作',
    align: 'left',
    fixed: 'right',
    width: 120,
    slot: (h: () => VNode, { row }: { row: ScheduledTaskInfo }) => {
      return (
        <div class="table-action">
          <ButtonIcon class="action-btn" title="立即执行" onClick={() => {}}>
            <CirclePlay size={18} />
          </ButtonIcon>
          <ButtonIcon
            class="action-btn"
            title="编辑"
            onClick={() => {
              handleEdit(row)
            }}
          >
            <SquarePen size={18} />
          </ButtonIcon>
          <ButtonIcon
            class="action-btn"
            title="删除"
            onClick={() => {
              handleDelete(row)
            }}
          >
            <Trash2 size={18} />
          </ButtonIcon>
        </div>
      )
    }
  }
])

/**
 * 获取任务列表
 */
const fetchList = async () => {
  try {
    const { data } = await getScheduledTaskList(searchForm.value)
    tableData.value = data?.items ?? []
    total.value = data?.total ?? 0
  } catch (error) {
    console.error(error)
  }
}
/**
 * 搜索
 */
const onSeach = () => {
  searchForm.value.page = 1
  fetchList()
}
onSeach()

const saveDialogVisible = ref(false)
const saveDialogType = ref(DialogTypeEnum.ADD)
const saveDialogData = ref<ScheduledTaskInfo>()
/**
 * 添加任务
 */
const handleAdd = () => {
  saveDialogType.value = DialogTypeEnum.ADD
  saveDialogVisible.value = true
}
/**
 * 编辑
 */
const handleEdit = (row: ScheduledTaskInfo) => {
  saveDialogType.value = DialogTypeEnum.EDIT
  saveDialogData.value = row
  saveDialogVisible.value = true
}

/**
 * 删除
 * @param {ScheduledTaskInfo} row
 */
const handleDelete = async (row: ScheduledTaskInfo) => {
  ElMessageBox.confirm('是否确认删除', '警告', { type: 'warning' })
    .then(async () => {
      try {
        await deleteScheduledTask(row.id)
        ElMessage.success('删除成功！')
        fetchList()
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {})
}
/**
 * 状态切换
 * @param {ScheduledTaskInfo} row
 * @param {boolean} val
 */
const handleStatusChange = async (row: ScheduledTaskInfo) => {
  try {
    await editScheduledTask(row.id, {
      ...row,
      enabled: !row.enabled
    })
    ElMessage.success('更新成功！')
    fetchList()
  } catch (error) {
    row.enabled = !row.enabled
    console.error(error)
  }
}

defineExpose({
  handleAdd
})
</script>
<style scoped lang="scss">
.scheduled-table {
  height: 100%;
}
</style>
