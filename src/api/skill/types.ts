export interface SkillInfo {
  name: string
  description: string
  scope: string
  is_enabled: boolean
  is_default_enabled: boolean
  has_scripts: boolean
}

export interface SkillListRes {
  skills: SkillInfo[]
  total: number
}

export interface SkillInfoDetail {
  name: string
  description: string
  version: string
  files: SkillDetailFile[]
}
export interface SkillDetailFile {
  type: string
  path: string
  content: string
}
