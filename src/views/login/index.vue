<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-logo">
          <logo-icon />
        </div>
        <h1>Sunny Agent</h1>
        <p class="login-subtitle">登录以继续</p>
      </div>
      <el-form class="login-form" :model="loginForm" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" required placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" required placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            <template v-if="loading"> 登录中... </template>
            <template v-else>
              <login-icon />
              <span>登录</span>
            </template>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import LoginIcon from '@/components/svgs/login-icon.vue'
import LogoIcon from '@/components/svgs/logo-icon.vue'

import useUserStore from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const rules = ref({})

const handleLogin = async () => {
  try {
    loading.value = true
    await userStore.login(loginForm.value)
    loading.value = false
    router.push({ path: '/' })
  } catch (error) {
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
@use './index';
</style>
