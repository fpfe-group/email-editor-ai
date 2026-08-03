# API 方法

所有方法都通过 `<EmailEditor>` 组件的 template ref 访问。

```vue
<script setup>
const editor = ref()
// editor.value.getMjml()
</script>

<template>
  <EmailEditor ref="editor" />
</template>
```

## 导出

| 方法 | 返回值 | 说明 |
| ---- | ------ | ---- |
| `getDocument()` | `EmailDocument` | 获取当前文档树 |
| `setDocument(doc)` | `void` | 替换整个文档 |
| `getMjml()` | `string` | 序列化为 MJML 字符串 |
| `getHtml()` | `string` | 获取编译后的 HTML |
| `getDesignJson()` | `EmailDesignJson` | 获取持久化设计格式 |
| `loadTemplate(doc)` | `void` | 加载 `EmailDocument`，并重置历史 |

## 历史

| 方法 | 返回值 | 说明 |
| ---- | ------ | ---- |
| `undo()` | `void` | 撤销上一次改动 |
| `redo()` | `void` | 重做上一次撤销 |
| `canUndo()` | `boolean` | 当前是否可以撤销 |
| `canRedo()` | `boolean` | 当前是否可以重做 |

## 选区

| 方法 | 返回值 | 说明 |
| ---- | ------ | ---- |
| `selectNode(nodeId)` | `void` | 根据 ID 选中节点 |
| `getSelectedNode()` | `EmailNode \| null` | 获取当前选中节点 |
| `clearSelection()` | `void` | 清空当前选区 |

## 操作

| 方法 | 返回值 | 说明 |
| ---- | ------ | ---- |
| `deleteNode(nodeId)` | `void` | 从文档中删除节点 |
| `duplicateNode(nodeId)` | `NodeId \| null` | 复制节点，返回新 ID |
| `insertBlock(block, parentId, index?)` | `NodeId \| null` | 插入区块定义 |
| `updateNodeAttribute(nodeId, key, value)` | `void` | 更新单个 MJML 属性 |

## 事件

| 方法 | 返回值 | 说明 |
| ---- | ------ | ---- |
| `on(event, handler)` | `void` | 订阅编辑器事件 |
| `off(event, handler)` | `void` | 取消事件订阅 |

## TypeScript 接口

```ts
interface EmailEditorAPI {
  getDocument: () => EmailDocument
  setDocument: (doc: EmailDocument) => void
  getMjml: () => string
  getHtml: () => string
  getDesignJson: () => EmailDesignJson
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  selectNode: (nodeId: NodeId) => void
  getSelectedNode: () => EmailNode | null
  clearSelection: () => void
  deleteNode: (nodeId: NodeId) => void
  duplicateNode: (nodeId: NodeId) => NodeId | null
  insertBlock: (block: BlockDefinition, parentId: NodeId, index?: number) => NodeId | null
  updateNodeAttribute: (nodeId: NodeId, key: string, value: string) => void
  loadTemplate: (template: EmailDocument) => void
  on: <K extends keyof EditorEventMap>(event: K, handler: (payload: EditorEventMap[K]) => void) => void
  off: <K extends keyof EditorEventMap>(event: K, handler: (payload: EditorEventMap[K]) => void) => void
}
```
