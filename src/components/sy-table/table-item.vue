<!-- eslint-disable vue/valid-v-slot -->
<template>
  <el-table-column v-bind="getItem">
    <template v-if="typeof getItem.slotHeader === 'function' || getItem.keywordsFilter" #header="{ column, $index }">
      <slot-render
        v-if="typeof getItem.slotHeader === 'function'"
        :render="getItem.slotHeader"
        :scope="{ column, $index }"
      ></slot-render>
      <keywords-filter
        v-else-if="getItem.keywordsFilter"
        :column="getItem"
        @filter-popover-change="
          value =>
            emits('filterChange', {
              value,
              prop: getItem.prop
            })
        "
      ></keywords-filter>
    </template>

    <template v-if="typeof getItem.slot === 'function'" #default="{ row, column, $index }">
      <slot-render :render="getItem.slot" :scope="{ row, column, $index }"></slot-render>
    </template>

    <template v-if="Array.isArray(getItem.children) && getItem.children.length > 0" #default>
      <table-item v-for="(tableItem, index) in getItem.children" :key="index" :item="tableItem"></table-item>
    </template>
  </el-table-column>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import SlotRender from './slot-render.vue'
import KeywordsFilter from './keywords-filter.vue'

interface IProps {
  item: any
}
const props = withDefaults(defineProps<IProps>(), {
  item: {}
})
const emits = defineEmits<{
  (e: 'filterChange', data: { value: string; prop: string }): void
}>()

const defaultItem = ref({
  align: 'center'
})

const getItem = computed(() => {
  return { ...defaultItem.value, ...props.item }
})
</script>
