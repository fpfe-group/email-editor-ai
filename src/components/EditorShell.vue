<script setup lang="ts">
import { ref, inject, computed, defineAsyncComponent } from 'vue'
import EIcon from './internal/EIcon.vue'
import EditorToolbar from './toolbar/EditorToolbar.vue'
import EditorCanvas from './canvas/EditorCanvas.vue'
import EditorSidebar from './sidebar/EditorSidebar.vue'
import { EMAIL_DOCUMENT_KEY } from '../injection-keys'
import { EMAIL_LABELS_KEY, DEFAULT_LABELS } from '../labels'
import { DEVICE_PRESETS } from '../constants'
import type { ThemeConfig } from '../types'
import { DEFAULT_THEME } from '../types'
import { documentToMjml } from '../serializer/json-to-mjml'
import { mjmlToDocument } from '../serializer/mjml-to-json'
import { compileMjml } from '../composables/useMjmlCompiler'

const CodeEditor = defineAsyncComponent(() => import('./code/CodeEditor.vue'))

const props = defineProps<{
  label?: string
  required?: boolean
  theme?: Partial<ThemeConfig>
  canSendTest?: boolean
}>()

const emit = defineEmits<{
  'send-test': [html: string]
}>()

const themeStyles = computed(() => {
  const t = { ...DEFAULT_THEME, ...props.theme }
  return {
    '--ee-primary': t.primaryColor,
    '--ee-primary-hover': t.primaryHover,
    '--ee-primary-active': t.primaryActive,
    '--ee-border': t.borderColor,
    '--ee-border-hover': t.borderColorHover,
    '--ee-bg': t.backgroundColor,
    '--ee-bg-hover': t.backgroundHover,
    '--ee-bg-active': t.backgroundActive,
    '--ee-text-primary': t.textPrimary,
    '--ee-text-secondary': t.textSecondary,
    '--ee-text-muted': t.textMuted,
    '--ee-canvas-bg': t.canvasBg,
    '--ee-canvas-border': t.canvasBorder,
    '--ee-selection': t.selectionColor,
    '--ee-hover': t.hoverColor,
    '--ee-drop-indicator': t.dropIndicatorColor,
    '--ee-sidebar-bg': t.sidebarBg,
    '--ee-sidebar-border': t.sidebarBorder,
    '--ee-panel-header-bg': t.panelHeaderBg,
    '--ee-toolbar-bg': t.toolbarBg,
    '--ee-toolbar-border': t.toolbarBorder,
    '--ee-success': t.successColor,
    '--ee-warning': t.warningColor,
    '--ee-error': t.errorColor,
    '--ee-font-family': t.fontFamily,
    '--ee-font-size': t.fontSize,
    '--ee-border-radius': t.borderRadius,
  }
})

const labels = inject(EMAIL_LABELS_KEY, DEFAULT_LABELS)
const doc = inject(EMAIL_DOCUMENT_KEY)!

const isFullscreen = ref(false)
const activeView = ref<'visual' | 'mjml' | 'html'>('visual')
const initError = ref('')
const activeDeviceIndex = ref(0)
const isDarkPreview = ref(false)
const isImportMjmlOpen = ref(false)
const importMjmlSource = ref('')
const importMjmlError = ref('')
const isImportingMjml = ref(false)

const canvasWidth = computed(() => DEVICE_PRESETS[activeDeviceIndex.value].width)

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function toggleMjmlView() {
  activeView.value = activeView.value === 'mjml' ? 'visual' : 'mjml'
}

function toggleHtmlView() {
  activeView.value = activeView.value === 'html' ? 'visual' : 'html'
}

function toggleDarkPreview() {
  isDarkPreview.value = !isDarkPreview.value
}

function openImportMjml() {
  importMjmlSource.value = documentToMjml(doc.document.value)
  importMjmlError.value = ''
  isImportMjmlOpen.value = true
}

function closeImportMjml() {
  if (isImportingMjml.value) return
  isImportMjmlOpen.value = false
  importMjmlError.value = ''
}

async function applyImportedMjml() {
  const source = importMjmlSource.value.trim()
  if (!source) {
    importMjmlError.value = labels.import_mjml_empty
    return
  }

  if (!/<mjml[\s>]/i.test(source)) {
    importMjmlError.value = labels.import_mjml_invalid
    return
  }

  isImportingMjml.value = true
  importMjmlError.value = ''
  try {
    const result = await compileMjml(source)
    if (!result.html) {
      const errorMessage = result.errors
        .map((error) => error.line ? `Line ${error.line}: ${error.message}` : error.message)
        .join('\n')
      importMjmlError.value = errorMessage
        ? `${labels.import_mjml_invalid}：${errorMessage}`
        : labels.import_mjml_invalid
      return
    }

    doc.replaceDocument(mjmlToDocument(source))
    await doc.triggerEmit()
    activeView.value = 'visual'
    isImportMjmlOpen.value = false
  } finally {
    isImportingMjml.value = false
  }
}
</script>

<template>
  <div class="email-body-editor">
    <label v-if="label" class="ebb-label">
      {{ label }}
      <span v-if="required" class="ebb-label__required">*</span>
    </label>

    <div v-if="initError" class="ebb-alert">
      <EIcon name="AlertTriangle" :size="18" />
      <div>
        <strong>{{ labels.init_error }}</strong>
        <p>{{ initError }}</p>
      </div>
    </div>

    <div
      v-show="!initError"
      class="ebb-shell"
      :class="{ 'ebb-shell--fullscreen': isFullscreen }"
      :style="themeStyles"
      role="application"
      :aria-label="labels.editor_title"
    >
      <!-- Skip link for keyboard users -->
      <a href="#ebb-canvas-region" class="ebb-sr-only ebb-sr-only--focusable">
        {{ labels.editor_title }}
      </a>

      <!-- ═══ TOP TOOLBAR ═══ -->
      <EditorToolbar
        :is-fullscreen="isFullscreen"
        :active-view="activeView"
        :active-device-index="activeDeviceIndex"
        :is-dark-preview="isDarkPreview"
        :can-send-test="canSendTest"
        @toggle-fullscreen="toggleFullscreen"
        @toggle-mjml-view="toggleMjmlView"
        @toggle-html-view="toggleHtmlView"
        @toggle-dark-preview="toggleDarkPreview"
        @import-mjml="openImportMjml"
        @send-test="emit('send-test', $event)"
        @update:active-device-index="activeDeviceIndex = $event"
      />

      <div v-if="isImportMjmlOpen" class="ebb-import-mjml" role="dialog" aria-modal="true" @click.self="closeImportMjml">
        <div class="ebb-import-mjml__panel">
          <div class="ebb-import-mjml__header">
            <div class="ebb-import-mjml__title">
              <EIcon name="Upload" :size="16" />
              <span>{{ labels.import_mjml_title }}</span>
            </div>
            <button
              type="button"
              class="ebb-import-mjml__close"
              :aria-label="labels.close"
              :disabled="isImportingMjml"
              @click="closeImportMjml"
            >
              <EIcon name="X" :size="15" />
            </button>
          </div>
          <textarea
            v-model="importMjmlSource"
            class="ebb-import-mjml__textarea"
            spellcheck="false"
            :placeholder="labels.import_mjml_placeholder"
          ></textarea>
          <pre v-if="importMjmlError" class="ebb-import-mjml__error">{{ importMjmlError }}</pre>
          <div class="ebb-import-mjml__actions">
            <button
              type="button"
              class="ebb-import-mjml__btn ebb-import-mjml__btn--ghost"
              :disabled="isImportingMjml"
              @click="closeImportMjml"
            >
              {{ labels.import_mjml_cancel }}
            </button>
            <button
              type="button"
              class="ebb-import-mjml__btn ebb-import-mjml__btn--primary"
              :disabled="isImportingMjml"
              @click="applyImportedMjml"
            >
              <EIcon v-if="isImportingMjml" name="LoaderCircle" :size="14" />
              <span>{{ labels.import_mjml_apply }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ═══ MAIN AREA ═══ -->
      <div class="ebb-main">
        <!-- Canvas (visual editor) -->
        <EditorCanvas v-show="activeView === 'visual'" :canvas-width="canvasWidth" :dark-preview="isDarkPreview" />

        <!-- Code view (CodeMirror) -->
        <CodeEditor
          v-if="activeView === 'mjml' || activeView === 'html'"
          :key="activeView"
          :source-type="activeView"
        />

        <!-- Right Sidebar -->
        <EditorSidebar />
      </div>
    </div>
  </div>
</template>

<style>
/* ═══════════════════════════════════════════════════════════════
   EMAIL BODY BUILDER — Immersive Shell
   ═══════════════════════════════════════════════════════════════ */

.ebb-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--ee-text-primary, #374151);
  margin-bottom: 8px;
}

.ebb-label__required {
  color: var(--ee-error, #ef4444);
}

.ebb-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  background: #fef2f2;
  color: #991b1b;
  font-size: 13px;
  margin-bottom: 12px;
}

html[data-theme='dark'] .ebb-alert {
  background: #450a0a;
  border-color: #7f1d1d;
  color: #fca5a5;
}

.ebb-alert p {
  margin: 4px 0 0;
  font-size: 12px;
}

.ebb-shell {
  position: relative;
  border: 1px solid var(--ee-border, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
  background: var(--ee-panel-header-bg, #f9fafb);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 180px);
  min-height: 500px;
  font-family: var(--ee-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  font-size: var(--ee-font-size, 13px);
}

.ebb-shell--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  height: 100vh;
  border-radius: 0;
  border: none;
}

/* ═══ MAIN ═══ */
.ebb-main {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.ebb-import-mjml {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
}

.ebb-import-mjml__panel {
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: min(680px, calc(100vh - 96px));
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.24);
  overflow: hidden;
}

html[data-theme='dark'] .ebb-import-mjml__panel {
  border-color: #374151;
  background: #111827;
}

.ebb-import-mjml__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
}

html[data-theme='dark'] .ebb-import-mjml__header {
  border-bottom-color: #374151;
}

.ebb-import-mjml__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #111827;
  font-size: 14px;
  font-weight: 700;
}

html[data-theme='dark'] .ebb-import-mjml__title {
  color: #f9fafb;
}

.ebb-import-mjml__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
}

.ebb-import-mjml__close:hover {
  background: #f3f4f6;
  color: #111827;
}

html[data-theme='dark'] .ebb-import-mjml__close:hover {
  background: #1f2937;
  color: #f9fafb;
}

.ebb-import-mjml__textarea {
  flex: 1;
  min-height: 360px;
  max-height: 520px;
  padding: 14px;
  border: none;
  outline: none;
  resize: vertical;
  background: #0f172a;
  color: #e5e7eb;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.55;
}

.ebb-import-mjml__textarea::placeholder {
  color: #94a3b8;
}

.ebb-import-mjml__error {
  max-height: 96px;
  margin: 0;
  padding: 10px 14px;
  overflow: auto;
  border-top: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.ebb-import-mjml__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #e5e7eb;
}

html[data-theme='dark'] .ebb-import-mjml__actions {
  border-top-color: #374151;
}

.ebb-import-mjml__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 88px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.ebb-import-mjml__btn:disabled {
  opacity: 0.55;
  cursor: default;
}

.ebb-import-mjml__btn--ghost {
  border-color: #d1d5db;
  background: #ffffff;
  color: #374151;
}

.ebb-import-mjml__btn--primary {
  background: var(--ee-primary);
  color: #ffffff;
}

.ebb-import-mjml__btn--primary .lucide-loader-circle {
  animation: ebb-import-mjml-spin 0.8s linear infinite;
}

@keyframes ebb-import-mjml-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ═══ Screen reader only ═══ */
.ebb-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.ebb-sr-only--focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 8px 16px;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
  background: var(--ee-primary);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  z-index: 100;
}
</style>
