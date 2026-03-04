<template>
  <div class="sy-pagination">
    <el-pagination
      :current-page="page"
      :page-size="size"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  page: number
  size: number
  total: number
  pageSizes?: number[]
  layout?: string
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  size: 15,
  total: 0,
  pageSizes: () => [15, 30, 50, 100],
  layout: 'total, sizes, prev, pager, next, jumper'
})

const emits = defineEmits<{
  (e: 'update:size', val: number): void
  (e: 'update:page', val: number): void
  (e: 'change', val: { page: number; size: number }): void
}>()

/**
 * 每页尺寸改变时触发
 * @param {Number} val
 */
function handleSizeChange(val: number): void {
  emits('update:size', val)
  emits('change', { page: 1, size: val })
}
/**
 * 页码改变时触发
 * @param {Number} val
 */
function handleCurrentChange(val: number): void {
  emits('update:page', val)
  emits('change', { page: val, size: props.size })
}
</script>
