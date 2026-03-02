import { ExtractPublicPropTypes, VNode } from 'vue'
import { type DialogProps, dialogEmits } from 'element-plus'

export type SlotType = string | VNode | (() => VNode)

type DialogEmitsType = {
  [K in keyof Omit<typeof dialogEmits, 'update:modelValue'> as `on${Capitalize<string & K>}`]?: () => void
}
interface EmitsTypes extends DialogEmitsType {
  'onUpdate:modelValue'?: (val: boolean) => void
}

export interface Props extends ExtractPublicPropTypes<DialogProps> {
  content?: SlotType
  header?: SlotType
  footer?: SlotType
  showFullscreen?: boolean
  showFooter?: boolean
  showSubmit?: boolean
  fixedFooterWhenScroll?: boolean
}

export interface ImperativeOptions extends Props, /* @vue-ignore */ EmitsTypes {
  onSubmit?: () => void
}
