import { mount } from '@vue/test-utils'
import { computed, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import CanvasOverlay from '../CanvasOverlay.vue'
import { EMAIL_DOCUMENT_KEY, EMAIL_DRAG_DROP_KEY, EMAIL_SELECTION_KEY } from '../../../injection-keys'
import type { EmailDocument } from '../../../types'

const document = ref<EmailDocument>({
  version: 1,
  headAttributes: {
    defaultStyles: {},
    fonts: [],
    previewText: '',
  },
  body: {
    id: 'body',
    type: 'mj-body',
    attributes: {},
    children: [
      {
        id: 'section-1',
        type: 'mj-section',
        attributes: {},
        children: [
          {
            id: 'column-1',
            type: 'mj-column',
            attributes: {},
            children: [],
          },
        ],
      },
    ],
  },
})

function mountCanvasOverlay(
  selectedNodeId: string,
  selectedNodePath: string[],
  selectedRect = new DOMRect(0, 0, 320, 120),
) {
  return mount(CanvasOverlay, {
    props: {
      selectedRect,
      hoveredRect: null,
      selectedNodeId,
      hoveredNodeId: null,
      dropIndicatorRect: null,
      dropIndicatorPosition: 'after',
      isDragging: false,
    },
    global: {
      provide: {
        [EMAIL_DOCUMENT_KEY as symbol]: {
          document,
          deleteNode: vi.fn(),
          duplicateNode: vi.fn(),
          moveNodeUp: vi.fn(),
          moveNodeDown: vi.fn(),
          updateNodeCondition: vi.fn(),
        },
        [EMAIL_SELECTION_KEY as symbol]: {
          selectedNodeId: ref(selectedNodeId),
          hoveredNodeId: ref(null),
          selectedNodePath: computed(() => selectedNodePath),
          selectParent: vi.fn(),
          clearSelection: vi.fn(),
        },
        [EMAIL_DRAG_DROP_KEY as symbol]: {
          isDragging: ref(false),
          startDrag: vi.fn(),
          endDrag: vi.fn(),
        },
      },
      stubs: {
        EIcon: { template: '<span />' },
      },
    },
  })
}

describe('CanvasOverlay', () => {
  it('shows the toolbar for top-level sections', () => {
    const wrapper = mountCanvasOverlay('section-1', ['body', 'section-1'])

    expect(wrapper.find('.ebb-overlay__selection').exists()).toBe(true)
    expect(wrapper.find('.ebb-overlay__toolbar').exists()).toBe(true)
  })

  it('keeps the toolbar inside the overlay when the selected node starts at the top', () => {
    const wrapper = mountCanvasOverlay('section-1', ['body', 'section-1'])

    expect(wrapper.find('.ebb-overlay__toolbar').attributes('style')).toContain('top: 4px')
  })

  it('places the toolbar above the selected node when there is enough space', () => {
    const wrapper = mountCanvasOverlay(
      'section-1',
      ['body', 'section-1'],
      new DOMRect(0, 40, 320, 120),
    )

    expect(wrapper.find('.ebb-overlay__toolbar').attributes('style')).toContain('top: -28px')
  })

  it('shows the toolbar for nested nodes', () => {
    const wrapper = mountCanvasOverlay('column-1', ['body', 'section-1', 'column-1'])

    expect(wrapper.find('.ebb-overlay__selection').exists()).toBe(true)
    expect(wrapper.find('.ebb-overlay__toolbar').exists()).toBe(true)
  })

  it('hides the toolbar for the root body node', () => {
    const wrapper = mountCanvasOverlay('body', ['body'])

    expect(wrapper.find('.ebb-overlay__selection').exists()).toBe(true)
    expect(wrapper.find('.ebb-overlay__toolbar').exists()).toBe(false)
  })
})
