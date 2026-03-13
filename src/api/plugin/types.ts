export interface PluginInfo {
  id: string
  name: string
  description: string
  version: string
  is_active: boolean
  command_count: number
  created_at: string
  updated_at: string
}

export interface PluginListRes {
  plugins: PluginInfo[]
  total: number
}

export interface PluginInfoDetail {
  name: string
  description: string
  version: string
  files: PluginDetailFile[]
}

export interface PluginDetailFile {
  type: string
  path: string
  content: string
}

export interface CommandListRes {
  commands: CommandInfo[]
  total: number
}
export interface CommandInfo {
  command_name: string
  command_description: string
  full_command: string
  plugin_name: string
  plugin_description: string
  argument_hint: string
}
