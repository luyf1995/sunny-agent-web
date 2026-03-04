/**
 * 从URL中提取参数
 * @param {string} url 要解析的URL地址（可选，默认取当前页面URL）
 * @param {string} paramName 参数名，不传则返回所有参数的对象
 */
export const getUrlParams = (url: string, paramName?: string) => {
  if (typeof url === 'string' && !paramName && !url.includes('//')) {
    paramName = url
    url = window.location.href
  }
  const targetUrl = url || window.location.href

  try {
    const queryStr = targetUrl.split('#')[0].split('?')[1]
    if (!queryStr) {
      return paramName ? null : {}
    }
    const paramsObj: Record<string, string> = {}
    queryStr.split('&').forEach(item => {
      const [key, value] = item.split('=')
      const decodeKey = key ? decodeURIComponent(key.trim()) : ''
      const decodeValue = value ? decodeURIComponent(value.trim()) : ''
      if (decodeKey) {
        paramsObj[decodeKey] = decodeValue
      }
    })

    return paramName ? paramsObj[paramName] || null : paramsObj
  } catch (e) {
    console.error('URL参数解析失败：', e)
    return paramName ? null : {}
  }
}

/**
 * 移除URL中的哈希值（#及后面的所有内容）
 * @param {string} url 要处理的URL（默认取当前页面的window.location.href）
 */
export const removeUrlHash = (url?: string) => {
  const targetUrl = url || window.location.href
  if (!targetUrl) return ''
  const resultUrl = targetUrl.split('#')[0]
  return resultUrl
}
