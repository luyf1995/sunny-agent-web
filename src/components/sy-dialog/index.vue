<template>
  <el-dialog
    v-bind="{ ...$attrs, ...props }"
    ref="elDialogRef"
    v-model="visible"
    :customer-id="elDialogId"
    :fullscreen="fullscreen"
    @opened="handleDialogOpened"
    @closed="handleDialogClosed"
  >
    <template #header="{ close, titleId, titleClass }">
      <slot v-if="showHeader" name="header">
        <div class="dialog-header">
          <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
          <div class="dialog-header__btn">
            <el-button
              v-if="showFullscreen"
              link
              :icon="FullScreen"
              :title="fullscreen ? '取消全屏' : '全屏'"
              @click="fullscreen = !fullscreen"
            >
            </el-button>
            <el-button link :icon="Close" @click="close"> </el-button>
          </div>
        </div>
      </slot>
    </template>
    <slot></slot>
    <template #footer>
      <slot v-if="showFooter" name="footer">
        <div class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button v-if="showSubmit" type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { Close, FullScreen } from '@element-plus/icons-vue'
import { Props } from './types'
import { DEFAULT_OPTIONS } from './config'
defineOptions({
  inheritAttrs: false
})
const props = withDefaults(defineProps<Props>(), {
  ...DEFAULT_OPTIONS
})
const emits = defineEmits<{
  (e: 'submit'): void
}>()

const visible = defineModel('modelValue', {
  type: Boolean,
  default: false
})

const fullscreen = ref(false)

const elDialogId = ref('dialog-' + Date.now())

const isDialogScrollbarVisible = ref(false)
const scrollEl = ref()
const resizeObserver = ref()

/**
 * 提交
 */
const handleSubmit = () => {
  emits('submit')
}

/**
 * dialog open 回调
 */
const handleDialogOpened = () => {
  if (!props.fixedFooterWhenScroll) return
  nextTick(() => {
    scrollEl.value = document.querySelector(`.el-dialog[customer-id=${elDialogId.value}]`)?.parentNode
    if (scrollEl.value) {
      checkDialogScrollbar()
      resizeObserver.value = new ResizeObserver(() => {
        checkDialogScrollbar()
      })
      resizeObserver.value.observe(scrollEl.value)
      scrollEl.value.addEventListener('scroll', handleScroll)
    }
  })
}

/**
 * dialog close 回调
 */
const handleDialogClosed = () => {
  if (!props.fixedFooterWhenScroll || !scrollEl.value) return
  resizeObserver.value.unobserve(scrollEl.value)
  scrollEl.value.removeEventListener('scroll', handleScroll)
}

/**
 * 检查 dialog 滚动条是否可见
 */
const checkDialogScrollbar = () => {
  if (!scrollEl.value) return
  isDialogScrollbarVisible.value = scrollEl.value.scrollHeight > scrollEl.value.clientHeight
  adjustFooterPosition()
}

/**
 * 滚动回调
 */
const handleScroll = () => {
  if (isDialogScrollbarVisible.value) {
    adjustFooterPosition()
  }
}

/**
 * dialog footer 位置
 */
const adjustFooterPosition = () => {
  if (!scrollEl.value) return
  const dialogEl = document.querySelector('.el-dialog')
  if (!dialogEl) return
  const footerEl = scrollEl.value.querySelector('.el-dialog__footer') as HTMLDivElement
  if (!footerEl) return
  if (isDialogScrollbarVisible.value) {
    footerEl.classList.add('dialog-footer-fixed')

    // TODO：待处理最小阈值。
    // const viewportHeight = window.innerHeight
    // const footerBottom = viewportHeight - dialogRect.bottom
    // if (footerBottom < 40) {
    //   footerEl.classList.add('dialog-footer-fixed')
    // } else {
    //   footerEl.classList.remove('dialog-footer-fixed')
    // }
  } else {
    footerEl.classList.remove('dialog-footer-fixed')
  }
}
</script>
<style scoped lang="scss">
.dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &__btn {
    .el-button {
      font-size: 16px;

      & + .el-button {
        margin-left: 8px;
      }
    }
  }
}
</style>
<style lang="scss">
.dialog-footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9999;
  padding-top: 0;
  width: 100%;
  text-align: center;
  background-color: white;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 -2px 10px rgb(0 0 0 / 10%);
  line-height: 50px;
}
</style>
