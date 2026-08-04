import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import InlineToolbar from '../InlineToolbar.vue'
import { EMAIL_EDITOR_CONFIG_KEY } from '../../../injection-keys'

function makeEditor(insertContent = vi.fn()) {
  return {
    isActive: () => false,
    getText: () => 'Cliquez ici',
    chain: () => ({
      focus: () => ({
        insertContent: (value: string) => ({
          run: () => insertContent(value),
        }),
      }),
    }),
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

  it('shows a follow-up hint instead of inserting AI clarification text', async () => {
    const insertContent = vi.fn()
    const wrapper = mount(InlineToolbar, {
      props: {
        editor: makeEditor(insertContent) as any,
      },
      global: {
        provide: {
          [EMAIL_EDITOR_CONFIG_KEY as symbol]: {
            variables: ref([]),
            aiProvider: {
              generateText: async () => '<think>Need source copy.</think>请提供需要改为中文的原始文案。',
            },
          },
        },
        stubs: {
          EIcon: { template: '<span />' },
        },
      },
    })

    await wrapper.get('.ebb-inline-toolbar__btn--ai').trigger('click')
    await wrapper.get('.ebb-ai-menu__item').trigger('click')
    await wrapper.get('.ebb-ai-menu__prompt-input').setValue('改为中文文案')
    await wrapper.get('.ebb-ai-menu__prompt-btn').trigger('click')
    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(insertContent).not.toHaveBeenCalled()
    expect(wrapper.get('.ebb-ai-menu__followup').text()).toContain('请提供需要改为中文的原始文案')
    expect(wrapper.text()).not.toContain('<think>')
    expect(wrapper.find('.ebb-ai-menu__prompt-input').exists()).toBe(true)
  })
})
