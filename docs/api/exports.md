# 导出项

包提供 35+ 个命名导出，适合高级用法。

## 组件

```ts
import { EmailEditor } from "@fpfe-group/email-editor-ai";
```

## Labels 与 i18n

```ts
import { DEFAULT_LABELS, ZH_LABELS } from "@fpfe-group/email-editor-ai";
```

| 导出项           | 类型           | 说明                              |
| ---------------- | -------------- | --------------------------------- |
| `DEFAULT_LABELS` | `EditorLabels` | 默认中文 labels，包含 175+ 个 key |
| `ZH_LABELS`      | `EditorLabels` | 中文 labels 预设                  |

## 序列化

```ts
import {
  compileMjml,
  documentToMjml,
  mjmlToDocument,
} from "@fpfe-group/email-editor-ai";
```

| 导出项           | 签名                                 | 说明                       |
| ---------------- | ------------------------------------ | -------------------------- |
| `documentToMjml` | `(doc: EmailDocument) => string`     | 将文档序列化为 MJML 字符串 |
| `mjmlToDocument` | `(mjml: string) => EmailDocument`    | 将 MJML 字符串解析为文档   |
| `compileMjml`    | `(mjml: string) => { html: string }` | 将 MJML 编译为 HTML        |

## 节点工厂函数

```ts
import {
  createDefaultDocument,
  createSection,
  createColumn,
  createText,
  createImage,
  createButton,
  createDivider,
  createSpacer,
  createSocial,
  createHero,
  createWrapper,
} from "@fpfe-group/email-editor-ai";
```

| 工厂函数                           | 说明                                  |
| ---------------------------------- | ------------------------------------- |
| `createDefaultDocument()`          | 创建包含 body 的空文档                |
| `createSection(children?, attrs?)` | 创建 `mj-section`，可带 columns       |
| `createColumn(children?, attrs?)`  | 创建 `mj-column`，可带内容            |
| `createText(html?, attrs?)`        | 创建 `mj-text`，可带内容              |
| `createImage(attrs?)`              | 创建 `mj-image`，包含 src、alt 等属性 |
| `createButton(text?, attrs?)`      | 创建带 label 和 link 的 `mj-button`   |
| `createDivider(attrs?)`            | 创建 `mj-divider` 水平线              |
| `createSpacer(attrs?)`             | 创建 `mj-spacer` 垂直间距             |
| `createSocial(elements?, attrs?)`  | 创建带社交链接的 `mj-social`          |
| `createHero(children?, attrs?)`    | 创建全宽 `mj-hero` 区域               |
| `createWrapper(children?, attrs?)` | 创建 `mj-wrapper` 包裹区块            |

## 树工具函数

```ts
import {
  findNode,
  findParent,
  removeNode,
  moveNode,
  cloneSubtree,
} from "@fpfe-group/email-editor-ai";
```

| 工具函数       | 签名                                           | 说明                     |
| -------------- | ---------------------------------------------- | ------------------------ |
| `findNode`     | `(root, id) => EmailNode \| null`              | 根据 ID 在树中查找节点   |
| `findParent`   | `(root, id) => EmailNode \| null`              | 查找节点的父节点         |
| `removeNode`   | `(root, id) => boolean`                        | 从树中删除节点           |
| `moveNode`     | `(root, id, targetParentId, index) => boolean` | 将节点移动到新位置       |
| `cloneSubtree` | `(node) => EmailNode`                          | 深拷贝节点及其全部子节点 |

## 常量

```ts
import {
  DEFAULT_THEME,
  STATIC_BLOCKS,
  CONTENT_NODE_TYPES,
  CONTAINER_NODE_TYPES,
  SELF_CLOSING_NODE_TYPES,
} from "@fpfe-group/email-editor-ai";
```

| 常量                      | 类型                    | 说明                        |
| ------------------------- | ----------------------- | --------------------------- |
| `DEFAULT_THEME`           | `Required<ThemeConfig>` | 25 个主题默认值             |
| `STATIC_BLOCKS`           | `BlockDefinition[]`     | 43 个内置区块定义           |
| `CONTENT_NODE_TYPES`      | `EmailNodeType[]`       | 带 `htmlContent` 的节点类型 |
| `CONTAINER_NODE_TYPES`    | `EmailNodeType[]`       | 带 `children` 的节点类型    |
| `SELF_CLOSING_NODE_TYPES` | `EmailNodeType[]`       | 没有内容或子节点的类型      |

## 类型守卫

```ts
import { isNewEditorJson } from "@fpfe-group/email-editor-ai";
```

| 导出项                  | 说明                                             |
| ----------------------- | ------------------------------------------------ |
| `isNewEditorJson(data)` | 如果数据符合 `EmailDesignJson` 格式，返回 `true` |

## 类型（TypeScript）

所有类型都可以通过 `import type` 引入：

```ts
import type {
  EmailDocument,
  EmailNode,
  EmailNodeType,
  NodeId,
  EmailHeadAttributes,
  EmailDesignJson,
  BlockDefinition,
  BlockCategory,
  BlockCategoryDefinition,
  PropertyDefinition,
  PropertyType,
  ThemeConfig,
  Plugin,
  PluginContext,
  EditorEventMap,
  EmailEditorAPI,
  ToolbarAction,
  SidebarPanel,
  DevicePreset,
  DragSource,
  DropTarget,
  DropPosition,
} from "@fpfe-group/email-editor-ai";
```
