export function checkIsColumnNeedScroll(id) {
  const dom = document.querySelector(`#column${id}`)
  if (!dom) return false

  const domOffsetTop = dom.offsetTop
  const windowHeight = window.innerHeight
  const domHeight = dom.offsetHeight

  return windowHeight - domOffsetTop - domHeight < 0
}
