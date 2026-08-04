<script setup lang="ts">
/**
 * CodeEditor — CodeMirror 6 editor for MJML source and compiled HTML.
 * MJML mode is editable; HTML mode is a read-only compiled output.
 */
import { ref, inject, onMounted, onBeforeUnmount, watch } from 'vue'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { xml } from '@codemirror/lang-xml'
import { oneDark } from '@codemirror/theme-one-dark'
import EIcon from '../internal/EIcon.vue'
import { EMAIL_DOCUMENT_KEY } from '../../injection-keys'
import { EMAIL_LABELS_KEY, DEFAULT_LABELS } from '../../labels'
import { documentToMjml } from '../../serializer/json-to-mjml'
import { mjmlToDocument } from '../../serializer/mjml-to-json'
import { compileMjml } from '../../composables/useMjmlCompiler'

const doc = inject(EMAIL_DOCUMENT_KEY)!
const labels = inject(EMAIL_LABELS_KEY, DEFAULT_LABELS)

const props = withDefaults(defineProps<{
  sourceType?: 'mjml' | 'html'
}>(), {
  sourceType: 'mjml',
})

const editorContainer = ref<HTMLDivElement | null>(null)
const isCopied = ref(false)
let view: EditorView | null = null
let ignoreNextUpdate = false
let refreshToken = 0
let isDestroyed = false
let copiedTimer: ReturnType<typeof setTimeout> | null = null

function getMjml(): string {
  return documentToMjml(doc.document.value)
}

async function getHtml(): Promise<string> {
  const result = await compileMjml(getMjml())
  if (result.html) return result.html
  if (result.errors.length === 0) return ''
  const errors = result.errors.map((e) => `Line ${e.line}: ${e.message}`).join('\n')
  return `<!-- MJML compilation failed\n${errors}\n-->`
}

async function getSource(): Promise<string> {
  if (props.sourceType === 'html') {
    return await getHtml()
  }
  return getMjml()
}

async function createEditor(container: HTMLElement) {
  const source = await getSource()
  if (isDestroyed) return
  const state = EditorState.create({
    doc: source,
    extensions: [
      lineNumbers(),
      highlightActiveLine(),
      keymap.of([...defaultKeymap, indentWithTab]),
      xml(),
      oneDark,
      EditorState.readOnly.of(props.sourceType === 'html'),
      EditorView.editable.of(props.sourceType === 'mjml'),
      EditorView.updateListener.of((update) => {
        if (props.sourceType === 'mjml' && update.docChanged) {
          ignoreNextUpdate = true
          const mjmlSource = update.state.doc.toString()
          try {
            const newDoc = mjmlToDocument(mjmlSource)
            doc.replaceDocument(newDoc)
          } catch {
            // Invalid MJML — ignore until user fixes it
          }
        }
      }),
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-scroller': { overflow: 'auto', paddingRight: '46px' },
        '.cm-content': { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
      }),
    ],
  })

  view = new EditorView({ state, parent: container })
}

async function refreshEditorSource(): Promise<void> {
  if (!view) return
  const token = ++refreshToken
  const newSource = await getSource()
  if (!view || token !== refreshToken) return
  const currentSource = view.state.doc.toString()
  if (newSource !== currentSource) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newSource },
    })
  }
}

function copyWithTextarea(source: string): boolean {
  if (typeof document === 'undefined') return false
  const textarea = document.createElement('textarea')
  textarea.value = source
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  const success = document.execCommand('copy')
  document.body.removeChild(textarea)
  return success
}

async function copyCode(): Promise<void> {
  const source = view?.state.doc.toString() ?? await getSource()
  if (!source) return

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(source)
    } else if (!copyWithTextarea(source)) {
      return
    }
  } catch {
    if (!copyWithTextarea(source)) return
  }

  isCopied.value = true
  if (copiedTimer) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    isCopied.value = false
    copiedTimer = null
  }, 1400)
}

// Sync document changes back to the editor (e.g. undo/redo from visual mode)
watch(
  () => doc.document.value,
  async () => {
    if (ignoreNextUpdate) {
      ignoreNextUpdate = false
      return
    }
    await refreshEditorSource()
  },
  { deep: true },
)

onMounted(() => {
  isDestroyed = false
  if (editorContainer.value) {
    void createEditor(editorContainer.value)
  }
})

onBeforeUnmount(() => {
  isDestroyed = true
  if (copiedTimer) clearTimeout(copiedTimer)
  view?.destroy()
  view = null
})
</script>

<template>
  <div class="ebb-code-editor">
    <div ref="editorContainer" class="ebb-code-editor__surface"></div>
    <button
      type="button"
      class="ebb-code-editor__copy"
      :class="{ 'ebb-code-editor__copy--copied': isCopied }"
      :title="isCopied ? labels.code_copied : labels.copy_code"
      :aria-label="isCopied ? labels.code_copied : labels.copy_code"
      @click="copyCode"
    >
      <EIcon :name="isCopied ? 'Check' : 'Copy'" :size="15" />
    </button>
  </div>
</template>

<style>
.ebb-code-editor {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: #282c34;
}

.ebb-code-editor__surface,
.ebb-code-editor .cm-editor {
  height: 100%;
}

.ebb-code-editor__copy {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 6px;
  background: rgba(17, 24, 39, 0.82);
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.ebb-code-editor__copy:hover {
  border-color: rgba(20, 184, 166, 0.75);
  background: rgba(15, 23, 42, 0.95);
  color: #ffffff;
}

.ebb-code-editor__copy--copied {
  border-color: rgba(20, 184, 166, 0.75);
  background: rgba(20, 184, 166, 0.2);
  color: #5eead4;
}
</style>
