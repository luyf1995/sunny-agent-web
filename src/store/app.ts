import { defineStore } from 'pinia'

interface IAppState {}

const appStore = defineStore('app', {
  state: (): IAppState => {
    return {}
  },
  actions: {}
})

export default appStore
