# 快速开始

## 安装

```bash
npm install @fpfe-group/email-editor-ai
```

### Peer Dependencies（对等依赖）

编辑器依赖 Vue 3.4+ 和 `mjml-browser`：

```bash
npm install vue@^3.4 mjml-browser@^4.15
```

## 基础用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import { EmailEditor } from "@fpfe-group/email-editor-ai";
import "@fpfe-group/email-editor-ai/style.css";

const editorRef = ref();
const mjml = ref("");
const html = ref("");
const designJson = ref();
</script>

<template>
  <div style="height: 100vh">
    <EmailEditor
      ref="editorRef"
      v-model="mjml"
      :design-json="designJson"
      @update:compiled-html="html = $event"
      @update:design-json="designJson = $event"
    />
  </div>
</template>
```

::: tip
编辑器会填满父容器，请确保父容器有明确高度，例如 `height: 100vh`。
:::

## 你会得到什么

`v-model` 绑定的是 **MJML 源码字符串**。此外，你还可以拿到：

- **`compiled-html`**：已渲染完成、可用于发送的 HTML。
- **`design-json`**：可序列化保存并再次加载的设计 JSON。

## 保存与加载设计

```vue
<script setup lang="ts">
import { ref } from "vue";
import { EmailEditor } from "@fpfe-group/email-editor-ai";
import "@fpfe-group/email-editor-ai/style.css";

const editorRef = ref();
const designJson = ref();

// 加载已保存的设计
async function loadDesign() {
  const saved = await fetch("/api/designs/1").then((r) => r.json());
  designJson.value = saved;
}

// 保存当前设计
function saveDesign() {
  const json = editorRef.value.getDesignJson();
  fetch("/api/designs/1", {
    method: "PUT",
    body: JSON.stringify(json),
  });
}

// 导出最终 HTML
function exportHtml() {
  const html = editorRef.value.getHtml();
  // 通过你的邮件 API 发送
}
</script>

<template>
  <div style="height: 100vh">
    <EmailEditor ref="editorRef" :design-json="designJson" />
    <button @click="saveDesign">保存</button>
    <button @click="exportHtml">导出 HTML</button>
  </div>
</template>
```

## 使用中文 Labels

```vue
<script setup lang="ts">
import { EmailEditor, ZH_LABELS } from "@fpfe-group/email-editor-ai";
import "@fpfe-group/email-editor-ai/style.css";
</script>

<template>
  <EmailEditor :labels="ZH_LABELS" />
</template>
```

## 使用自定义主题

```vue
<EmailEditor
  :theme="{
    primaryColor: '#7C3AED',
    primaryHover: '#6D28D9',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
  }"
/>
```

## 下一步

- [主题](/guide/theming)：自定义颜色、字体和间距。
- [i18n](/guide/i18n)：添加自己的语言。
- [插件](/guide/plugins)：通过自定义区块和 UI 扩展编辑器。
- [API 参考](/api/props)：查看完整 props、events 和 methods。
