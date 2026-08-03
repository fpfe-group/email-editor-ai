# 插件

插件系统允许你在不修改源码的前提下扩展编辑器：添加自定义区块、分类、工具栏动作、侧边栏面板和属性编辑器。

## 创建插件

插件是一个接收 `PluginContext` 的函数：

```ts
import type { Plugin } from "@fpfe-group/email-editor-ai";

const myPlugin: Plugin = (ctx) => {
  // 使用 ctx 注册扩展
};
```

### 注册插件

```vue
<EmailEditor :plugins="[myPlugin]" />
```

插件会在 `editor:ready` 事件触发之前初始化。

## 添加自定义区块

```ts
import type { Plugin } from "@fpfe-group/email-editor-ai";
import {
  createText,
  createImage,
  createSection,
  createColumn,
} from "@fpfe-group/email-editor-ai";

const brandPlugin: Plugin = (ctx) => {
  ctx.registerBlock({
    id: "brand-signature",
    label: "Signature",
    category: "content",
    icon: "PenTool",
    factory: () =>
      createText(`
      <p style="font-size: 14px; color: #666;">
        <strong>John Doe</strong><br/>
        Product Manager at Acme Corp<br/>
        <a href="mailto:john@acme.com">john@acme.com</a>
      </p>
    `),
  });

  ctx.registerBlock({
    id: "brand-header",
    label: "Brand Header",
    category: "composite",
    icon: "Layout",
    factory: () => {
      const logo = createImage({
        src: "https://acme.com/logo.png",
        alt: "Acme Corp",
        width: "150px",
      });
      const col = createColumn([logo]);
      return createSection([col], {
        "background-color": "#1a1a2e",
        padding: "20px 0",
      });
    },
  });
};
```

## 添加区块分类

```ts
const myPlugin: Plugin = (ctx) => {
  ctx.registerBlockCategory({
    id: "brand",
    label: "Brand",
    icon: "Building",
    order: 5, // 数字越小越靠前
  });

  ctx.registerBlock({
    id: "brand-banner",
    label: "Brand Banner",
    category: "brand",
    icon: "Flag",
    factory: () => createText("<h1>Welcome to Acme</h1>"),
  });
};
```

## 添加工具栏动作

```ts
const savePlugin: Plugin = (ctx) => {
  ctx.registerToolbarAction({
    id: "save",
    label: "Save",
    icon: "Save",
    position: "right",
    order: 10,
    handler: () => {
      console.log("Saving...");
    },
  });
};
```

## 监听事件

插件可以访问完整事件系统：

```ts
const analyticsPlugin: Plugin = (ctx) => {
  ctx.on("editor:change", ({ document }) => {
    analytics.track("email_edited", {
      nodeCount: countNodes(document.body),
    });
  });

  ctx.on("node:deleted", ({ nodeId }) => {
    console.log(`Node ${nodeId} deleted`);
  });

  ctx.on("block:dropped", ({ blockId, parentId }) => {
    console.log(`Block ${blockId} dropped into ${parentId}`);
  });
};
```

## 异步插件

插件可以是异步函数，例如从远端加载自定义区块定义：

```ts
const remoteBlocksPlugin: Plugin = async (ctx) => {
  const response = await fetch("/api/custom-blocks");
  const blocks = await response.json();

  for (const block of blocks) {
    ctx.registerBlock({
      id: block.id,
      label: block.name,
      category: "custom",
      icon: block.icon || "Box",
      factory: () => createText(block.defaultHtml),
    });
  }
};
```

## 插件上下文 API

| 方法                                      | 说明                             |
| ----------------------------------------- | -------------------------------- |
| `registerBlock(block)`                    | 添加区块到「区块」面板           |
| `registerBlockCategory(category)`         | 添加新的分类标签                 |
| `registerPropertyEditor(type, component)` | 覆盖某类属性编辑器               |
| `registerToolbarAction(action)`           | 添加工具栏按钮                   |
| `registerSidebarPanel(panel)`             | 添加侧边栏标签页                 |
| `on(event, handler)`                      | 监听编辑器事件                   |
| `off(event, handler)`                     | 移除事件监听                     |
| `labels`                                  | 当前 `EditorLabels` 的响应式引用 |

## 多插件

```vue
<EmailEditor :plugins="[brandPlugin, analyticsPlugin, savePlugin]" />
```

插件按数组顺序执行。重复的 block/category ID 会被静默忽略，第一次注册优先。
