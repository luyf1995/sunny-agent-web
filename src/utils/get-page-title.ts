import useAppConfig from '@/hooks/use-app-config'

/**
 * 获取页面标题
 * @param {string} pageTitle 页面标题
 * @returns {string}
 */
export default function getPageTitle(pageTitle: string): string {
  const { appTitle } = useAppConfig()

  if (pageTitle) {
    return `${pageTitle} - ${appTitle}`
  }
  return appTitle
}
