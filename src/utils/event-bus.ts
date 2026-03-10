import { SessionInfo } from '@/api/session/types'
import mitt, { Emitter } from 'mitt'

type EventMap = {
  'session:unshift': SessionInfo
}
export const EVENT_NAMES = {
  SESSION_UNSHIFT: 'session:unshift' as const
}
const emitter: Emitter<EventMap> = mitt<EventMap>()

export default emitter
