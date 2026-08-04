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
import { EMAIL_DOCUMENT_KEY } from '../../injection-keys'
import { documentToMjml } from '../../serializer/json-to-mjml'
import { mjmlToDocument } from '../../serializer/mjml-to-json'
import { compileMjml } from '../../composables/useMjmlCompiler'

const doc = inject(EMAIL_DOCUMENT_KEY)!

const props = withDefaults(defineProps<{
  sourceType?: 'mjml' | 'html'
}>(), {
  sourceType: 'mjml',
})

const editorContainer = ref<HTMLDivElement | null>(null)
let view: EditorView | null = null
let ignoreNextUpdate = false
let refreshToken = 0
let isDestroyed = false

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
        '.cm-scroller': { overflow: 'auto' },
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
  view?.destroy()
  view = null
})
</script>

<template>
  <div ref="editorContainer" class="ebb-code-editor"></div>
</template>

<style>
.ebb-code-editor {
  flex: 1;
  overflow: hidden;
  background: #282c34;
}

.ebb-code-editor .cm-editor {
  height: 100%;
}
</style>
