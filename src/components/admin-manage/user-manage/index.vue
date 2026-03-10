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
        :total="total"
        @page-change="fetchUserList"
      ></sy-table>
    </div>
    <add-user v-model="addUserVisible" @success="fetchUserList" />
  </div>
</template>
<script setup lang="tsx">
import { computed, ref, VNode } from 'vue'
import { UserPlus, Shield, Trash2 } from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

import SyTable from '@/components/sy-table/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'
import AddUser from './add-user.vue'

import useTableHeight from '@/hooks/use-table-height'
import { useUserStore } from '@/store'
import { deleteUser, getUserList } from '@/api/user'
import { UserInfo } from '@/api/user/types'

const userStore = useUserStore()
const { tableHeight } = useTableHeight(['.user-table'], 16)

const userInfo = computed(() => {
  return userStore.userInfo
})

const columns = ref([
  {
    prop: 'usernumb',
    label: '工号',
    align: 'left',
    minWidth: 160,
    slot: (h: () => VNode, { row }: { row: UserInfo }) => {
      return (
        <div class="user-info">
          <Shield size={18} class="user-info__icon" />
          <div class="user-info__name">{row.usernumb}</div>
          {userInfo.value?.usernumb === row.usernumb ? <div class="user-info__tag">(你)</div> : ''}
        </div>
      )
    }
  },
  {
    prop: 'username',
    label: '姓名',
    align: 'left'
  },
  {
    prop: 'role',
    label: '角色',
    align: 'left',
    slot: (h: () => VNode, { row }: { row: UserInfo }) => {
      return (
        <el-tag type="primary" round>
          {row.role?.name}
        </el-tag>
      )
    }
  },
  // {
  //   prop: 'status',
  //   label: '状态',
  //   align: 'left',
  //   slot: (h: () => VNode, { row }: { row: UserInfo }) => {
  //     return (
  //       <el-tag type="success" round>
  //         {row.status}
  //       </el-tag>
  //     )
  //   }
  // },
  {
    prop: 'created_at',
    label: '创建时间',
    align: 'left',
    width: 130,
    slot: (h: () => VNode, { row }: { row: UserInfo }) => {
      return dayjs(row.created_at).format('YYYY年MM月DD日')
    }
  },
  {
    prop: 'action',
    label: '操作',
    align: 'left',
    fixed: 'right',
    width: 80,
    slot: (h: () => VNode, { row }: { row: UserInfo }) => {
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

const tableData = ref<UserInfo[]>([])

const searchForm = ref({
  page: 1,
  page_size: 15
})
const total = ref(0)
/**
 * 获取用户列表
 */
const fetchUserList = async () => {
  try {
    const { data } = await getUserList(searchForm.value)
    tableData.value = data?.items ?? []
    total.value = data?.total ?? 0
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
onSeach()

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
