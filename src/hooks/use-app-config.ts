import { getAppEnvConfig } from '@/utils/env'

/**
 * 全局配置
 */
export default () => {
  const {
    VITE_APP_TITLE,
    VITE_API_IP,
    VITE_API_URL,
    VITE_API_URL_PREFIX,
    VITE_API_FLV_PORT,
    VITE_AUDIO_PATH,
    VITE_MARKER_FILE_PATH,
    VITE_SSO_LOGIN_URL,
    VITE_SSO_LOGOUT_URL
  } = getAppEnvConfig()
  return {
    appTitle: VITE_APP_TITLE,
    apiIP: VITE_API_IP,
    apiUrl: VITE_API_URL,
    apiUrlPrefix: VITE_API_URL_PREFIX,
    apiFlvPort: VITE_API_FLV_PORT,
    audioPath: VITE_AUDIO_PATH,
    markerFilePath: VITE_MARKER_FILE_PATH,
    ssoLoginUrl: VITE_SSO_LOGIN_URL,
    ssoLogoutUrl: VITE_SSO_LOGOUT_URL
  }
}
