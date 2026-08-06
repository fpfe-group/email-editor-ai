import { mount } from '@vue/test-utils'
import { computed, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import EditorCanvas from '../EditorCanvas.vue'
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
    children: [],
  },
})

function mountEditorCanvas(clearSelection = vi.fn(), compiledHtml = '') {
  return mount(EditorCanvas, {
    props: {
      canvasWidth: 600,
    },
    global: {
      provide: {
        [EMAIL_DOCUMENT_KEY as symbol]: {
          document,
          compiledHtml: ref(compiledHtml),
          isCompiling: ref(false),
          deleteNode: vi.fn(),
          duplicateNode: vi.fn(),
          moveNodeUp: vi.fn(),
          moveNodeDown: vi.fn(),
          insertNode: vi.fn(),
          insertNodesAfter: vi.fn(),
          moveNodeTo: vi.fn(),
          updateNodeContent: vi.fn(),
        },
        [EMAIL_SELECTION_KEY as symbol]: {
          selectedNodeId: ref('text-1'),
          hoveredNodeId: ref(null),
          selectedNode: computed(() => null),
          selectedNodePath: computed(() => []),
          selectNode: vi.fn(),
          selectParent: vi.fn(),
          hoverNode: vi.fn(),
          clearSelection,
        },
        [EMAIL_DRAG_DROP_KEY as symbol]: {
          isDragging: ref(false),
          dragSource: ref(null),
          dropTarget: ref(null),
          startDrag: vi.fn(),
          updateDropTarget: vi.fn(),
          endDrag: vi.fn(),
        },
      },
      stubs: {
        CanvasOverlay: true,
        InlineTextEditor: true,
      },
    },
  })
}

describe('EditorCanvas', () => {
  it('clears the selected node when clicking the canvas background', async () => {
    const clearSelection = vi.fn()
    const wrapper = mountEditorCanvas(clearSelection)

    await wrapper.get('.ebb-canvas').trigger('pointerdown')

    expect(clearSelection).toHaveBeenCalledTimes(1)
  })

  it('keeps selection when clicking inside the email preview wrapper', async () => {
    const clearSelection = vi.fn()
    const wrapper = mountEditorCanvas(clearSelection)

    await wrapper.get('.ebb-canvas__iframe-wrapper').trigger('pointerdown')

    expect(clearSelection).not.toHaveBeenCalled()
  })

  it('does not inject a fixed minimum height for columns', async () => {
    const wrapper = mountEditorCanvas(
      vi.fn(),
      '<!doctype html><html><head></head><body><div class="mj-column-per-100 ebb-node-column-1"></div></body></html>',
    )

    await nextTick()

    const iframe = wrapper.get('iframe').element as HTMLIFrameElement
    expect(iframe.srcdoc).not.toContain('min-height: 60px')
  })
})
