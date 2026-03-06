import { ChatSSEEvent } from './event'

export enum RoleType {
  User = 'user',
  Assistant = 'assistant'
}
export interface SSEEvent {
  event: string
  data: any
}

export interface Message {
  id: string
  role: string
  contents: MessageContent[]
}
export interface MessageContent {
  type: ChatSSEEvent
  text?: string // 文本内容
  toolCall?: ToolCall // 工具调用
}

// 工具类型枚举
export enum ToolCallName {
  WriteFile = 'write_file', // 写文件
  ReadFile = 'read_file', // 读文件
  TodoWrite = 'todo_write', // 写代办
  TodoRead = 'todo_read', // 读代办
  BashTool = 'bash_tool', // Bash调用
  WebSearch = 'web_search', // 网络搜索
  SkillCall = 'skill_call', // 技能调用
  AskUser = 'ask_user' // 询问用户
}

export interface ToolCall {
  step: number // 步骤
  name: ToolCallName // 工具类型
  args:
    | Record<string, any>
    | ToolCallTodoArgs
    | ToolCallBashToolArgs
    | ToolCallReadFileArgs
    | ToolCallWriteFileArgs
    | ToolCallWebSearchArgs
    | ToolCallSkillCallArgs
    | ToolCallAskUserArgs
  status: ToolCallStatus
  result:
    | Record<string, any>
    | ToolCallTodoResult
    | ToolCallBashToolResult
    | ToolCallReadFileResult
    | ToolCallWriteFileResult
    | ToolCallWebSearchResult
    | ToolCallSkillCallResult
    | ToolCallAskUserResult
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
