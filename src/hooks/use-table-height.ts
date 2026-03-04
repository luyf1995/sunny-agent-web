import { onMounted, ref } from 'vue'

type ContainersParam = (string | HTMLElement)[] | (() => (string | HTMLElement)[])

/**
 * @param {any} dom
 * @returns {boolean}
 */
const isDom = (domExp: any) => {
  return domExp instanceof HTMLElement
}

/**
 * @param {string[]} containers // 元素集合，第一个元素为父元素
 * @param {number} extraHeight // 额外的高度
 * @return {number}
 */
export default (containers: ContainersParam, extraHeight?: number) => {
  const tableHeight = ref(0)

  const computeHeight = () => {
    const containersExp = typeof containers === 'function' ? containers() : containers

    const parentExp = containersExp[0]
    const childListExp = containersExp.slice(1)

    const container = isDom(parentExp) ? parentExp : (document.querySelector(parentExp) as HTMLElement)
    if (!container) return tableHeight
    let childTotalHeight = 0
    childListExp.forEach(item => {
      const dom = isDom(item) ? item : (document.querySelector(item) as HTMLElement)
      if (dom) {
        childTotalHeight += dom.offsetHeight
      }
    })
    tableHeight.value = container.offsetHeight - childTotalHeight - (extraHeight ?? 0)

    return tableHeight.value
  }

  onMounted(computeHeight)

  return {
    tableHeight,
    computeHeight
  }
}
