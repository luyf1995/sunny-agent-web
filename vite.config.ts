import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { createAppConfigPlugin } from './vite-plugins/app-config'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'

  return {
    base: './',
    server: {
      open: true,
      port: 1995,
      host: '0.0.0.0'
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
