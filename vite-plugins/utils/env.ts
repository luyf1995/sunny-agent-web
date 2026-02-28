import { resolve } from 'path'
import dotenv from 'dotenv'
import fs from 'fs-extra'

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfigFiles() {
  const script = process.env.npm_lifecycle_script as string
  const reg = new RegExp('--mode ([a-z_\\d]+)')
  const result = reg.exec(script)
  if (result) {
    const mode = result[1]
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.production']
}

/**
 * 获取配置文件中的环境变量
 * @param configFiles 需要获取的配置文件名数组
 */
export async function getEnvConfig(configFiles = getConfigFiles()): Promise<{
  [key: string]: string
}> {
  let envConfig = {}

  for (const confFile of configFiles) {
    try {
      const envPath = await fs.readFile(resolve(process.cwd(), confFile), { encoding: 'utf8' })
      const env = dotenv.parse(envPath)
      envConfig = { ...envConfig, ...env }
    } catch (e) {
      console.error(`${confFile} 配置文件中环境变量配置有误！`, e)
    }
  }

  return envConfig
}
