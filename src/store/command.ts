import { defineStore } from 'pinia'
import { getPluginCommandList } from '@/api/plugin'
import { CommandInfo } from '@/api/plugin/types'

interface CommandState {
  commands: CommandInfo[]
}

const commandStore = defineStore('command', {
  persist: true,
  state: (): CommandState => {
    return {
      commands: []
    }
  },
  actions: {
    async fetchCommands() {
      try {
        const { data } = await getPluginCommandList()
        this.commands = data.commands ?? []
      } catch (error) {
        console.error('获取commands失败:', error)
      }
    }
  }
})

export default commandStore
