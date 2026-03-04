<template>
  <div></div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const verifyError = ref(false)

const verify = async () => {
  loading.value = true
  try {
    const ticket = route.query.ticket as string
    if (ticket) {
      await userStore.verifySSOTicket(ticket)
      router.push({ path: '/', replace: true })
    } else {
      throw new Error('ticket参数为空')
    }
  } catch (error) {
    console.error('ticket认证失败', error)
    verifyError.value = true
  } finally {
    loading.value = false
  }
}
verify()
</script>
