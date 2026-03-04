<template>
  <div class="user-manage">
    <div class="user-tool">
      <el-button type="primary" class="add-btn" @click="handleAddUser">
        <user-plus :size="18" />
        添加用户
      </el-button>
    </div>
    <div class="user-table">
      <sy-table :columns="columns" :data="data" :pagination="false" :border="false"></sy-table>
    </div>
    <add-user v-model="addUserVisible" />
  </div>
</template>
<script setup lang="tsx">
import { ref, VNode } from 'vue'
import { UserPlus, Shield, X, Check, Trash2 } from 'lucide-vue-next'
import { ElMessageBox } from 'element-plus'

import SyTable from '@/components/sy-table/index.vue'
import ButtonIcon from '@/components/button-icon/index.vue'
import AddUser from './add-user.vue'

interface UserMeta {
  username: string
  role: string
  status: string
  createTime: string
}

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
    slot: (h: () => VNode, { row }: { row: UserMeta }) => {
      return (
        <div class="table-action">
          <ButtonIcon border class="action-btn" title="禁用用户">
            {row.status === 'active' ? <X size={16} /> : <Check size={16} />}
          </ButtonIcon>
          <ButtonIcon border class="action-btn" title="删除用户" onClick={() => handleDelete(row)}>
            <Trash2 size={16} />
          </ButtonIcon>
        </div>
      )
    }
  }
])

const data = ref([
  {
    username: 'admin',
    role: 'admin',
    status: 'active',
    createTime: '2023年2月27日'
  }
])

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
const handleDelete = (row: any) => {
  ElMessageBox.confirm('是否确认删除', '警告', { type: 'warning' })
    .then(() => {})
    .catch(() => {})
}
</script>
<style scoped lang="scss">
.user-manage {
  display: flex;
  flex-direction: column;
  height: 100%;

  .user-tool {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
    flex-shrink: 0;

    .add-btn {
      display: flex;
      align-items: center;
      font-size: 13px;

      :deep(.lucide) {
        margin-right: 8px;
      }
    }
  }

  .user-table {
    font-size: 13px;
    border: var(--border);
    border-radius: 12px;
    flex: 1;

    :deep(.el-table) {
      border-radius: 12px;

      .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #1e293b;
        font-weight: 500;

        &__icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        &__tag {
          padding: 2px 6px;
          font-size: 11px;
          color: #2563eb;
          background: #eff6ff;
          border-radius: 4px;
          font-weight: 500;
        }
      }

      .table-action {
        display: flex;
        gap: 8px;

        .action-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 32px;
          height: 32px;
          color: #64748b;
          border: var(--border);
          border-radius: 8px;

          &:hover {
            color: #dc2626;
            background: #fef2f2;
            border-color: #dc2626;
          }
        }
      }
    }
  }
}
</style>
