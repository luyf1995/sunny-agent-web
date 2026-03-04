import { h } from 'vue'
import type { TableColumnCtx } from 'element-plus'

export interface IProps {
  data: any[]
  columns: any[]
  height?: number | string // 表格高度
  maxHeight?: number | string // 表格最大高度

  // 分页参数
  pagination?: boolean // 是否显示分页
  paginationProps?: Record<string, any> // 分页器属性，参考el-pagination
  total?: number // 分页总数
}
export interface SyTableColumnProps extends Partial<TableColumnCtx<any>> {
  slot?: (_h: (_?: Parameters<typeof h>) => ReturnType<typeof h>, slotData: any) => any
  slotHeader?: (_h: (_?: Parameters<typeof h>) => ReturnType<typeof h>, slotData: any) => any
}
