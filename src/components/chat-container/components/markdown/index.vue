<template>
  <markdown-renderer :content="content" />
</template>
<script setup>
import { ref } from 'vue'
import MarkdownRenderer from 'markstream-vue'
const chunk = ref('')

// const props = defineProps({
//   content: {
//     type: String,
//     default: ''
//   }
// })
const content = ref('')

const fullContent = `# Streaming Content\n\nThis text appears progressively...`
let i = 0
const interval = setInterval(() => {
  if (i < fullContent.length) {
    content.value += fullContent[i]
    i++
  } else {
    clearInterval(interval)
  }
}, 50)

// const evtSource = newEventSource('/api/ai-stream')
// evtSource.onmessage = e => {
//   chunk.value += e.data
// }
</script>
