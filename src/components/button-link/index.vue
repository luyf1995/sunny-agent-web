<template>
  <button class="button-link">
    <slot></slot>
  </button>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
.button-link {
  font-size: 13px;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
