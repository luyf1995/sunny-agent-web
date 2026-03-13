import { defineStore } from 'pinia'

interface AppState {}

const appStore = defineStore('app', {
  state: (): AppState => {
    return {}
  },
  actions: {}
})

export default appStore
