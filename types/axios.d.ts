import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    noLoading?: boolean // 不需要loading
    noDownload?: boolean // 遇到文件流，不需要直接下载
  }
}
