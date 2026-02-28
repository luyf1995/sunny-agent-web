/**
 * 获取环境
 * @returns {string}
 */
export function getEnv(): string {
  return import.meta.env.MODE
}

/**
 * 是否是开发环境
 * @returns {boolean}
 */
export function isDevEnv(): boolean {
  return import.meta.env.DEV
}

/**
 * 是否是生产环境
 * @returns {boolean}
 */
export function isProdEnv(): boolean {
  return import.meta.env.PROD
}

/**
 * 获取变量名
 * @param {string} title app title
 * @return {string}
 */
const getVariableName = (title: string) => {
  function strToHex(str: string) {
    const result: string[] = []
    for (let i = 0; i < str.length; ++i) {
      const hex = str.charCodeAt(i).toString(16)
      result.push(('000' + hex).slice(-4))
    }
    return result.join('').toUpperCase()
  }
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '')
}

/**
 * 获取环境变量
 */
export const getAppEnvConfig = () => {
  const APP_TITLE = getVariableName(import.meta.env.VITE_APP_TITLE)
  const ENV: ImportMetaEnv = isDevEnv() ? import.meta.env : window[APP_TITLE] || {}
  return ENV
}
