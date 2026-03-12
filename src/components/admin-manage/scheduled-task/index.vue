<template>
  <div class="scheduled-task">
    <div class="scheduled-task__tool">
      <el-radio-group v-model="tabType">
        <el-radio-button v-for="item in TASK_TAB_TYPES" :key="item.value" :value="item.value">{{
          item.label
        }}</el-radio-button>
      </el-radio-group>
      <el-button type="primary" class="add-btn" @click="handleAdd">
        <plus :size="18" />
        新建定时任务
      </el-button>
    </div>
    <div class="scheduled-task__table">
      <component
        :is="COMPONENT_MAP[tabType].component"
        v-if="COMPONENT_MAP[tabType]"
        v-bind="COMPONENT_MAP[tabType]?.props ?? {}"
      ></component>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ref, markRaw } from 'vue'
import { Plus } from 'lucide-vue-next'

import ScheduledTable from './scheduled-table.vue'
import ExecutedTable from './executed-table.vue'

import { TaskTabType, TASK_TAB_TYPES } from './utils'

const tabType = ref(TaskTabType.Scheduled)

const COMPONENT_MAP = {
  [TaskTabType.Scheduled]: {
    component: markRaw(ScheduledTable),
    props: {
      ref: 'scheduledTableRef'
    }
  },
  [TaskTabType.Executed]: {
    component: markRaw(ExecutedTable),
    props: {}
  }
}

const scheduledTableRef = ref<InstanceType<typeof ScheduledTable>>()

const handleAdd = () => {
  scheduledTableRef.value?.handleAdd()
}
</script>
<style scoped lang="scss">
.scheduled-task {
  display: flex;
  height: 100%;
  flex-direction: column;

  &__tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__table {
    flex: 1;
  }

  :deep(.table-action) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
}
</style>
