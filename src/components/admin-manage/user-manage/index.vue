<template>
  <div class="user-manage">
    <div class="user-tool">
      <el-button type="primary" class="add-btn" @click="handleAddUser">
        <user-plus :size="18" />
        添加用户
      </el-button>
    </div>
    <div class="user-table">
      <sy-table
        v-model:page="searchForm.page"
        v-model:page-size="searchForm.page_size"
        :columns="columns"
        :data="tableData"
        :pagination="true"
        :border="false"
        :height="tableHeight"
        @page-change="getUserList"
      ></sy-table>
    </div>
    <add-user v-model="addUserVisible" @success="getUserList" />
  </div>
</template>
<script setup lang="tsx">
import { ref, VNode } from 'vue'
import { UserPlus, Shield, Trash2 } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'

import SyTable from '@/components/sy-table/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'
import AddUser from './add-user.vue'

import useTableHeight from '@/hooks/use-table-height'
import { deleteUser, getUserList } from '@/api/user'

interface UserMeta {
  username: string
  role: string
  status: string
  createTime: string
}

const { tableHeight } = useTableHeight(['.user-table'], 16)
const columns = ref([
  {
    prop: 'username',
    label: '用户',
    align: 'left',
    minWidth: 160,
    slot: (h: () => VNode, { row }: { row: UserMeta }) => {
      return (
        <div class="user-info">
          <Shield size={18} class="user-info__icon" />
          <div class="user-info__name">{row.username}</div>
          <div class="user-info__tag">(你)</div>
        </div>
      )
    }
  },
  {
    prop: 'role',
    label: '角色',
    align: 'left',
    slot: (h: () => VNode, { row }: { row: UserMeta }) => {
      return (
        <el-tag type="primary" round>
          {row.role}
        </el-tag>
      )
    }
  },
  {
    prop: 'status',
    label: '状态',
    align: 'left',
    slot: (h: () => VNode, { row }: { row: UserMeta }) => {
      return (
        <el-tag type="success" round>
          {row.status}
        </el-tag>
      )
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    align: 'left',
    width: 130
  },
  {
    prop: 'action',
    label: '操作',
    align: 'left',
    fixed: 'right',
    width: 80,
    slot: (h: () => VNode, { row }: { row: UserMeta }) => {
      return (
        <div class="table-action">
          <ButtonIcon border class="action-btn" title="删除用户" onClick={() => handleDelete(row)}>
            <Trash2 size={16} />
          </ButtonIcon>
        </div>
      )
    }
  }
])

const tableData = ref<UserMeta[]>([
  {
    username: 'admin',
    role: 'admin',
    status: 'active',
    createTime: '2023年2月27日'
  }
])

const searchForm = ref({
  page: 1,
  page_size: 15
})
/**
 * 获取用户列表
 */
const fetchUserList = async () => {
  try {
    const { data } = await getUserList(searchForm.value)
    tableData.value = data ?? []
  } catch (error) {
    console.error(error)
  }
}
/**
 * 搜索
 */
const onSeach = () => {
  searchForm.value.page = 1
  fetchUserList()
}

const addUserVisible = ref(false)
/**
 * 添加用户
 */
const handleAddUser = () => {
  addUserVisible.value = true
}

/**
 * 删除
 * @param {any} row
 */
const handleDelete = async (row: any) => {
  ElMessageBox.confirm('是否确认删除', '警告', { type: 'warning' })
    .then(async () => {
      try {
        await deleteUser(row.id)
        ElMessage.success('删除成功！')
        fetchUserList()
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {})
}
</script>
<style scoped lang="scss">
@use './index';
</style>
