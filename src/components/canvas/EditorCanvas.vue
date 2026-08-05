<script setup lang="ts">
import { inject, watch, ref, onMounted, onBeforeUnmount, defineAsyncComponent, nextTick } from 'vue'
import { EMAIL_DOCUMENT_KEY, EMAIL_SELECTION_KEY, EMAIL_DRAG_DROP_KEY } from '../../injection-keys'
import { EMAIL_LABELS_KEY, DEFAULT_LABELS } from '../../labels'
import type { IframeMessage, DropPosition, EmailNode, EmailNodeType } from '../../types'
import { CONTENT_NODE_TYPES } from '../../types'
import { findNode, findParent } from '../../utils/tree'
import CanvasOverlay from './CanvasOverlay.vue'
import { refineToColumnHitTarget } from './hit-test'

// Lazy load TipTap-based inline editor — only loaded when user double-clicks to edit
const InlineTextEditor = defineAsyncComponent(() => import('./InlineTextEditor.vue'))

const props = withDefaults(defineProps<{
  canvasWidth?: number
  darkPreview?: boolean
}>(), {
  canvasWidth: 600,
  darkPreview: false,
})

const doc = inject(EMAIL_DOCUMENT_KEY)!
const selection = inject(EMAIL_SELECTION_KEY)!
const dragDrop = inject(EMAIL_DRAG_DROP_KEY)!
const labels = inject(EMAIL_LABELS_KEY, DEFAULT_LABELS)

const iframeRef = ref<HTMLIFrameElement | null>(null)
const canvasRef = ref<HTMLDivElement | null>(null)
const isReady = ref(false)

// Overlay state
const selectedRect = ref<DOMRect | null>(null)
const hoveredRect = ref<DOMRect | null>(null)
const dropIndicatorRect = ref<DOMRect | null>(null)
const dropIndicatorPosition = ref<DropPosition>('after')

// Iframe auto-height
const iframeHeight = ref<number | null>(null)

// Inline text editing state
const inlineEditNodeId = ref<string | null>(null)
const inlineEditContent = ref('')
const inlineEditRect = ref<DOMRect | null>(null)
const inlineEditNodeType = ref<EmailNodeType | null>(null)

interface HitTestResult {
  nodeId: string | null
  position?: DropPosition
  rect?: DOMRect | null
  isDrop: boolean
}

// ─── Iframe content management ───

function parseCompiledHtml(html: string): { headHtml: string; bodyHtml: string } {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  return {
    headHtml: parsed.head.innerHTML,
    bodyHtml: parsed.body.innerHTML || html,
  }
}

function updateIframe() {
  const iframe = iframeRef.value
  if (!iframe || !doc.compiledHtml.value) return
  const { headHtml, bodyHtml } = parseCompiledHtml(doc.compiledHtml.value)

  const darkModeStyles = props.darkPreview ? `
    /* Dark mode preview — simulate email client color remapping without dimming media. */
    body,
    #ebb-email-root {
      background-color: #111827 !important;
      color: #e5e7eb !important;
    }

    td[style*="background-color:#ffffff"], td[style*="background-color: #ffffff"],
    td[style*="background-color:#fff"], td[style*="background-color: #fff"],
    td[style*="background-color: rgb(255, 255, 255)"],
    table[style*="background-color:#ffffff"], table[style*="background-color: #ffffff"],
    table[style*="background-color:#fff"], table[style*="background-color: #fff"],
    table[style*="background-color: rgb(255, 255, 255)"],
    div[style*="background-color:#ffffff"], div[style*="background-color: #ffffff"],
    div[style*="background-color:#fff"], div[style*="background-color: #fff"],
    div[style*="background-color: rgb(255, 255, 255)"],
    td[style*="background:#ffffff"], td[style*="background: #ffffff"],
    td[style*="background:#fff"], td[style*="background: #fff"],
    table[style*="background:#ffffff"], table[style*="background: #ffffff"],
    table[style*="background:#fff"], table[style*="background: #fff"],
    div[style*="background:#ffffff"], div[style*="background: #ffffff"],
    div[style*="background:#fff"], div[style*="background: #fff"] {
      background-color: #1f2937 !important;
    }

    td[style*="background-color:#f9fafb"], td[style*="background-color: #f9fafb"],
    td[style*="background-color:#f8fafc"], td[style*="background-color: #f8fafc"],
    td[style*="background-color:#f7f7f7"], td[style*="background-color: #f7f7f7"],
    td[style*="background-color:#f3f4f6"], td[style*="background-color: #f3f4f6"],
    td[style*="background-color:#f0f0f0"], td[style*="background-color: #f0f0f0"],
    table[style*="background-color:#f9fafb"], table[style*="background-color: #f9fafb"],
    table[style*="background-color:#f8fafc"], table[style*="background-color: #f8fafc"],
    table[style*="background-color:#f7f7f7"], table[style*="background-color: #f7f7f7"],
    table[style*="background-color:#f3f4f6"], table[style*="background-color: #f3f4f6"],
    table[style*="background-color:#f0f0f0"], table[style*="background-color: #f0f0f0"],
    div[style*="background-color:#f9fafb"], div[style*="background-color: #f9fafb"],
    div[style*="background-color:#f8fafc"], div[style*="background-color: #f8fafc"],
    div[style*="background-color:#f7f7f7"], div[style*="background-color: #f7f7f7"],
    div[style*="background-color:#f3f4f6"], div[style*="background-color: #f3f4f6"],
    div[style*="background-color:#f0f0f0"], div[style*="background-color: #f0f0f0"] {
      background-color: #273244 !important;
    }

    td[style*="color:#000"], td[style*="color: #000"],
    td[style*="color:#111827"], td[style*="color: #111827"],
    td[style*="color:#1f2937"], td[style*="color: #1f2937"],
    td[style*="color:#374151"], td[style*="color: #374151"],
    td[style*="color:#4b5563"], td[style*="color: #4b5563"],
    td[style*="color:#333"], td[style*="color: #333"],
    td[style*="color:#333333"], td[style*="color: #333333"],
    td[style*="color: rgb(0, 0, 0)"],
    div[style*="color:#000"], div[style*="color: #000"],
    div[style*="color:#111827"], div[style*="color: #111827"],
    div[style*="color:#1f2937"], div[style*="color: #1f2937"],
    div[style*="color:#374151"], div[style*="color: #374151"],
    div[style*="color:#4b5563"], div[style*="color: #4b5563"],
    div[style*="color:#333"], div[style*="color: #333"],
    div[style*="color:#333333"], div[style*="color: #333333"],
    div[style*="color: rgb(0, 0, 0)"],
    p[style*="color:#000"], p[style*="color: #000"],
    p[style*="color:#111827"], p[style*="color: #111827"],
    p[style*="color:#1f2937"], p[style*="color: #1f2937"],
    p[style*="color:#374151"], p[style*="color: #374151"],
    p[style*="color:#4b5563"], p[style*="color: #4b5563"],
    span[style*="color:#000"], span[style*="color: #000"],
    span[style*="color:#111827"], span[style*="color: #111827"],
    span[style*="color:#1f2937"], span[style*="color: #1f2937"],
    span[style*="color:#374151"], span[style*="color: #374151"],
    span[style*="color:#4b5563"], span[style*="color: #4b5563"] {
      color: #e5e7eb !important;
    }

    td[style*="color:#6b7280"], td[style*="color: #6b7280"],
    td[style*="color:#64748b"], td[style*="color: #64748b"],
    td[style*="color:#94a3b8"], td[style*="color: #94a3b8"],
    div[style*="color:#6b7280"], div[style*="color: #6b7280"],
    div[style*="color:#64748b"], div[style*="color: #64748b"],
    div[style*="color:#94a3b8"], div[style*="color: #94a3b8"],
    p[style*="color:#6b7280"], p[style*="color: #6b7280"],
    p[style*="color:#64748b"], p[style*="color: #64748b"],
    p[style*="color:#94a3b8"], p[style*="color: #94a3b8"],
    span[style*="color:#6b7280"], span[style*="color: #6b7280"],
    span[style*="color:#64748b"], span[style*="color: #64748b"],
    span[style*="color:#94a3b8"], span[style*="color: #94a3b8"] {
      color: #cbd5e1 !important;
    }

    a { color: #93c5fd !important; }
    img { opacity: 1 !important; }
  ` : ''

  const html = `<!DOCTYPE html>
<html${props.darkPreview ? ' data-dark-preview' : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${headHtml}
  <style>
    body { margin: 0; padding: 0; }
    [data-node-id] { cursor: pointer; transition: outline 0.1s ease; }
    [data-node-id]:hover { outline: 1px dashed rgba(1, 168, 171, 0.4); outline-offset: -1px; }
    /* Editor mode: give empty columns a minimum drop target area */
    div[class*="mj-column-"] { min-height: 60px; }
    ${darkModeStyles}
  </style>
</head>
<body>
  <div id="ebb-email-root">${bodyHtml}</div>
  <script>
  (function() {
    var emailRoot = document.getElementById('ebb-email-root');

    // Annotate nodes: find elements with ebb-node-* class and set data-node-id
    // Then propagate data-node-id DOWN into child elements (table, tbody, tr, td, div)
    // so that elementFromPoint on empty areas inside columns resolves correctly.
    document.querySelectorAll('[class]').forEach(function(el) {
      var classes = (el.className.baseVal || el.className || '').toString().split(/\\s+/);
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].indexOf('ebb-node-') === 0) {
          var nodeId = classes[i].replace('ebb-node-', '');
          el.dataset.nodeId = nodeId;
          break;
        }
      }
    });

    // Propagate downward: for each annotated node, mark its direct structural
    // children (table, tbody, tr, td, div) that don't already have a node-id.
    function propagateDown(el, nodeId) {
      for (var i = 0; i < el.children.length; i++) {
        var child = el.children[i];
        if (child.dataset.nodeId) continue; // stop at next annotated node
        var tag = child.tagName.toLowerCase();
        if (tag === 'table' || tag === 'tbody' || tag === 'tr' || tag === 'td' || tag === 'div') {
          child.dataset.nodeId = nodeId;
          propagateDown(child, nodeId);
        }
      }
    }
    document.querySelectorAll('[data-node-id]').forEach(function(el) {
      propagateDown(el, el.dataset.nodeId);
    });

    function getNodeId(el) {
      while (el && el !== document.body) {
        if (el.dataset && el.dataset.nodeId) return el.dataset.nodeId;
        el = el.parentElement;
      }
      return null;
    }

    function getNodeElement(el) {
      while (el && el !== document.body) {
        if (el.dataset && el.dataset.nodeId) return el;
        el = el.parentElement;
      }
      return null;
    }

    document.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var nodeId = getNodeId(e.target);
      if (nodeId) {
        var el = getNodeElement(e.target);
        // Refine section clicks to the specific column
        if (el) {
          var colChildren = el.querySelectorAll('div[class*="mj-column-"][data-node-id]');
          if (colChildren.length > 0) {
            el = refineToColumn(el, e.clientX);
            nodeId = el.dataset.nodeId;
          }
        }
        window.parent.postMessage({ type: 'ebb:select', nodeId: nodeId, rect: el ? el.getBoundingClientRect() : null }, '*');
      } else {
        window.parent.postMessage({ type: 'ebb:deselect' }, '*');
      }
    });

    document.addEventListener('dblclick', function(e) {
      e.preventDefault();
      var nodeId = getNodeId(e.target);
      if (nodeId) {
        var el = getNodeElement(e.target);
        window.parent.postMessage({ type: 'ebb:dblclick', nodeId: nodeId, rect: el ? el.getBoundingClientRect() : null }, '*');
      }
    });

    var lastHovered = null;
    document.addEventListener('mouseover', function(e) {
      var nodeId = getNodeId(e.target);
      if (nodeId && nodeId !== lastHovered) {
        lastHovered = nodeId;
        var el = getNodeElement(e.target);
        window.parent.postMessage({ type: 'ebb:hover', nodeId: nodeId, rect: el ? el.getBoundingClientRect() : null }, '*');
      }
    });

    document.addEventListener('mouseout', function(e) {
      var nodeId = e.relatedTarget ? getNodeId(e.relatedTarget) : null;
      if (!nodeId) {
        lastHovered = null;
        window.parent.postMessage({ type: 'ebb:hover-end' }, '*');
      }
    });

    // Given an element resolved by hit-test, try to find a more specific
    // child column if the hit is on a section's inner td.
    function refineToColumn(nodeEl, x) {
      // Find all direct child column divs inside this element's subtree
      var cols = nodeEl.querySelectorAll('div[class*="mj-column-"]');
      if (cols.length === 0) return nodeEl;
      // Find which column contains x
      for (var i = 0; i < cols.length; i++) {
        var colRect = cols[i].getBoundingClientRect();
        if (x >= colRect.left && x <= colRect.right) {
          return cols[i];
        }
      }
      return nodeEl;
    }

    // Handle query-rect requests from parent (for breadcrumb navigation)
    window.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'ebb:query-rect') {
        var qNodeId = e.data.nodeId;
        var el = qNodeId ? document.querySelector('[data-node-id="' + qNodeId + '"]') : null;
        if (el) {
          var r = el.getBoundingClientRect();
          window.parent.postMessage({ type: 'ebb:query-rect-result', nodeId: qNodeId, rect: { top: r.top, left: r.left, width: r.width, height: r.height } }, '*');
        } else {
          window.parent.postMessage({ type: 'ebb:query-rect-result', nodeId: qNodeId, rect: null }, '*');
        }
        return;
      }
      if (e.data && e.data.type === 'ebb:hit-test') {
        var x = e.data.x;
        var y = e.data.y;
        var el = document.elementFromPoint(x, y);
        if (el) {
          var nodeEl = getNodeElement(el);
          if (nodeEl) {
            // If the resolved node is a section (contains columns), refine to specific column
            var columnChildren = nodeEl.querySelectorAll('div[class*="mj-column-"][data-node-id]');
            if (columnChildren.length > 0) {
              nodeEl = refineToColumn(nodeEl, x);
            }
            var rect = nodeEl.getBoundingClientRect();
            var midY = rect.top + rect.height / 2;
            var position = y < midY ? 'before' : 'after';
            window.parent.postMessage({
              type: 'ebb:hit-test-result',
              nodeId: nodeEl.dataset.nodeId,
              position: position,
              rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              isDrop: e.data.isDrop || false
            }, '*');
          } else {
            window.parent.postMessage({ type: 'ebb:hit-test-result', nodeId: null, isDrop: e.data.isDrop || false }, '*');
          }
        }
      }
    });

    // Report content height to parent for auto-sizing
    function reportHeight() {
      var h = emailRoot
        ? Math.ceil(emailRoot.getBoundingClientRect().height)
        : (document.body.scrollHeight || document.documentElement.scrollHeight);
      window.parent.postMessage({ type: 'ebb:height', height: h }, '*');
    }
    reportHeight();
    new MutationObserver(reportHeight).observe(document.body, { childList: true, subtree: true, attributes: true });
    if (window.ResizeObserver && emailRoot) {
      new ResizeObserver(reportHeight).observe(emailRoot);
    }
    window.addEventListener('resize', reportHeight);

    window.parent.postMessage({ type: 'ebb:ready' }, '*');
  })();
  <\/script>
</body>
</html>`

  iframe.srcdoc = html
}

function measureIframeContentHeight(): number | null {
  const emailRoot = iframeRef.value?.contentDocument?.getElementById('ebb-email-root')
  if (!emailRoot) return null

  return Math.ceil(emailRoot.getBoundingClientRect().height)
}

function refreshIframeHeight() {
  const height = measureIframeContentHeight()
  if (height) {
    iframeHeight.value = height
  }
}

// ─── postMessage handler ───

function handleMessage(e: MessageEvent) {
  const msg = e.data as IframeMessage
  if (!msg || typeof msg.type !== 'string' || !msg.type.startsWith('ebb:')) return

  switch (msg.type) {
    case 'ebb:ready':
      isReady.value = true
      break
    case 'ebb:height':
      iframeHeight.value = msg.height
      break
    case 'ebb:select':
      selection.selectNode(msg.nodeId)
      selectedRect.value = msg.rect
      break
    case 'ebb:deselect':
      selection.clearSelection()
      selectedRect.value = null
      break
    case 'ebb:hover':
      selection.hoverNode(msg.nodeId)
      hoveredRect.value = msg.rect
      break
    case 'ebb:hover-end':
      selection.hoverNode(null)
      hoveredRect.value = null
      break
    case 'ebb:dblclick':
      openInlineEditor(msg.nodeId, msg.rect)
      break
    case 'ebb:query-rect-result':
      if (msg.nodeId === selection.selectedNodeId.value) {
        selectedRect.value = msg.rect
      }
      break
    case 'ebb:hit-test-result':
      handleHitTestResult(msg)
      break
  }
}

/** Process hit-test results from iframe */
function handleHitTestResult(msg: HitTestResult) {
  if (!dragDrop.isDragging.value) return

  if (msg.isDrop) {
    // This is a drop action
    if (msg.nodeId && dragDrop.dragSource.value) {
      handleDrop(msg.nodeId, msg.position ?? 'after')
    }
    dropIndicatorRect.value = null
    dragDrop.endDrag()
  } else {
    // This is a dragover — update indicator
    if (msg.nodeId && msg.rect) {
      const position = msg.position ?? 'after'
      dragDrop.updateDropTarget({ nodeId: msg.nodeId, position })
      dropIndicatorRect.value = msg.rect
      dropIndicatorPosition.value = position
    } else {
      dropIndicatorRect.value = null
      dragDrop.updateDropTarget(null)
    }
  }
}

// ─── Drop handling ───

function handleDrop(targetNodeId: string, position: DropPosition) {
  const source = dragDrop.dragSource.value
  if (!source) return

  if (source.type === 'new-block') {
    const result = source.block.factory()
    const nodes: EmailNode[] = Array.isArray(result) ? result : [result]
    insertNodesAtTarget(nodes, targetNodeId, position)
  } else if (source.type === 'existing-node') {
    moveExistingNode(source.nodeId, targetNodeId, position)
  }
}

function insertNodesAtTarget(nodes: EmailNode[], targetNodeId: string, position: DropPosition) {
  const targetNode = findNode(doc.document.value.body, targetNodeId)
  if (!targetNode) return

  const SECTION_TYPES = ['mj-section', 'mj-wrapper', 'mj-hero']
  const isSectionLevelInsert = nodes.some((n) => SECTION_TYPES.includes(n.type))
  const isTargetSectionLevel = SECTION_TYPES.includes(targetNode.type)
  const isTargetColumn = targetNode.type === 'mj-column'
  const isTargetBody = targetNode.type === 'mj-body'

  // ── Case 1: Inserting section-level nodes ──
  if (isSectionLevelInsert) {
    // Find the nearest section-level ancestor to insert relative to
    let refNodeId = targetNodeId
    if (!isTargetSectionLevel && !isTargetBody) {
      const body = doc.document.value.body
      let current = findParent(body, targetNodeId)
      while (current && current.id !== body.id && !SECTION_TYPES.includes(current.type)) {
        current = findParent(body, current.id)
      }
      if (current && current.id !== body.id) {
        refNodeId = current.id
      } else {
        for (const node of nodes) {
          doc.insertNode(body.id, body.children.length, node)
        }
        return
      }
    }
    if (isTargetBody) {
      for (const node of nodes) {
        doc.insertNode(targetNodeId, targetNode.children.length, node)
      }
      return
    }
    const parent = findParent(doc.document.value.body, refNodeId)
    if (!parent) return
    const idx = parent.children.findIndex((c) => c.id === refNodeId)
    const insertIdx = position === 'before' ? idx : idx + 1
    for (let i = 0; i < nodes.length; i++) {
      doc.insertNode(parent.id, insertIdx + i, nodes[i])
    }
    return
  }

  // ── Case 2: Inserting content nodes into a section → route to first column ──
  if (isTargetSectionLevel) {
    const firstColumn = targetNode.children.find((c) => c.type === 'mj-column')
    if (firstColumn) {
      for (const node of nodes) {
        doc.insertNode(firstColumn.id, firstColumn.children.length, node)
      }
    }
    return
  }

  // ── Case 3: Inserting content nodes into a column → append inside ──
  if (isTargetColumn) {
    for (const node of nodes) {
      doc.insertNode(targetNodeId, targetNode.children.length, node)
    }
    return
  }

  // ── Case 4: Inserting content nodes into mj-body → wrap in section+column ──
  if (isTargetBody) {
    // Should not normally happen, but handle gracefully
    return
  }

  // ── Case 5: Inserting content relative to another content node ──
  // The target is a content node inside a column — insert as sibling
  const parent = findParent(doc.document.value.body, targetNodeId)
  if (!parent) return

  // If parent is a column, insert relative to the target
  const idx = parent.children.findIndex((c) => c.id === targetNodeId)
  const insertIdx = position === 'before' ? idx : idx + 1
  for (let i = 0; i < nodes.length; i++) {
    doc.insertNode(parent.id, insertIdx + i, nodes[i])
  }
}

function moveExistingNode(nodeId: string, targetNodeId: string, position: DropPosition) {
  const targetNode = findNode(doc.document.value.body, targetNodeId)
  if (!targetNode) return
  if (nodeId === targetNodeId) return // can't drop on self

  const movingNode = findNode(doc.document.value.body, nodeId)
  if (!movingNode) return

  const SECTION_TYPES = ['mj-section', 'mj-wrapper', 'mj-hero']
  const isMovingSection = SECTION_TYPES.includes(movingNode.type)

  // Moving a section: place relative to nearest section
  if (isMovingSection) {
    let refNodeId = targetNodeId
    if (!SECTION_TYPES.includes(targetNode.type)) {
      const body = doc.document.value.body
      let current = findParent(body, targetNodeId)
      while (current && current.id !== body.id && !SECTION_TYPES.includes(current.type)) {
        current = findParent(body, current.id)
      }
      refNodeId = current && current.id !== body.id ? current.id : body.id
    }
    const parent = findParent(doc.document.value.body, refNodeId)
    if (!parent) return
    const idx = parent.children.findIndex((c) => c.id === refNodeId)
    const insertIdx = getAdjustedMoveIndex(nodeId, parent, position === 'before' ? idx : idx + 1)
    doc.moveNodeTo(nodeId, parent.id, insertIdx)
    return
  }

  // Moving content into section → route to first column
  if (SECTION_TYPES.includes(targetNode.type)) {
    const firstColumn = targetNode.children.find((c) => c.type === 'mj-column')
    if (firstColumn) {
      doc.moveNodeTo(nodeId, firstColumn.id, firstColumn.children.length)
    }
    return
  }

  // Moving content into column → append
  if (targetNode.type === 'mj-column') {
    doc.moveNodeTo(nodeId, targetNodeId, targetNode.children.length)
    return
  }

  // Moving content relative to another content node
  const parent = findParent(doc.document.value.body, targetNodeId)
  if (!parent) return
  const idx = parent.children.findIndex((c) => c.id === targetNodeId)
  const insertIdx = getAdjustedMoveIndex(nodeId, parent, position === 'before' ? idx : idx + 1)
  doc.moveNodeTo(nodeId, parent.id, insertIdx)
}

function getAdjustedMoveIndex(nodeId: string, newParent: EmailNode, insertIdx: number): number {
  const oldParent = findParent(doc.document.value.body, nodeId)
  if (oldParent?.id !== newParent.id) return insertIdx

  const oldIdx = oldParent.children.findIndex((child) => child.id === nodeId)
  if (oldIdx !== -1 && oldIdx < insertIdx) {
    return insertIdx - 1
  }
  return insertIdx
}

// ─── Inline text editing ───

function openInlineEditor(nodeId: string, rect: DOMRect) {
  const node = findNode(doc.document.value.body, nodeId)
  if (!node || !CONTENT_NODE_TYPES.includes(node.type)) return
  inlineEditNodeId.value = nodeId
  inlineEditContent.value = node.htmlContent || ''
  inlineEditRect.value = rect
  inlineEditNodeType.value = node.type
}

function onInlineSave(html: string) {
  if (inlineEditNodeId.value) {
    doc.updateNodeContent(inlineEditNodeId.value, html)
  }
}

function onInlineClose() {
  inlineEditNodeId.value = null
  inlineEditContent.value = ''
  inlineEditRect.value = null
  inlineEditNodeType.value = null
}

// ─── Canvas-level drag events ───
// Drag events from the sidebar land on the drag overlay (not the iframe).
// Dragover keeps the original iframe bridge path so the drop indicator updates
// continuously. Drop uses that cached target so the final move matches the
// visible indicator before dragend clears the source.

function sendHitTest(e: DragEvent, isDrop: boolean) {
  const iframe = iframeRef.value
  if (!iframe || !iframe.contentWindow) return

  const iframeRect = iframe.getBoundingClientRect()
  const x = e.clientX - iframeRect.left
  const y = e.clientY - iframeRect.top

  iframe.contentWindow.postMessage({ type: 'ebb:hit-test', x, y, isDrop }, '*')
}

function getNodeElement(el: Element | null): HTMLElement | null {
  let current: Element | null = el
  const iframeDocument = iframeRef.value?.contentDocument
  while (current && current !== iframeDocument?.body) {
    if (current instanceof HTMLElement && current.dataset.nodeId) return current
    current = current.parentElement
  }
  return null
}

function getOverlayHitTest(e: DragEvent, isDrop: boolean): HitTestResult | null {
  const iframe = iframeRef.value
  const iframeDocument = iframe?.contentDocument
  if (!iframe || !iframeDocument) return null

  const iframeRect = iframe.getBoundingClientRect()
  const x = e.clientX - iframeRect.left
  const y = e.clientY - iframeRect.top
  const hitElement = iframeDocument.elementFromPoint(x, y)
  let nodeElement = getNodeElement(hitElement)

  if (!nodeElement) {
    return { nodeId: null, position: 'after', rect: null, isDrop }
  }

  if (nodeElement.querySelector('div[class*="mj-column-"][data-node-id]')) {
    nodeElement = refineToColumnHitTarget(nodeElement, x)
  }

  const rect = nodeElement.getBoundingClientRect()
  return {
    nodeId: nodeElement.dataset.nodeId ?? null,
    position: y < rect.top + rect.height / 2 ? 'before' : 'after',
    rect,
    isDrop,
  }
}

function onOverlayDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = dragDrop.dragSource.value?.type === 'existing-node' ? 'move' : 'copy'
  }
  sendHitTest(e, false)
}

function onOverlayDrop(e: DragEvent) {
  e.preventDefault()
  const target = dragDrop.dropTarget.value
  if (target) {
    handleHitTestResult({ ...target, isDrop: true })
    return
  }

  const result = getOverlayHitTest(e, true)
  if (result) {
    handleHitTestResult(result)
  } else {
    sendHitTest(e, true)
  }
}

function onOverlayDragLeave(e: DragEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (!canvasRef.value?.contains(related)) {
    dropIndicatorRect.value = null
    dragDrop.updateDropTarget(null)
  }
}

function clearCanvasSelection() {
  selection.clearSelection()
  selectedRect.value = null
  hoveredRect.value = null
}

function onCanvasPointerDown(e: PointerEvent) {
  if (e.target !== canvasRef.value) return
  clearCanvasSelection()
}

// ─── Watchers ───

// When selectedNodeId changes (e.g. via breadcrumb), ask iframe for the new rect
watch(() => selection.selectedNodeId.value, (nodeId) => {
  const iframe = iframeRef.value
  if (!iframe?.contentWindow || !isReady.value) return
  if (nodeId) {
    iframe.contentWindow.postMessage({ type: 'ebb:query-rect', nodeId }, '*')
  } else {
    selectedRect.value = null
  }
})

watch(() => doc.compiledHtml.value, () => {
  updateIframe()
}, { flush: 'post' })

watch(() => props.darkPreview, () => {
  updateIframe()
})

watch(() => props.canvasWidth, () => {
  iframeHeight.value = null
  selectedRect.value = null
  hoveredRect.value = null
  dropIndicatorRect.value = null
  nextTick(() => {
    refreshIframeHeight()
    window.setTimeout(refreshIframeHeight, 350)
  })
})

onMounted(() => {
  window.addEventListener('message', handleMessage)
  if (doc.compiledHtml.value) {
    updateIframe()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div
    ref="canvasRef"
    id="ebb-canvas-region"
    class="ebb-canvas"
    :class="{ 'ebb-canvas--inline-editing': !!inlineEditRect }"
    role="region"
    aria-label="Email canvas"
    @pointerdown="onCanvasPointerDown"
  >
    <!-- Loading overlay -->
    <div v-if="doc.isCompiling.value && !doc.compiledHtml.value" class="ebb-canvas__loading" role="status" aria-live="polite">
      <div class="ebb-canvas__spinner"></div>
      <span>{{ labels.loading }}</span>
    </div>

    <!-- Iframe wrapper: iframe + overlays share the same coordinate space -->
    <div
      class="ebb-canvas__iframe-wrapper"
      :class="{ 'ebb-canvas__iframe-wrapper--editing': !!inlineEditRect }"
      :style="{ width: canvasWidth + 'px', height: iframeHeight ? iframeHeight + 'px' : undefined }"
    >
      <iframe
        ref="iframeRef"
        class="ebb-canvas__iframe"
        sandbox="allow-scripts allow-same-origin"
        title="Email Preview"
      ></iframe>

      <!-- Transparent drag overlay — shown during drag to intercept events above iframe -->
      <div
        v-if="dragDrop.isDragging.value"
        class="ebb-canvas__drag-overlay"
        @dragover="onOverlayDragOver"
        @drop="onOverlayDrop"
        @dragleave="onOverlayDragLeave"
      ></div>

      <!-- Inline text editor overlay -->
      <InlineTextEditor
        v-if="inlineEditNodeId && inlineEditRect && inlineEditNodeType"
        :content="inlineEditContent"
        :rect="inlineEditRect"
        :node-type="inlineEditNodeType"
        @save="onInlineSave"
        @close="onInlineClose"
      />

      <!-- Selection/Hover/Drop overlay -->
      <CanvasOverlay
        :selected-rect="selectedRect"
        :hovered-rect="hoveredRect"
        :selected-node-id="selection.selectedNodeId.value"
        :hovered-node-id="selection.hoveredNodeId.value"
        :drop-indicator-rect="dropIndicatorRect"
        :drop-indicator-position="dropIndicatorPosition"
        :is-dragging="dragDrop.isDragging.value"
      />
    </div>
  </div>
</template>

<style>
.ebb-canvas {
  flex: 1;
  position: relative;
  background: #e5e7eb;
  background-image:
    radial-gradient(circle, #d1d5db 0.5px, transparent 0.5px);
  background-size: 16px 16px;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.ebb-canvas--inline-editing {
  padding-bottom: calc(24px + 260px);
}

html[data-theme='dark'] .ebb-canvas {
  background-color: #1a1f2e;
  background-image:
    radial-gradient(circle, #2d3348 0.5px, transparent 0.5px);
}

.ebb-canvas__loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
}

html[data-theme='dark'] .ebb-canvas__loading {
  background: #111827;
  color: #9ca3af;
}

.ebb-canvas__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--ee-primary);
  border-radius: 50%;
  animation: ebb-spin 0.8s linear infinite;
}

@keyframes ebb-spin {
  to { transform: rotate(360deg); }
}

.ebb-canvas__iframe-wrapper {
  position: relative;
  min-height: 200px;
  max-width: 100%;
  flex-shrink: 0;
  transition: width 0.3s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  overflow: hidden;
}

.ebb-canvas__iframe-wrapper--editing {
  overflow: visible;
}

html[data-theme='dark'] .ebb-canvas__iframe-wrapper {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15);
}

.ebb-canvas__iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #ffffff;
  display: block;
  border-radius: inherit;
}

.ebb-canvas__drag-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  cursor: copy;
  background: rgba(1, 168, 171, 0.02);
}
</style>
