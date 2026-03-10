<template>
  <div class="web-search">
    <div class="web-search__header">
      <Search :size="16" class="web-search__icon" :class="{ 'web-search__icon--spinning': isRunning }" />
      <span class="web-search__title">网络搜索</span>
      <span class="web-search__query">{{ query }}</span>
    </div>

    <div v-if="isRunning" class="web-search__status">正在搜索...</div>

    <div v-else-if="isError" class="web-search__error">
      <AlertCircle :size="14" />
      <span>{{ result?.error || '搜索失败' }}</span>
    </div>

    <div v-else-if="isSuccess" class="web-search__content">
      <div v-if="result?.summary" class="web-search__summary">
        {{ result.summary }}
      </div>
      <div v-if="result?.results?.length" class="web-search__results">
        <a
          v-for="(item, index) in result.results"
          :key="index"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          class="web-search__result-item"
        >
          <div class="web-search__result-title">
            <ExternalLink :size="12" />
            <span>{{ item.title }}</span>
          </div>
          <div v-if="item.snippet" class="web-search__result-snippet">{{ item.snippet }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Search, AlertCircle, ExternalLink } from 'lucide-vue-next'
import { ToolCall, ToolCallWebSearchArgs, ToolCallWebSearchResult, ToolCallStatus } from '@/api/chat/tool-call'

interface Props {
  data: ToolCall
}

const props = defineProps<Props>()

const query = computed<string>(() => (props.data.args as ToolCallWebSearchArgs)?.query || '')

const result = computed<ToolCallWebSearchResult>(() => props.data.result as ToolCallWebSearchResult)

const isRunning = computed(() => props.data.status === ToolCallStatus.Running)

const isSuccess = computed(() => props.data.status === ToolCallStatus.Success)

const isError = computed(() => props.data.status === ToolCallStatus.Error)
</script>

<style scoped lang="scss">
.web-search {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.web-search__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.web-search__icon {
  color: #3b82f6;

  &--spinning {
    animation: spin 1s linear infinite;
  }
}

.web-search__title {
  font-weight: 500;
  color: #1e293b;
}

.web-search__query {
  font-size: 12px;
  color: #64748b;
}

.web-search__status {
  font-size: 12px;
  color: #94a3b8;
}

.web-search__error {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #ef4444;
  gap: 6px;
}

.web-search__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.web-search__summary {
  padding: 8px 10px;
  font-size: 13px;
  color: #475569;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  line-height: 1.5;
}

.web-search__results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.web-search__result-item {
  display: block;
  padding: 10px;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgb(59 130 246 / 10%);
  }
}

.web-search__result-title {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 13px;
  color: #1e293b;
  gap: 6px;
  font-weight: 500;

  &:hover {
    color: #3b82f6;
  }
}

.web-search__result-link {
  overflow: hidden;
  margin-bottom: 4px;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #94a3b8;
}

.web-search__result-snippet {
  display: -webkit-box;
  overflow: hidden;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
