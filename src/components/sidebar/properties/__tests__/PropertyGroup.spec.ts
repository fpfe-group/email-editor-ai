import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PropertyGroup from '../PropertyGroup.vue'
import type { EmailNode, PropertyDefinition } from '../../../../types'

function mountBorderGroup(border = '') {
  const node: EmailNode = {
    id: 'node-1',
    type: 'mj-section',
    attributes: border ? { border } : {},
    children: [],
  }
  const properties: PropertyDefinition[] = [
    { key: 'border', label: 'prop_border', type: 'text', group: 'group_border' },
  ]

  return mount(PropertyGroup, {
    props: {
      label: '边框',
      properties,
      node,
    },
    global: {
      stubs: {
        EIcon: {
          props: ['name'],
          template: '<span class="icon">{{ name }}</span>',
        },
      },
    },
  })
}

describe('PropertyGroup', () => {
  it('replaces the color token when editing border color', async () => {
    const wrapper = mountBorderGroup('1px solid #cccccc')

    await wrapper.get('input[type="color"]').setValue('#ff0000')

    expect(wrapper.emitted('update')).toEqual([['border', '1px solid #ff0000']])
  })

  it('creates a complete border value when setting color on an empty border', async () => {
    const wrapper = mountBorderGroup()

    await wrapper.get('input[type="color"]').setValue('#00aaee')

    expect(wrapper.emitted('update')).toEqual([['border', '1px solid #00aaee']])
  })
})
