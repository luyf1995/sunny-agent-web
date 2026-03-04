<template>
  <button class="button-icon" :class="{ 'button-icon--border': props.border }">
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'danger' | 'info' | 'success' | 'warning'
  border?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  border: false
})
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

  &--border {
    border: var(--border);
  }
}
</style>
