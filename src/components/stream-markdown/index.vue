<template>
  <markdown-renderer :content="content" v-bind="markdownProps"> </markdown-renderer>
</template>
<script setup lang="tsx">
import MarkdownRenderer, { getUseMonaco, setCustomComponents } from 'markstream-vue'
import 'markstream-vue/index.css'

interface Props {
  content?: string
}

const props = defineProps<Props>()

const markdownProps = {
  'code-block-light-theme': 'vitesse-light',
  'code-block-props': {
    'show-expand-button': false,
    'show-font-size-buttons': false
  }
}
</script>
