# 事件参考

事件通过命令式 API（`editor.value.on()`）访问，不使用 Vue 的 `@event` 语法。

## 事件映射

```ts
interface EditorEventMap {
  'editor:ready': { document: EmailDocument }
  'editor:change': { document: EmailDocument }
  'node:selected': { nodeId: NodeId; node: EmailNode }
  'node:deselected': { nodeId: NodeId }
  'node:deleted': { nodeId: NodeId }
  'node:moved': { nodeId: NodeId; fromParentId: NodeId; toParentId: NodeId }
  'node:duplicated': { originalId: NodeId; newId: NodeId }
  'block:dropped': { blockId: string; parentId: NodeId }
  'history:undo': { canUndo: boolean; canRedo: boolean }
  'history:redo': { canUndo: boolean; canRedo: boolean }
  'property:changed': { nodeId: NodeId; key: string; value: string }
}
```

## 用法

```ts
editor.value.on('editor:change', ({ document }) => {
  console.log('Changed')
})

const handler = (payload) => { /* ... */ }
editor.value.on('node:selected', handler)
editor.value.off('node:selected', handler)
```

## 事件说明

| 事件 | 触发时机 |
| ----- | -------- |
| `editor:ready` | 编辑器 mount 并完成初始化 |
| `editor:change` | 任意文档变更 |
| `node:selected` | 用户点击节点或调用 `selectNode()` |
| `node:deselected` | 选区被清空 |
| `node:deleted` | 节点被删除 |
| `node:moved` | 节点通过拖拽或上移/下移改变父节点或位置 |
| `node:duplicated` | 节点被复制 |
| `block:dropped` | 侧边栏区块被拖放到 canvas |
| `history:undo` | 执行撤销 |
| `history:redo` | 执行重做 |
| `property:changed` | 通过属性面板更新属性 |

更多示例请查看 [事件指南](/guide/events)。
