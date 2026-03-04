<template>
  <div class="page-container">
    <div class="content">
      <h1>认证失败</h1>
      <el-button type="primary" @click="router.back()">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;

  .content {
    padding: 40px;
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);

    h1 {
      margin-bottom: 16px;
      font-size: 24px;
      color: #303133;
    }

    p {
      margin-bottom: 24px;
      font-size: 14px;
      color: #606266;
    }

    .el-button {
      min-width: 120px;
    }
  }
}
</style>
