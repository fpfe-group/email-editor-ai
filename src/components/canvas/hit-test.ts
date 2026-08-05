export function refineToColumnHitTarget(nodeEl: HTMLElement, x: number): HTMLElement {
  const columns = Array.from(nodeEl.querySelectorAll<HTMLElement>('div[class*="mj-column-"]'))
  if (columns.length === 0) return nodeEl

  const containingColumn = columns.find((column) => {
    const rect = column.getBoundingClientRect()
    return x >= rect.left && x <= rect.right
  })

  return containingColumn ?? nodeEl
}
