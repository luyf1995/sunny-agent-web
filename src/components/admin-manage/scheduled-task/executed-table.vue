<template>
  <div class="executed-table">
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
</template>
<script setup lang="tsx">
import { ref, VNode } from 'vue'
import dayjs from 'dayjs'

import SyTable from '@/components/sy-table/index.vue'

import { getExecutedTaskList } from '@/api/scheduled-task'
import useTableHeight from '@/hooks/use-table-height'
import { ExecutedTaskInfo } from '@/api/scheduled-task/types'

const { tableHeight } = useTableHeight(['.executed-table'], 16)

const tableData = ref<any[]>([])

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
    prop: 'completed_at',
    label: '时间',
    align: 'left',
    width: 160,
    slot: (h: () => VNode, { row }: { row: ExecutedTaskInfo }) => {
      return dayjs(row.completed_at).format('YYYY-MM-DD HH:mm:ss')
    }
  }
])

/**
 * 获取已完成任务列表
 */
const fetchList = async () => {
  try {
    const { data } = await getExecutedTaskList(searchForm.value)
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
</script>
<style scoped lang="scss">
.executed-table {
  height: 100%;
}
</style>
