/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string // app title
  readonly VITE_API_IP: string // 接口IP
  readonly VITE_API_URL: string // 接口地址
  readonly VITE_API_URL_PREFIX: string // 接口地址前缀
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
