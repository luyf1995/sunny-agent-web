<template>
  <el-button v-bind="$attrs" :loading="isLoading" :disabled="disabled || isLoading" @click="handleClick">
    <slot></slot>
  </el-button>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  onClick: {
    type: Function,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loadingDelay: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click'])

const innerLoading = ref(false)
let delayTimer = null

const isLoading = computed(() => {
  return props.loading !== undefined ? props.loading : innerLoading.value
})

/**
 * 点击处理
 */
const handleClick = async event => {
  if (props.loading !== undefined) {
    emit('click', event)
    return
  }
  try {
    if (props.loadingDelay > 0) {
      delayTimer = setTimeout(() => {
        innerLoading.value = true
      }, props.loadingDelay)
    } else {
      innerLoading.value = true
    }
    if (props.onClick) {
      const result = props.onClick(event)
      if (result && typeof result.then === 'function') {
        await result
      }
    }
  } catch (error) {
    throw error
  } finally {
    clearTimeout(delayTimer)
    innerLoading.value = false
  }
}

onBeforeUnmount(() => {
  if (delayTimer) {
    clearTimeout(delayTimer)
  }
})
</script>
