export interface NotifyInfo {
  id: string
  type: string
  title: string
  content: string
  session_id: string
  cron_job_id: string
  task_id: string
  is_read: false
  create_at: string
}

export interface NotifyListItem {
  items: NotifyInfo[]
  total: number
  unread_count: 3
}
