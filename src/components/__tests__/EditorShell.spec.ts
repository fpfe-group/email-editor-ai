import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import EditorShell from '../EditorShell.vue'
import { EMAIL_DOCUMENT_KEY } from '../../injection-keys'
import { createDefaultDocument } from '../../serializer/node-factory'

vi.mock('mjml-browser', () => ({
  default: (mjml: string) => ({
    html: `<html>${mjml}</html>`,
    errors: mjml.includes('padding="0 12px 12px"')
      ? [{ line: 3, message: 'Attribute padding has invalid value' }]
      : [],
  }),
}))

function mountEditorShell() {
  const document = ref(createDefaultDocument())
  const replaceDocument = vi.fn((newDocument) => {
    document.value = newDocument
  })
  const triggerEmit = vi.fn().mockResolvedValue(undefined)

  const wrapper = mount(EditorShell, {
    global: {
      provide: {
        [EMAIL_DOCUMENT_KEY as symbol]: {
          document,
          replaceDocument,
          triggerEmit,
        },
      },
      stubs: {
        EditorToolbar: {
          emits: ['import-mjml'],
          template: '<button class="open-import" @click="$emit(\'import-mjml\')">open</button>',
        },
        EditorCanvas: true,
        EditorSidebar: true,
        CodeEditor: true,
        EIcon: {
          props: ['name'],
          template: '<span class="icon">{{ name }}</span>',
        },
      },
    },
  })

  return { wrapper, replaceDocument, triggerEmit }
}

describe('EditorShell', () => {
  it('imports MJML and renders it through the document pipeline', async () => {
    const { wrapper, replaceDocument, triggerEmit } = mountEditorShell()

    await wrapper.get('.open-import').trigger('click')
    await wrapper.get('.ebb-import-mjml__textarea').setValue(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>Hello from MJML</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`)
    await wrapper.get('.ebb-import-mjml__btn--primary').trigger('click')
    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(replaceDocument).toHaveBeenCalledTimes(1)
    expect(replaceDocument.mock.calls[0][0].body.children[0].children[0].children[0].htmlContent).toBe('Hello from MJML')
    expect(triggerEmit).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.ebb-import-mjml').exists()).toBe(false)
  })

  it('imports MJML when the compiler returns HTML with non-fatal validation errors', async () => {
    const { wrapper, replaceDocument, triggerEmit } = mountEditorShell()

    await wrapper.get('.open-import').trigger('click')
    await wrapper.get('.ebb-import-mjml__textarea').setValue(`
<mjml>
  <mj-body>
    <mj-section padding="0 12px 12px">
      <mj-column>
        <mj-text>Loose padding value</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`)
    await wrapper.get('.ebb-import-mjml__btn--primary').trigger('click')
    await new Promise((resolve) => window.setTimeout(resolve, 0))

    expect(replaceDocument).toHaveBeenCalledTimes(1)
    expect(triggerEmit).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.ebb-import-mjml__error').exists()).toBe(false)
    expect(wrapper.find('.ebb-import-mjml').exists()).toBe(false)
  })
})
