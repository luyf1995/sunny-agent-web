<template>
  <sy-dialog v-model="visible" append-to-body modal-class="user-dialog" body-class="user-dialog__body">
    <template #header>
      <div class="user-dialog__header">
        <h3>
          <user-plus :size="20" />
          创建新用户
        </h3>
        <button-icon class="close-btn" @click="visible = false">
          <x :size="18" />
        </button-icon>
      </div>
    </template>
    <div class="user-dialog__body">
      <el-form ref="addFormRef" :model="addForm" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option v-for="item in ROLE_LIST" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="user-dialog__footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">创建用户</el-button>
      </div>
    </template>
  </sy-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { UserPlus, X } from 'lucide-vue-next'
import { cloneDeep } from 'lodash-es'

import SyDialog from '@/components/sy-dialog/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'

const ROLE_LIST = [
  {
    label: '用户',
    value: 'user'
  },
  {
    label: '管理员',
    value: 'admin'
  }
]

const DEFAULT_FORM = {
  username: '',
  password: '',
  role: ''
}

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})
watch(visible, value => {
  if (value) {
    init()
  }
})

const addFormRef = ref()
const addForm = ref(cloneDeep(DEFAULT_FORM))

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
})

/**
 * 初始化
 */
const init = () => {
  addForm.value = cloneDeep(DEFAULT_FORM)
  addFormRef.value?.resetFields()
}

/**
 * 提交
 */
const handleSubmit = async () => {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()
    console.log(addForm.value)
    // visible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>
<style scoped lang="scss"></style>
<style lang="scss">
.user-dialog {
  .el-dialog {
    padding: 0;
    width: 100%;
    max-width: 400px;
  }

  // .el-dialog__header,
  // .el-dialog__footer {
  //   padding: 0;
  // }

  // .el-dialog__body {
  //   height: 100%;
  // }
  .user-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: var(--border);

    h3 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    .close-btn {
      color: #64748b;
    }
  }

  .user-dialog__body {
    padding: 20px;
  }

  .user-dialog__footer {
    padding: 0 20px 20px;
  }
}
</style>
