import { defineStore } from 'pinia'

interface IAppState {
  isCollapsed: boolean
}

const appStore = defineStore('app', {
  state: (): IAppState => {
    return {
      isCollapsed: false
    }
  },
  actions: {
    setIsCollapsed(isCollapsed: boolean) {
      this.isCollapsed = isCollapsed
    }
  }
})

export default appStore
