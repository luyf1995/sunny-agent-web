<template>
  <svg :width="width" :height="height" viewBox="0 0 48 48" fill="none">
    <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <line x1="24" y1="4" x2="24" y2="10" />
      <line x1="24" y1="38" x2="24" y2="44" />
      <line x1="4" y1="24" x2="10" y2="24" />
      <line x1="38" y1="24" x2="44" y2="24" />
      <line x1="9.86" y1="9.86" x2="14.1" y2="14.1" />
      <line x1="33.9" y1="33.9" x2="38.14" y2="38.14" />
      <line x1="9.86" y1="38.14" x2="14.1" y2="33.9" />
      <line x1="33.9" y1="14.1" x2="38.14" y2="9.86" />
    </g>
    <circle cx="24" cy="24" r="12" fill="currentColor" opacity="0.1" />
    <circle cx="24" cy="24" r="12" stroke="currentColor" stroke-width="2" fill="none" />
    <circle cx="24" cy="21" r="2.5" fill="currentColor" />
    <circle cx="19" cy="26" r="2" fill="currentColor" />
    <circle cx="29" cy="26" r="2" fill="currentColor" />
    <path d="M24 23.5v2M21.5 25l-1.5 1M26.5 25l1.5 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>
</template>
<script setup lang="ts">
interface Props {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 48,
  height: 48
})
</script>
