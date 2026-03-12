import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { createAppConfigPlugin } from './vite-plugins/app-config'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig(({ command, mode }): any => {
  const isBuild = command === 'build'
  const env = loadEnv(mode, process.cwd(), 'VITE_API_URL')

  return {
    base: './',
    server: {
      open: true,
      port: 1995,
      host: '0.0.0.0'
      // proxy: {
      //   '/api': {
      //     target: env.VITE_API_URL,
      //     changeOrigin: true
      //   }
      // }
    },
    plugins: [vue(), vueJsx(), createAppConfigPlugin({ isBuild }), monacoEditorPlugin],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  }
})
