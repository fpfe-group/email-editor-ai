# 事件

编辑器会发出类型化事件，用于实时感知用户操作。

## 订阅事件

通过 template ref 使用命令式 API：

```vue
<script setup>
import { ref, onMounted } from "vue";
import { EmailEditor } from "@fpfe-group/email-editor-ai";
import "@fpfe-group/email-editor-ai/style.css";

const editor = ref();

onMounted(() => {
  editor.value.on("editor:change", ({ document }) => {
    console.log("Document changed");
    autoSave(document);
  });

  editor.value.on("node:selected", ({ nodeId, node }) => {
    console.log(`Selected: ${node.type} (${nodeId})`);
  });
});
</script>

<template>
  <EmailEditor ref="editor" />
</template>
```

## 全部事件

### `editor:ready`

编辑器完成初始化时触发一次。

```ts
editor.value.on("editor:ready", ({ document }) => {
  console.log("编辑器已就绪，节点数量：", countNodes(document.body));
});
```

| 字段       | 类型            | 说明     |
| ---------- | --------------- | -------- |
| `document` | `EmailDocument` | 初始文档 |

### `editor:change`

文档变化时触发，包括编辑、删除、移动、属性变化。

```ts
editor.value.on("editor:change", ({ document }) => {
  debouncedSave(document);
});
```

| 字段       | 类型            | 说明         |
| ---------- | --------------- | ------------ |
| `document` | `EmailDocument` | 更新后的文档 |

### `node:selected`

节点被点击或通过 API 选中时触发。

| 字段     | 类型        | 说明            |
| -------- | ----------- | --------------- |
| `nodeId` | `NodeId`    | 被选中的节点 ID |
| `node`   | `EmailNode` | 被选中的节点    |

### `node:deselected`

当前选区被清空时触发。

| 字段     | 类型     | 说明              |
| -------- | -------- | ----------------- |
| `nodeId` | `NodeId` | 上一个选中节点 ID |

### `node:deleted`

节点从文档中删除时触发。

| 字段     | 类型     | 说明            |
| -------- | -------- | --------------- |
| `nodeId` | `NodeId` | 被删除的节点 ID |

### `node:moved`

节点在文档树中移动时触发。

| 字段           | 类型     | 说明            |
| -------------- | -------- | --------------- |
| `nodeId`       | `NodeId` | 被移动的节点 ID |
| `fromParentId` | `NodeId` | 原父节点        |
| `toParentId`   | `NodeId` | 新父节点        |

### `node:duplicated`

节点被复制时触发。

| 字段         | 类型     | 说明            |
| ------------ | -------- | --------------- |
| `originalId` | `NodeId` | 源节点 ID       |
| `newId`      | `NodeId` | 复制后的节点 ID |

### `block:dropped`

从面板拖入 canvas 的区块成功放置时触发。

| 字段       | 类型     | 说明        |
| ---------- | -------- | ----------- |
| `blockId`  | `string` | 区块定义 ID |
| `parentId` | `NodeId` | 目标父节点  |

### `history:undo`

执行撤销后触发。

| 字段      | 类型      | 说明             |
| --------- | --------- | ---------------- |
| `canUndo` | `boolean` | 是否还能继续撤销 |
| `canRedo` | `boolean` | 是否可以重做     |

### `history:redo`

执行重做后触发。

| 字段      | 类型      | 说明             |
| --------- | --------- | ---------------- |
| `canUndo` | `boolean` | 是否可以撤销     |
| `canRedo` | `boolean` | 是否还能继续重做 |

### `property:changed`

通过属性面板更新节点属性时触发。

| 字段     | 类型     | 说明          |
| -------- | -------- | ------------- |
| `nodeId` | `NodeId` | 受影响节点 ID |
| `key`    | `string` | 属性名        |
| `value`  | `string` | 新属性值      |

## 取消订阅

```ts
const handler = ({ document }) => {
  /* ... */
};

editor.value.on("editor:change", handler);
editor.value.off("editor:change", handler);
```
