export function calcColumnBodyHeight(id) {
  const dom = document.querySelector(`#column${id}`)
  if (!dom) return false

  const header = document.querySelector(`#column${id} .header`)
  const domOffsetTop = dom.offsetTop
  const windowHeight = window.innerHeight
  const headerHeight = header.offsetHeight

  return windowHeight - domOffsetTop - headerHeight
}
