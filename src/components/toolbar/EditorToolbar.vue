<script setup lang="ts">
import { inject, ref } from 'vue'
import EIcon from '../internal/EIcon.vue'
import { DEVICE_PRESETS } from '../../constants'
import { EMAIL_DOCUMENT_KEY } from '../../injection-keys'
import { EMAIL_LABELS_KEY, DEFAULT_LABELS } from '../../labels'

const props = defineProps<{
  isFullscreen: boolean
  activeView: 'visual' | 'mjml' | 'html'
  activeDeviceIndex: number
  isDarkPreview: boolean
  canSendTest?: boolean
}>()

const emit = defineEmits<{
  'toggle-fullscreen': []
  'toggle-mjml-view': []
  'toggle-html-view': []
  'toggle-dark-preview': []
  'import-mjml': []
  'send-test': [html: string]
  'update:activeDeviceIndex': [index: number]
}>()

const labels = inject(EMAIL_LABELS_KEY, DEFAULT_LABELS)
const doc = inject(EMAIL_DOCUMENT_KEY)!
const isSendingTest = ref(false)

function setDevice(index: number) {
  emit('update:activeDeviceIndex', index)
}

function undo() {
  doc.history.undo()
  doc.triggerEmit()
}

function redo() {
  doc.history.redo()
  doc.triggerEmit()
}

async function sendTestEmail() {
  if (!props.canSendTest || isSendingTest.value) return
  isSendingTest.value = true
  try {
    await doc.triggerEmit()
    emit('send-test', doc.compiledHtml.value)
  } finally {
    isSendingTest.value = false
  }
}
</script>

<template>
  <div class="ebb-toolbar" role="toolbar" :aria-label="labels.editor_title">
    <!-- Left: Device switcher -->
    <div class="ebb-toolbar__left">
      <div class="ebb-toolbar__device-group" role="radiogroup" :aria-label="labels.desktop">
        <button
          v-for="(device, i) in DEVICE_PRESETS"
          :key="device.name"
          class="ebb-toolbar__device-btn"
          :class="{ 'ebb-toolbar__device-btn--active': activeDeviceIndex === i }"
          role="radio"
          :aria-checked="activeDeviceIndex === i"
          :title="device.name"
          @click="setDevice(i)"
        >
          <EIcon :name="device.icon" :size="16" />
          <span class="ebb-toolbar__device-label">{{ device.name }}</span>
        </button>
      </div>
    </div>

    <!-- Center: Title -->
    <div class="ebb-toolbar__title">
      {{ labels.editor_title }}
    </div>

    <!-- Right: Undo/Redo + Code + Fullscreen -->
    <div class="ebb-toolbar__group">
      <button
        class="ebb-toolbar__action-btn"
        :class="{ 'ebb-toolbar__action-btn--disabled': !doc.history.canUndo.value }"
        :disabled="!doc.history.canUndo.value"
        :aria-disabled="!doc.history.canUndo.value"
        :title="labels.undo"
        :aria-label="labels.undo"
        @click="undo"
      >
        <EIcon name="Undo2" :size="16" />
      </button>
      <button
        class="ebb-toolbar__action-btn"
        :class="{ 'ebb-toolbar__action-btn--disabled': !doc.history.canRedo.value }"
        :disabled="!doc.history.canRedo.value"
        :aria-disabled="!doc.history.canRedo.value"
        :title="labels.redo"
        :aria-label="labels.redo"
        @click="redo"
      >
        <EIcon name="Redo2" :size="16" />
      </button>
      <div class="ebb-toolbar__divider"></div>
      <button
        v-if="canSendTest"
        class="ebb-toolbar__action-btn ebb-toolbar__send-test-btn"
        :class="{ 'ebb-toolbar__action-btn--disabled': isSendingTest }"
        :disabled="isSendingTest"
        :aria-disabled="isSendingTest"
        :title="labels.send_test"
        :aria-label="labels.send_test"
        @click="sendTestEmail"
      >
        <EIcon :name="isSendingTest ? 'LoaderCircle' : 'Send'" :size="14" />
        <span class="ebb-toolbar__send-test-label">{{ labels.send_test }}</span>
      </button>
      <div v-if="canSendTest" class="ebb-toolbar__divider"></div>
      <button
        class="ebb-toolbar__action-btn"
        :class="{ 'ebb-toolbar__action-btn--active': isDarkPreview }"
        :aria-pressed="isDarkPreview"
        :title="labels.dark_mode_preview"
        :aria-label="labels.dark_mode_preview"
        @click="emit('toggle-dark-preview')"
      >
        <EIcon :name="isDarkPreview ? 'Sun' : 'Moon'" :size="16" />
      </button>
      <div class="ebb-toolbar__divider"></div>
      <button
        class="ebb-toolbar__action-btn ebb-toolbar__action-btn--code"
        :title="labels.import_mjml"
        :aria-label="labels.import_mjml"
        @click="emit('import-mjml')"
      >
        <svg
          class="ebb-toolbar__code-icon"
          viewBox="0 0 44 32"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M22 3.5V15.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M16.5 9L22 3.5L27.5 9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13 16.5V18.5C13 20.2 14.3 21.5 16 21.5H28C29.7 21.5 31 20.2 31 18.5V16.5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <text
            x="22"
            y="29"
            text-anchor="middle"
            fill="currentColor"
            class="ebb-toolbar__code-icon-text"
          >MJML</text>
        </svg>
      </button>
      <button
        class="ebb-toolbar__action-btn ebb-toolbar__action-btn--code"
        :class="{ 'ebb-toolbar__action-btn--active': activeView === 'mjml' }"
        :aria-pressed="activeView === 'mjml'"
        :title="labels.mjml_code"
        :aria-label="labels.mjml_code"
        @click="emit('toggle-mjml-view')"
      >
        <svg
          class="ebb-toolbar__code-icon"
          viewBox="0 0 44 32"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M15.5 5.5L9.5 11.5L15.5 17.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M28.5 5.5L34.5 11.5L28.5 17.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <text
            x="22"
            y="27"
            text-anchor="middle"
            fill="currentColor"
            class="ebb-toolbar__code-icon-text"
          >MJML</text>
        </svg>
      </button>
      <button
        class="ebb-toolbar__action-btn ebb-toolbar__action-btn--code"
        :class="{ 'ebb-toolbar__action-btn--active': activeView === 'html' }"
        :aria-pressed="activeView === 'html'"
        :title="labels.html_code"
        :aria-label="labels.html_code"
        @click="emit('toggle-html-view')"
      >
        <svg
          class="ebb-toolbar__code-icon"
          viewBox="0 0 44 32"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M14 3.5H25L31 9.5V18H14V3.5Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M25 3.5V9.5H31"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 12L16.8 14L19 16"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M26 12L28.2 14L26 16"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <text
            x="22"
            y="27"
            text-anchor="middle"
            fill="currentColor"
            class="ebb-toolbar__code-icon-text"
          >HTML</text>
        </svg>
      </button>
      <div class="ebb-toolbar__divider"></div>
      <button
        class="ebb-toolbar__action-btn"
        :aria-pressed="isFullscreen"
        :title="labels.fullscreen"
        :aria-label="labels.fullscreen"
        @click="emit('toggle-fullscreen')"
      >
        <EIcon :name="isFullscreen ? 'Minimize2' : 'Maximize2'" :size="16" />
      </button>
    </div>
  </div>
</template>

<style>
.ebb-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

html[data-theme='dark'] .ebb-toolbar {
  background: #1f2937;
  border-bottom-color: #374151;
}

.ebb-toolbar__left {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ebb-toolbar__group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.ebb-toolbar__device-group {
  display: flex;
  align-items: center;
  gap: 1px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 3px;
}

html[data-theme='dark'] .ebb-toolbar__device-group {
  background: #111827;
}

.ebb-toolbar__device-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ebb-toolbar__device-label {
  font-size: 11px;
  font-weight: 500;
}

.ebb-toolbar__device-btn:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.04);
}

html[data-theme='dark'] .ebb-toolbar__device-btn:hover {
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.06);
}

.ebb-toolbar__device-btn--active {
  background: #ffffff;
  color: var(--ee-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

html[data-theme='dark'] .ebb-toolbar__device-btn--active {
  background: #374151;
  color: var(--ee-primary);
}

.ebb-toolbar__title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.01em;
}

html[data-theme='dark'] .ebb-toolbar__title {
  color: #d1d5db;
}

.ebb-toolbar__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ebb-toolbar__action-btn--code {
  width: 44px;
}

.ebb-toolbar__send-test-btn {
  width: auto;
  min-width: 82px;
  padding: 0 10px;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.ebb-toolbar__send-test-label {
  line-height: 1;
}

.ebb-toolbar__send-test-btn .lucide-loader-circle {
  animation: ebb-toolbar-spin 0.8s linear infinite;
}

.ebb-toolbar__code-icon {
  width: 36px;
  height: 28px;
  flex-shrink: 0;
}

.ebb-toolbar__code-icon-text {
  font-family: var(--ee-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  font-size: 7px;
  font-weight: 700;
}

.ebb-toolbar__action-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

html[data-theme='dark'] .ebb-toolbar__action-btn:hover {
  background: #374151;
  color: #f3f4f6;
}

.ebb-toolbar__action-btn--active {
  background: rgba(1, 168, 171, 0.12);
  color: var(--ee-primary);
}

.ebb-toolbar__action-btn--disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}

.ebb-toolbar__divider {
  width: 1px;
  height: 20px;
  background: #e5e7eb;
  margin: 0 6px;
}

html[data-theme='dark'] .ebb-toolbar__divider {
  background: #374151;
}

@keyframes ebb-toolbar-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
