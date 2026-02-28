<template>
  <vue-draggable-resizable
    ref="vueDraggableResizableRef"
    :w="width"
    :h="height"
    :min-width="minWidth"
    :min-height="minHeight"
    :parent="true"
    class="draggable-panel"
  >
    <slot></slot>
  </vue-draggable-resizable>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'

interface Props {
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 100,
  height: 100,
  minWidth: 100,
  minHeight: 100
})
const vueDraggableResizableRef = ref()
</script>
<style lang="scss">
@import url('vue-draggable-resizable/style.css');
</style>
<style scoped lang="scss">
.draggable-panel {
  z-index: 100 !important;
  background-color: #fff;
  border: none;
}
</style>
