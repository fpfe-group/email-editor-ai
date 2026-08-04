import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import InlineToolbar from '../InlineToolbar.vue'
import { EMAIL_EDITOR_CONFIG_KEY } from '../../../injection-keys'

function makeEditor() {
  return {
    isActive: () => false,
  }
}

describe('InlineToolbar', () => {
  it('allows typing in the AI prompt input while preserving toolbar selection behavior', async () => {
    const wrapper = mount(InlineToolbar, {
      props: {
        editor: makeEditor() as any,
      },
      global: {
        provide: {
          [EMAIL_EDITOR_CONFIG_KEY as symbol]: {
            variables: ref([]),
            aiProvider: {
              generateText: async () => '',
            },
          },
        },
        stubs: {
          EIcon: { template: '<span />' },
        },
      },
    })

    await wrapper.get('.ebb-inline-toolbar__btn--ai').trigger('click')

    const menuItemMouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    wrapper.get('.ebb-ai-menu__item').element.dispatchEvent(menuItemMouseDown)
    expect(menuItemMouseDown.defaultPrevented).toBe(true)

    await wrapper.get('.ebb-ai-menu__item').trigger('click')

    const promptInput = wrapper.get('.ebb-ai-menu__prompt-input')
    const inputMouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    promptInput.element.dispatchEvent(inputMouseDown)
    expect(inputMouseDown.defaultPrevented).toBe(false)

    await promptInput.setValue('生成一个欢迎语')
    expect((promptInput.element as HTMLInputElement).value).toBe('生成一个欢迎语')
  })
})
