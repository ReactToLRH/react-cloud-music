export const debounce = (func, delay) => {
  let timer = null
  // eslint-disable-next-line func-names
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timer)
    }, delay)
  }
}

export default {
  debounce
}
