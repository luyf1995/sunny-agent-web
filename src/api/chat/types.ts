// types.ts
export type DisplayScenario = 'quick' | 'agent' | 'planning'

export interface ThinkingStep {
  content: string
  type: string
  timestamp: number
}

export interface ThinkingState {
  steps: ThinkingStep[]
  isThinking: boolean
  startTime: number
  durationSeconds: number
}

export interface ToolCall {
  id: string
  name: string
  args: Record<string, any>
  status: 'running' | 'done' | 'error'
  output?: string
}

export interface SpawnedTask {
  task_id: string
  subagent_type: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  toolCalls: ToolCall[]
  todos?: string[]
  output?: string
  duration_ms?: number
}

export interface UploadedFile {
  file_id: string
  filename: string
  size: number
  content_type: string
  source: string
  download_url: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  files?: UploadedFile[]
  toolCalls?: ToolCall[]
  thinking?: ThinkingState
  displayScenario?: DisplayScenario
  spawnedTasks?: SpawnedTask[]
  todos?: string[]
}

export interface SSEEvent {
  event: string
  data: any
}

export interface Agent {
  id: string
  name: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  description?: string
}
