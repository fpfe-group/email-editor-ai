# 主题定制

编辑器外观通过 CSS 变量完全可定制。你可以传入 `theme` prop 覆盖 25 个可用主题属性。

## 基础用法

```vue
<EmailEditor
  :theme="{
    primaryColor: '#7C3AED',
    primaryHover: '#6D28D9',
    borderRadius: '8px',
  }"
/>
```

## 全部主题属性

| 属性                 | CSS 变量               | 默认值       | 说明            |
| -------------------- | ---------------------- | ------------ | --------------- |
| `primaryColor`       | `--ee-primary`         | `#01A8AB`    | 主强调色        |
| `primaryHover`       | `--ee-primary-hover`   | `#018F91`    | Hover 状态      |
| `primaryActive`      | `--ee-primary-active`  | `#017375`    | Active/按下状态 |
| `borderColor`        | `--ee-border`          | `#e5e7eb`    | 默认边框        |
| `borderColorHover`   | `--ee-border-hover`    | `#d1d5db`    | Hover 边框      |
| `backgroundColor`    | `--ee-bg`              | `#ffffff`    | 面板背景        |
| `backgroundHover`    | `--ee-bg-hover`        | `#f3f4f6`    | Hover 背景      |
| `backgroundActive`   | `--ee-bg-active`       | `#e5e7eb`    | Active 背景     |
| `textPrimary`        | `--ee-text-primary`    | `#1f2937`    | 主文本          |
| `textSecondary`      | `--ee-text-secondary`  | `#6b7280`    | 次级文本        |
| `textMuted`          | `--ee-text-muted`      | `#9ca3af`    | 弱化文本        |
| `canvasBg`           | `--ee-canvas-bg`       | `#e5e7eb`    | 画布背景        |
| `canvasBorder`       | `--ee-canvas-border`   | `#d1d5db`    | 画布边框        |
| `selectionColor`     | `--ee-selection`       | `#01A8AB`    | 选中元素描边    |
| `hoverColor`         | `--ee-hover`           | `#01A8AB`    | Hover 元素描边  |
| `dropIndicatorColor` | `--ee-drop-indicator`  | `#01A8AB`    | Drop 区域指示色 |
| `sidebarBg`          | `--ee-sidebar-bg`      | `#ffffff`    | 侧边栏背景      |
| `sidebarBorder`      | `--ee-sidebar-border`  | `#e5e7eb`    | 侧边栏边框      |
| `panelHeaderBg`      | `--ee-panel-header-bg` | `#f9fafb`    | 面板标题背景    |
| `toolbarBg`          | `--ee-toolbar-bg`      | `#ffffff`    | 工具栏背景      |
| `toolbarBorder`      | `--ee-toolbar-border`  | `#e5e7eb`    | 工具栏边框      |
| `successColor`       | `--ee-success`         | `#10b981`    | 成功状态        |
| `warningColor`       | `--ee-warning`         | `#f59e0b`    | 警告状态        |
| `errorColor`         | `--ee-error`           | `#ef4444`    | 错误状态        |
| `fontFamily`         | `--ee-font-family`     | System stack | UI 字体         |
| `fontSize`           | `--ee-font-size`       | `13px`       | UI 字号         |
| `borderRadius`       | `--ee-radius`          | `6px`        | UI 圆角         |

## 示例

### 深色主题

```vue
<EmailEditor
  :theme="{
    primaryColor: '#818cf8',
    primaryHover: '#6366f1',
    backgroundColor: '#1e1e2e',
    backgroundHover: '#2a2a3e',
    backgroundActive: '#363649',
    borderColor: '#3b3b52',
    textPrimary: '#e4e4ef',
    textSecondary: '#9898b0',
    textMuted: '#6b6b80',
    canvasBg: '#11111b',
    sidebarBg: '#1e1e2e',
    toolbarBg: '#1e1e2e',
    panelHeaderBg: '#2a2a3e',
  }"
/>
```

### 品牌色

```vue
<EmailEditor
  :theme="{
    primaryColor: '#e11d48',
    primaryHover: '#be123c',
    primaryActive: '#9f1239',
    selectionColor: '#e11d48',
    hoverColor: '#e11d48',
    dropIndicatorColor: '#e11d48',
  }"
/>
```

### 更圆润的 UI

```vue
<EmailEditor
  :theme="{
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
  }"
/>
```

## 工作原理

主题会应用到 `.ebb-shell` 根元素上的 CSS custom properties。所有内部组件都读取这些变量，而不是写死颜色，因此主题改动会立即传递到整个编辑器。

```ts
import { DEFAULT_THEME } from "@fpfe-group/email-editor-ai";

// 访问所有默认值
console.log(DEFAULT_THEME.primaryColor); // '#01A8AB'
```
