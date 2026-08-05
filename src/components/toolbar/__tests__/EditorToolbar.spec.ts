import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import EditorToolbar from '../EditorToolbar.vue'
import { EMAIL_DOCUMENT_KEY } from '../../../injection-keys'
import { createDefaultDocument } from '../../../serializer/node-factory'

function mountEditorToolbar(options: {
  canSendTest?: boolean
  triggerEmit?: ReturnType<typeof vi.fn>
} = {}) {
  const document = ref(createDefaultDocument())
  const triggerEmit = options.triggerEmit ?? vi.fn()

  return mount(EditorToolbar, {
    props: {
      isFullscreen: false,
      activeView: 'visual',
      activeDeviceIndex: 0,
      isDarkPreview: false,
      canSendTest: options.canSendTest ?? false,
    },
    global: {
      provide: {
        [EMAIL_DOCUMENT_KEY as symbol]: {
          document,
          compiledHtml: ref('<html><body>Preview</body></html>'),
          history: {
            canUndo: ref(false),
            canRedo: ref(false),
            undo: vi.fn(),
            redo: vi.fn(),
          },
          triggerEmit,
        },
      },
      stubs: {
        EIcon: {
          props: ['name'],
          template: '<span class="icon">{{ name }}</span>',
        },
      },
    },
  })
}

describe('EditorToolbar', () => {
  it('hides the send test entry when send test is disabled', () => {
    const wrapper = mountEditorToolbar()

    expect(wrapper.find('.ebb-toolbar__send-test-btn').exists()).toBe(false)
  })

  it('emits send-test with the current HTML', async () => {
    const triggerEmit = vi.fn().mockResolvedValue(undefined)
    const wrapper = mountEditorToolbar({ canSendTest: true, triggerEmit })

    await wrapper.get('.ebb-toolbar__send-test-btn').trigger('click')
    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(triggerEmit).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('send-test')).toEqual([['<html><body>Preview</body></html>']])
  })
})
