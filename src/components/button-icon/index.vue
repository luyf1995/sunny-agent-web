<template>
  <button class="button-icon">
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'danger' | 'info' | 'success' | 'warning'
}

const props = defineProps<Props>()
</script>
<style scoped lang="scss">
.button-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
