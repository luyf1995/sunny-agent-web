import { PluginOption } from 'vite'
import { getEnvConfig } from './utils/env'

const GLOBAL_CONFIG_FILE_NAME = '_app.config.js'
const PLUGIN_NAME = 'app-config'

/**
 * 给window对象绑定全局变量的变量名
 * @param {string} title app title
 * @returns {string}
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

async function getConfigSource(appTitle: string) {
  const config = await getEnvConfig()
  const variableName = getVariableName(appTitle)
  const windowVariable = `window.${variableName}`

  let source = `${windowVariable}=${JSON.stringify(config)};`
  source += `
    Object.freeze(${windowVariable});
    Object.defineProperty(window, "${variableName}", {
      configurable: false,
      writable: false,
    });
  `.replace(/\s/g, '')
  return source
}

export const createAppConfigPlugin = ({ isBuild }: { isBuild: boolean }): PluginOption => {
  let publicPath: string
  let source: string

  if (!isBuild) {
    return {
      name: PLUGIN_NAME
    }
  }
  return {
    name: PLUGIN_NAME,
    async configResolved(_config) {
      const appTitle = _config?.env?.VITE_APP_TITLE ?? ''
      publicPath = _config.base
      // window上绑定全局变量表达式
      source = await getConfigSource(appTitle)
    },
    transformIndexHtml(html) {
      publicPath = publicPath.endsWith('/') ? publicPath : `${publicPath}/`

      const appConfigSrc = `${publicPath || '/'}${GLOBAL_CONFIG_FILE_NAME}`
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              src: appConfigSrc
            }
          }
        ]
      }
    },
    async generateBundle() {
      try {
        this.emitFile({
          type: 'asset',
          fileName: GLOBAL_CONFIG_FILE_NAME,
          source
        })
        console.log('配置文件创建成功!')
      } catch (error) {
        console.error('配置文件创建失败：' + error)
      }
    }
  }
}
