// 工具类型枚举
export enum ToolCallName {
  WriteFile = 'write_file', // 写文件
  ReadFile = 'read_file', // 读文件
  TodoWrite = 'todo_write', // 写代办
  TodoRead = 'todo_read', // 读代办
  BashTool = 'bash_tool', // Bash调用
  WebSearch = 'web_search', // 网络搜索
  WebFetch = 'web_fetch', // 网络获取
  SkillCall = 'skill_call', // 技能调用
  AskUser = 'ask_user', // 询问用户
  CronCreate = 'cron_create', // 创建定时任务
  PresentFiles = 'present_files' // 展示文件
}

export type ToolCallArgs =
  | Record<string, any>
  | ToolCallTodoArgs
  | ToolCallBashToolArgs
  | ToolCallReadFileArgs
  | ToolCallWriteFileArgs
  | ToolCallWebSearchArgs
  | ToolCallSkillCallArgs
  | ToolCallAskUserArgs
  | ToolCallPresentFilesArgs
export type ToolCallResult =
  | Record<string, any>
  | ToolCallTodoResult
  | ToolCallBashToolResult
  | ToolCallReadFileResult
  | ToolCallWriteFileResult
  | ToolCallWebSearchResult
  | ToolCallSkillCallResult
  | ToolCallAskUserResult
  | ToolCallCronCreateResult
  | ToolCallPresentFilesResult
export interface ToolCall {
  step: number // 步骤
  name: ToolCallName // 工具类型
  args: ToolCallArgs
  status: ToolCallStatus
  result: ToolCallResult
}

export enum ToolCallStatus {
  Running = 'running',
  Success = 'success',
  Error = 'error'
}

/** tool_call -> todo_write / todo_read */
export interface ToolCallTodoArgs {
  todos: TodoItem[]
}
export enum TodoItemStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed'
}
export interface TodoItem {
  id: string
  content: string
  status: TodoItemStatus
  priority: string
}

export interface ToolCallTodoResult {
  status: ToolCallStatus
  title: string
  todos: TodoItem[]
  error?: string
}
/** end **/

/**  tool_call -> bash_tool **/
export interface ToolCallBashToolArgs {
  command: string
}
export interface ToolCallBashToolResult {
  status: ToolCallStatus
  error?: string
  stdout: string
  stderr: string
  returncode: number
}
/** end **/

/**  tool_call -> read_file **/
export interface ToolCallReadFileArgs {
  path: string
}
export interface ToolCallReadFileResult {
  status: ToolCallStatus
  error?: string
}
/** end **/

/**  tool_call -> write_file **/
export interface ToolCallWriteFileArgs {
  path: string
}
export interface ToolCallWriteFileResult {
  status: ToolCallStatus
  error?: string
}
/** end **/

/**  tool_call -> web_search **/
export interface ToolCallWebSearchArgs {
  query: string
  count: number
}
export interface ToolCallWebSearchResult {
  status: ToolCallStatus
  error?: string
  query: string
  summary: string
  results: ToolCallWebSearchResultItem[]
}
export interface ToolCallWebSearchResultItem {
  title: string
  url: string
  snippet: string
}
/** end **/

/**  tool_call -> web_fetch **/
export interface ToolCallWebFetchArgs {
  url: string
}
export interface ToolCallWebFetchResult {
  status: ToolCallStatus
  error?: string
  url: string
  content: string
  content_type: string
  truncated: false
}
/** end **/

/**  tool_call -> skill_call **/
export interface ToolCallSkillCallArgs {
  skill_name: string
}
export interface ToolCallSkillCallResult {
  status: ToolCallStatus
  error?: string
}
/** end **/

/**  tool_call -> ask_user **/
export interface QuestionItem {
  question: string
  options?: string[]
}

export interface ToolCallAskUserArgs {
  questions: QuestionItem[]
}
export interface ToolCallAskUserResult {
  status: ToolCallStatus
  error?: string
  type: string
  question: QuestionItem
  instruction: string
}
/** end **/

/**  tool_call -> cron_create **/
export interface ToolCallCronCreateArgs {
  name: string
  description: string
  cron_expr: string
  input_text: string
}
export interface ToolCallCronCreateResult {
  status: ToolCallStatus
  error?: string
  name: string
  description: string
  cron_expr: string
  input_text: string
  job_id: string
  next_run_at: string
  expires_at: string
  enabled: boolean
}
/** end **/

/**  tool_call -> present_files **/
export interface ToolCallPresentFilesArgs {
  paths: string
}
export interface ToolCallPresentFilesResult {
  status: ToolCallStatus
  error?: string
  message: string
  files: ToolCallPresentFilesResultFile[]
}
export interface ToolCallPresentFilesResultFile {
  name: string
  path: string
  download_url: string
}
/** end **/
