<template>
  <el-table
    ref="elTableRef"
    :data="tableData"
    border
    :height="heightComputed"
    :max-height="maxHeightComputed"
    v-bind="$attrs"
  >
    <table-item
      v-for="(item, index) in columns"
      :key="index"
      :item="item"
      @filter-change="data => handleKeywordsFilterChange(data.value, data.prop)"
    ></table-item>
  </el-table>
  <div v-if="pagination" class="pagination-container">
    <sy-pagination
      v-bind="{ ...props?.paginationProps }"
      v-model:page="page"
      v-model:size="size"
      :total="total"
      @change="emits('page-change', $event)"
    ></sy-pagination>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'

import SyPagination from '../sy-pagination/index.vue'
import TableItem from './table-item.vue'
import { ElTable } from 'element-plus'
import { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  data: () => [],
  columns: () => [],
  pagination: true,
  total: 0
})

// 页码
const page = defineModel('page', {
  type: Number,
  default: 1
})

// 每页大小
const size = defineModel('size', {
  type: Number,
  default: 15
})

const emits = defineEmits(['page-change'])

const heightComputed = computed(() => {
  if (props.height) {
    if (typeof props.height === 'number' && props.pagination) {
      // 32 分页器高度
      return props.height - 32 - 20
    } else {
      return props.height
    }
  }
  return undefined
})

const maxHeightComputed = computed(() => {
  if (props.maxHeight) {
    if (typeof props.maxHeight === 'number' && props.pagination) {
      // 32 分页器高度   20 margin
      return props.maxHeight - 32 - 20
    } else {
      return props.maxHeight
    }
  }
  return undefined
})

const filterMap = ref<any>({})

const elTableRef = ref<InstanceType<typeof ElTable>>()

// 根据关键字过滤
const tableData = computed(() => {
  return props.data.filter((item: any) => {
    return Object.keys(filterMap.value).every(key => {
      return String(item[key]).indexOf(filterMap.value[key]) > -1
    })
  })
})

/**
 * 搜索回调
 * @param {String} keywords 搜索关键字
 * @param {String} prop 表格列
 */
function handleKeywordsFilterChange(keywords: string, prop: string): void {
  if (keywords === '' || keywords === undefined || keywords === null) {
    delete filterMap.value[prop]
  } else {
    filterMap.value[prop] = keywords
  }
}

defineExpose({
  elTableRef
})
</script>
<style scoped lang="scss">
.pagination-container {
  margin-top: 20px;

  :deep(.el-pagination) {
    justify-content: flex-end;
  }
}
</style>
