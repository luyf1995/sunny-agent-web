import { request } from '@/utils/request'
import { AxiosProgressEvent } from 'axios'
import useAppConfig from '@/hooks/use-app-config'
import { SkillInfo, SkillInfoDetail, SkillListRes } from './types'

const { apiUrl, apiUrlPrefix } = useAppConfig()

export const UPLOAD_SKILL_URL = `${apiUrl + apiUrlPrefix}/skills/upload`
/**
 * 上传技能
 * @param {FormData} formData
 * @param {Object} onUploadProgress
 */
export const uploadSkill = (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) =>
  request({
    method: 'post',
    url: `/skills/upload`,
    data: formData,
    onUploadProgress,
    noLoading: true
  })

/**
 * 查询技能
 */
export const getSkillList = () => {
  return request<SkillListRes>({
    url: `/skills/list`,
    method: 'get'
  })
}

/**
 * 删除技能
 * @param {string} skillName 技能名称
 */
export const deleteSkill = (skillName: string) => {
  return request({
    url: `/skills/${skillName}`,
    method: 'delete'
  })
}

/**
 * 启用/禁用技能
 * @param {string} skillName 技能名称
 * @param {boolean} enabled 是否启用
 */
export const enableSkill = (skillName: string, enabled: boolean) => {
  return request({
    url: `/skills/${skillName}`,
    method: 'patch',
    data: {
      is_enabled: enabled
    }
  })
}

/**
 * 查询技能详情
 * @param {string} skillName 技能名称
 */
export const getSkillDetail = (skillName: string) => {
  return request<SkillInfoDetail>({
    url: `/skills/${skillName}/files`,
    method: 'get'
  })
}
