import { ProjectSessionInfo } from '@/api/project/types'
import { SessionInfo } from '@/api/session/types'
import mitt, { Emitter } from 'mitt'

type EventMap = {
  'session:unshift': SessionInfo
  'project:session:moved': ProjectSessionInfo
  'project:session:created': ProjectSessionInfo
}
export const EVENT_NAMES = {
  SESSION_UNSHIFT: 'session:unshift' as const,
  PROJECT_SESSION_MOVED: 'project:session:moved' as const,
  PROJECT_SESSION_CREATED: 'project:session:created' as const
}
const emitter: Emitter<EventMap> = mitt<EventMap>()

export default emitter
