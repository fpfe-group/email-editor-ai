import { describe, expect, it, vi } from 'vitest'
import { refineToColumnHitTarget } from '../hit-test'

function makeSectionWithColumn() {
  const section = document.createElement('div')
  const column = document.createElement('div')
  column.className = 'mj-column-per-50'
  section.appendChild(column)

  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 600, 200))
  vi.spyOn(column, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 0, 220, 200))

  return { section, column }
}

describe('refineToColumnHitTarget', () => {
  it('returns a column when the pointer is inside that column', () => {
    const { section, column } = makeSectionWithColumn()

    expect(refineToColumnHitTarget(section, 180)).toBe(column)
  })

  it('returns the outer node when the pointer is outside all columns', () => {
    const { section } = makeSectionWithColumn()

    expect(refineToColumnHitTarget(section, 360)).toBe(section)
  })
})
