# 命令式 API

可以通过 Vue template ref 以编程方式访问编辑器。编辑器通过 `defineExpose` 暴露 **18 个方法**。

## 初始化

```vue
<script setup>
import { ref } from "vue";
import { EmailEditor } from "@fpfe-group/email-editor-ai";
import "@fpfe-group/email-editor-ai/style.css";

const editor = ref();
</script>

<template>
  <EmailEditor ref="editor" />
</template>
```

之后即可通过 `editor.value` 调用方法：

```ts
const mjml = editor.value.getMjml();
```

## 导出方法

### `getDocument()`

返回当前 `EmailDocument` 树。

```ts
const doc = editor.value.getDocument();
console.log(doc.body.children.length); // section 数量
```

### `setDocument(doc)`

替换整个文档。

```ts
import { createDefaultDocument } from "@fpfe-group/email-editor-ai";
editor.value.setDocument(createDefaultDocument());
```

### `getMjml()`

返回序列化后的 MJML 字符串。

```ts
const mjml = editor.value.getMjml();
```

### `getHtml()`

返回已编译、可发送的 HTML。

```ts
const html = editor.value.getHtml();
```

### `getDesignJson()`

返回用于保存的设计格式。

```ts
const json = editor.value.getDesignJson();
localStorage.setItem("draft", JSON.stringify(json));
```

### `loadTemplate(doc)`

加载一个 `EmailDocument`，替换当前内容并重置历史记录。

```ts
const saved = JSON.parse(localStorage.getItem("draft"));
if (saved) {
  editor.value.loadTemplate(saved.document);
}
```

## 历史方法

### `undo()` / `redo()`

```ts
editor.value.undo();
editor.value.redo();
```

### `canUndo()` / `canRedo()`

```ts
if (editor.value.canUndo()) {
  editor.value.undo();
}
```

## 选区方法

### `selectNode(nodeId)`

通过代码选中节点。

```ts
editor.value.selectNode("abc123");
```

### `getSelectedNode()`

返回当前选中节点；没有选中时返回 `null`。

```ts
const node = editor.value.getSelectedNode();
if (node) {
  console.log(node.type, node.attributes);
}
```

### `clearSelection()`

清空当前选区。

```ts
editor.value.clearSelection();
```

## 操作方法

### `deleteNode(nodeId)`

从文档中删除节点。

```ts
const selected = editor.value.getSelectedNode();
if (selected) {
  editor.value.deleteNode(selected.id);
}
```

### `duplicateNode(nodeId)`

复制节点。成功时返回新节点 ID，失败时返回 `null`。

```ts
const newId = editor.value.duplicateNode("abc123");
if (newId) {
  editor.value.selectNode(newId);
}
```

### `insertBlock(block, parentId, index?)`

将一个区块定义插入到指定父节点中。

```ts
import { createText } from "@fpfe-group/email-editor-ai";

editor.value.insertBlock(
  {
    id: "my-text",
    label: "My Text",
    category: "content",
    icon: "Type",
    factory: () => createText("<p>Hello</p>"),
  },
  "column-id",
  0
);
```

### `updateNodeAttribute(nodeId, key, value)`

更新节点上的单个 MJML 属性。

```ts
editor.value.updateNodeAttribute("node-id", "background-color", "#ff0000");
editor.value.updateNodeAttribute("node-id", "padding", "20px 40px");
```

## 事件方法

### `on(event, handler)` / `off(event, handler)`

订阅或取消订阅编辑器事件。完整事件列表请查看 [事件指南](/guide/events)。

```ts
const onChange = ({ document }) => console.log("changed");
editor.value.on("editor:change", onChange);
editor.value.off("editor:change", onChange);
```

## TypeScript

完整 API 通过 `EmailEditorAPI` 接口提供类型：

```ts
import type { EmailEditorAPI } from "@fpfe-group/email-editor-ai";

const editor = ref<InstanceType<typeof EmailEditor> & EmailEditorAPI>();
```
