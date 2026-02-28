/**
 * 节流函数
 * @param {Function} fn 要节流的函数
 * @param {number} delay 节流时间（ms）
 * @returns 节流后的函数
 */
export const throttle = (fn: (...args: any[]) => any, delay: number) => {
  let lastTime = 0
  return (...args: any[]) => {
    const now = Date.now()
    if (now - lastTime > delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
