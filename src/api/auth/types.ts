import { CurrentUserInfo } from '@/api/user/types'

export interface TicketRes {
  access_token: string
  refresh_token: string
  token_type: string
  user: CurrentUserInfo
}
