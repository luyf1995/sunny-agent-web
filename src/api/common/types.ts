// 分页
export interface PageQuery {
  page: number // 页码
  page_size: number // 每页数量
}

// 分页返回值
export interface PageResult<T> extends PageQuery {
  items: T
  total: number // 总数
  page: number // 页码
  page_size: number // 每页数量
}
