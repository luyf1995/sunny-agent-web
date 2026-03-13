import { getAllPluginCommands } from '@/api/plugin'
import { defineStore } from 'pinia'

interface CommandState {}

const appStore = defineStore('app', {
  state: (): CommandState => {
    return {
      commands: []
    }
  },
  actions: {
    fetchCommands() {
      getAllPluginCommands().then(res => {
        this.commands = res.data
      })
    }
  }
})

export default appStore
