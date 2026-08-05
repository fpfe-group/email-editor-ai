import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InlineTextEditor from '../InlineTextEditor.vue'

describe('InlineTextEditor', () => {
  it('does not save normalized TipTap HTML when the content was not edited', async () => {
    const wrapper = mount(InlineTextEditor, {
      props: {
        content: '<p style="margin: 0; letter-spacing: 3px;">Newsletter — February 2026</p>',
        rect: new DOMRect(0, 48, 320, 32),
        nodeType: 'mj-text',
      },
      global: {
        stubs: {
          InlineToolbar: true,
        },
      },
    })

    await wrapper.get('.ebb-inline-editor__backdrop').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('save')).toBeUndefined()

    wrapper.unmount()
    await new Promise((resolve) => window.setTimeout(resolve, 0))
  })

  it('saves button AI edits as inline content without TipTap paragraph wrappers', async () => {
    const wrapper = mount(InlineTextEditor, {
      props: {
        content: 'Cliquez ici',
        rect: new DOMRect(0, 48, 128, 44),
        nodeType: 'mj-button',
      },
      global: {
        stubs: {
          InlineToolbar: true,
        },
      },
    })

    const editor = (
      wrapper.vm as unknown as {
        editor: { commands: { setContent: (value: string) => void } }
      }
    ).editor
    editor.commands.setContent('点击这里')

    await wrapper.get('.ebb-inline-editor__backdrop').trigger('click')

    expect(wrapper.emitted('save')?.[0]).toEqual(['点击这里'])

    wrapper.unmount()
    await new Promise((resolve) => window.setTimeout(resolve, 0))
  })
})
