import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { createAppConfigPlugin } from './vite-plugins/app-config'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ command, mode }) => {
  const isBuild = command === 'build'

  return {
    base: './',
    server: {
      open: true,
      port: 1995,
      host: '0.0.0.0'
    },
    build: {
      // sourcemap: true // 开启源码映射
    },
    // esbuild: {
    //   drop: ['console', 'debugger']
    // },
    plugins: [
      vue(),
      vueJsx(),
      createAppConfigPlugin({ isBuild }),
      mode === 'analyze' &&
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap'
        })
    ],
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
