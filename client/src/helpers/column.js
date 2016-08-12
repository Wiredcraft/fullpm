export function calcColumnBodyMaxHeight(id) {
  const dom = document.querySelector(`#column${id}`)
  if (!dom) return false

  const header = document.querySelector(`#column${id} .header`)
  const domOffsetTop = dom.offsetTop
  const windowHeight = window.innerHeight
  const headerHeight = header.offsetHeight

  // 4 come from border of column.
  return windowHeight - domOffsetTop - headerHeight - 4
}

export function calcColumnBodyHeight(id) {
  const dom = document.querySelector(`#column${id} .body`)
  if (!dom) return false

  return dom.offsetHeight
}
