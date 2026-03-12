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
