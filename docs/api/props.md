# Props

## 组件 Props

| Prop | 类型 | 默认值 | 说明 |
| ---- | ---- | ------- | ---- |
| `modelValue` | `string` | `''` | MJML 内容（`v-model`） |
| `designJson` | `Record<string, unknown>` | — | 用于加载已保存设计的持久化 JSON |
| `variables` | `string[]` | `[]` | 侧边栏中展示的可用 merge variables |
| `labels` | `Partial<EditorLabels>` | `DEFAULT_LABELS` | i18n 文案覆盖 |
| `label` | `string` | — | 表单字段 label（作为表单字段使用时） |
| `required` | `boolean` | `false` | 表单必填校验标记 |
| `theme` | `Partial<ThemeConfig>` | `DEFAULT_THEME` | 外观定制 |
| `plugins` | `Plugin[]` | `[]` | 编辑器扩展插件 |
| `aiProvider` | `AiProvider` | — | AI 集成（模板生成、文本工具） |
| `mergeTags` | `MergeTag[]` | `[]` | AI 和 Merge Tag 插入使用的个性化变量 |
| `imageUpload` | `ImageUploadHandler` | — | 自定义图片上传处理器 |
| `browseAssets` | `BrowseAssetsHandler` | — | 自定义素材浏览处理器 |

## `modelValue` / `v-model`

MJML 源码字符串。文档变化时会自动更新。

```vue
<EmailEditor v-model="mjml" />
```

## `designJson`

传入已保存的设计以加载内容。编辑器会自动识别格式：

- **新格式**（`{ _editor: 'mesagoo-email-editor', ... }`）：直接加载。
- **Legacy GrapesJS 格式**：通过 MJML fallback 解析。

```vue
<EmailEditor :design-json="savedDesign" />
```

## `variables`

展示在侧边栏中的 merge variable 名称列表：

```vue
<EmailEditor :variables="['first_name', 'last_name', 'company']" />
```

## `labels`

局部文案覆盖。缺失 key 会回退到默认中文文案。详见 [i18n 指南](/guide/i18n)。

```vue
<EmailEditor :labels="{ editor_title: 'My Editor' }" />
```

## `theme`

局部主题覆盖。完整 25 个属性详见 [主题指南](/guide/theming)。

```vue
<EmailEditor :theme="{ primaryColor: '#7C3AED' }" />
```

## `plugins`

插件函数数组。详见 [插件指南](/guide/plugins)。

```vue
<EmailEditor :plugins="[myPlugin, anotherPlugin]" />
```

## `aiProvider`

实现 `AiProvider` 接口的对象。传入后会启用 AI 能力：通过 chat 生成模板、文本优化、主题建议等。详见 [AI 生成指南](/guide/ai)。

```vue
<EmailEditor :ai-provider="myAiProvider" />
```

## `mergeTags`

`MergeTag` 对象数组，表示可用于个性化的变量。它们会显示在侧边栏中，并包含在 AI system prompt 中。

```vue
<EmailEditor :merge-tags="[
  { name: 'First Name', value: '{{first_name}}', category: 'Contact' },
  { name: 'Company', value: '{{company}}', category: 'Company' },
]" />
```

## Vue Emits

| Event | Payload | 说明 |
| ----- | ------- | ---- |
| `update:modelValue` | `string` | MJML 源码更新 |
| `update:compiled-html` | `string` | 编译后的 HTML 更新 |
| `update:design-json` | `EmailDesignJson` | 设计 JSON 更新 |
