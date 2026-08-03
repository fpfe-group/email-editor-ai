# 类型参考

包中导出了所有核心类型，可以这样引入：

```ts
import type {
  EmailDocument,
  EmailNode,
  Plugin,
} from "@fpfe-group/email-editor-ai";
```

## 核心类型

### `EmailDocument`

根文档结构。

```ts
interface EmailDocument {
  version: 1;
  headAttributes: EmailHeadAttributes;
  body: EmailNode; // type: 'mj-body'
}
```

### `EmailNode`

文档树中的节点，直接映射到一个 MJML tag。

```ts
interface EmailNode {
  id: NodeId;
  type: EmailNodeType;
  attributes: Record<string, string>;
  children: EmailNode[];
  htmlContent?: string; // 仅用于 mj-text、mj-button
}
```

### `EmailNodeType`

```ts
type EmailNodeType =
  | "mj-body"
  | "mj-section"
  | "mj-column"
  | "mj-text"
  | "mj-image"
  | "mj-button"
  | "mj-divider"
  | "mj-spacer"
  | "mj-social"
  | "mj-social-element"
  | "mj-hero"
  | "mj-raw"
  | "mj-wrapper";
```

### `NodeId`

```ts
type NodeId = string; // nanoid 8 chars
```

### `EmailHeadAttributes`

```ts
interface EmailHeadAttributes {
  defaultStyles: Record<string, Record<string, string>>;
  fonts: Array<{ name: string; href: string }>;
  previewText: string;
}
```

### `EmailDesignJson`

用于保存和加载设计的持久化格式。

```ts
interface EmailDesignJson {
  _editor: "mesagoo-email-editor";
  _version: 1;
  document: EmailDocument;
}
```

## 区块类型

### `BlockDefinition`

```ts
interface BlockDefinition {
  id: string;
  label: string; // label key 或直接展示字符串
  category: BlockCategory; // 'layout' | 'content' | 'composite' | custom
  icon: string; // Lucide 图标名
  factory: () => EmailNode | EmailNode[];
}
```

### `BlockCategoryDefinition`

```ts
interface BlockCategoryDefinition {
  id: string;
  label: string;
  icon: string;
  order?: number; // 数字越小越靠前
}
```

## 属性类型

### `PropertyDefinition`

```ts
interface PropertyDefinition {
  key: string; // MJML 属性名
  label: string; // i18n label key
  type: PropertyType;
  defaultValue?: string;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  group: string;
}
```

### `PropertyType`

```ts
type PropertyType =
  | "text"
  | "number"
  | "color"
  | "select"
  | "padding"
  | "alignment"
  | "url"
  | "image"
  | "toggle";
```

## 主题类型

### `ThemeConfig`

全部 25 个属性都是可选的，详见 [主题指南](/guide/theming)。

```ts
interface ThemeConfig {
  primaryColor?: string;
  primaryHover?: string;
  primaryActive?: string;
  borderColor?: string;
  borderColorHover?: string;
  backgroundColor?: string;
  backgroundHover?: string;
  backgroundActive?: string;
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  canvasBg?: string;
  canvasBorder?: string;
  selectionColor?: string;
  hoverColor?: string;
  dropIndicatorColor?: string;
  sidebarBg?: string;
  sidebarBorder?: string;
  panelHeaderBg?: string;
  toolbarBg?: string;
  toolbarBorder?: string;
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
}
```

## 插件类型

### `Plugin`

```ts
type Plugin = (context: PluginContext) => void | Promise<void>;
```

### `PluginContext`

```ts
interface PluginContext {
  registerBlock: (block: BlockDefinition) => void;
  registerBlockCategory: (category: BlockCategoryDefinition) => void;
  registerPropertyEditor: (type: string, component: Component) => void;
  registerToolbarAction: (action: ToolbarAction) => void;
  registerSidebarPanel: (panel: SidebarPanel) => void;
  on: <K extends keyof EditorEventMap>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void
  ) => void;
  off: <K extends keyof EditorEventMap>(
    event: K,
    handler: (payload: EditorEventMap[K]) => void
  ) => void;
  labels: Ref<EditorLabels>;
}
```

### `ToolbarAction`

```ts
interface ToolbarAction {
  id: string;
  label: string;
  icon: string;
  handler: () => void;
  position?: "left" | "right";
  order?: number;
}
```

### `SidebarPanel`

```ts
interface SidebarPanel {
  id: string;
  label: string;
  icon: string;
  component: Component;
  order?: number;
}
```

## 事件类型

### `EditorEventMap`

```ts
interface EditorEventMap {
  "editor:ready": { document: EmailDocument };
  "editor:change": { document: EmailDocument };
  "node:selected": { nodeId: NodeId; node: EmailNode };
  "node:deselected": { nodeId: NodeId };
  "node:deleted": { nodeId: NodeId };
  "node:moved": { nodeId: NodeId; fromParentId: NodeId; toParentId: NodeId };
  "node:duplicated": { originalId: NodeId; newId: NodeId };
  "block:dropped": { blockId: string; parentId: NodeId };
  "history:undo": { canUndo: boolean; canRedo: boolean };
  "history:redo": { canUndo: boolean; canRedo: boolean };
  "property:changed": { nodeId: NodeId; key: string; value: string };
}
```

## AI 类型

### `AiProvider`

AI 集成接口。实现它即可连接你的 AI 后端。

```ts
interface AiProvider {
  /** 根据 prompt 和可选上下文生成文本 */
  generateText: (prompt: string, context?: string) => Promise<string>;
  /** 根据邮件内容生成主题建议 */
  generateSubjectLine?: (emailContent: string) => Promise<string[]>;
  /** 按指令优化已有文本 */
  improveText?: (text: string, instruction: string) => Promise<string>;
  /** 根据多轮对话生成完整邮件模板 */
  generateTemplate?: (
    messages: AiChatMessage[],
    systemPrompt: string
  ) => Promise<string>;
  /** 用于实时反馈的流式变体 */
  generateTemplateStream?: (
    messages: AiChatMessage[],
    systemPrompt: string
  ) => AsyncIterable<string>;
}
```

### `AiChatMessage`

AI Chat 会话中的一条消息。

```ts
interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
  /** 可选文件附件（图片、文档），用于多模态 AI */
  attachments?: AiAttachment[];
}
```

### `AiAttachment`

附加到 chat 消息中的文件。

```ts
interface AiAttachment {
  /** MIME type，例如 'image/png'、'application/pdf' */
  mimeType: string;
  /** base64 编码后的文件数据 */
  data: string;
  /** 用于展示的原始文件名 */
  name?: string;
}
```

### `MergeTag`

用于模板插入的个性化变量。

```ts
interface MergeTag {
  /** 展示名，例如 "First Name" */
  name: string;
  /** 插入 HTML 的模板值，例如 "{{first_name}}" */
  value: string;
  /** 可选分类，例如 "Contact" */
  category?: string;
}
```

### `BuildSystemPromptOptions`

`buildTemplateSystemPrompt()` 的参数。

```ts
interface BuildSystemPromptOptions {
  mergeTags?: MergeTag[];
  promptPrefix?: string;
  promptSuffix?: string;
}
```

### `AiParseError`

AI 响应解析失败时抛出的错误类。

```ts
class AiParseError extends Error {
  readonly rawResponse?: string;
}
```

## 工具类型

### 节点类型常量

```ts
const CONTENT_NODE_TYPES: EmailNodeType[]; // ['mj-text', 'mj-button']
const CONTAINER_NODE_TYPES: EmailNodeType[]; // ['mj-body', 'mj-section', ...]
const SELF_CLOSING_NODE_TYPES: EmailNodeType[]; // ['mj-divider', 'mj-spacer', 'mj-image']
```

### `isNewEditorJson(data)`

用于区分新编辑器格式与 legacy GrapesJS 数据的类型守卫。

```ts
function isNewEditorJson(data: unknown): data is EmailDesignJson;
```
