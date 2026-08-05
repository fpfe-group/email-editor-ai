import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TemplatesPanel from '../TemplatesPanel.vue'
import { EMAIL_DOCUMENT_KEY } from '../../../injection-keys'

function mountTemplatesPanel() {
  return mount(TemplatesPanel, {
    attachTo: document.body,
    global: {
      provide: {
        [EMAIL_DOCUMENT_KEY as symbol]: {
          replaceDocument: vi.fn(),
        },
      },
      stubs: {
        EIcon: { template: '<span />' },
      },
    },
  })
}

describe('TemplatesPanel', () => {
  it('shows Chinese copy in the template apply confirmation dialog', async () => {
    const wrapper = mountTemplatesPanel()

    await wrapper.get('.ebb-template-card').trigger('click')

    expect(document.body.textContent).toContain('选择模板，快速开始设计。')
    expect(document.body.textContent).toContain('应用「')
    expect(document.body.textContent).toContain('」？')
    expect(document.body.textContent).toContain('当前邮件内容将被此模板完全替换，此操作不可撤销。')
    expect(document.body.textContent).toContain('取消')
    expect(document.body.textContent).toContain('应用')

    wrapper.unmount()
  })
})
