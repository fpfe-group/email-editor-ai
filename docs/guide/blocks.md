# 区块

区块是邮件的构建单元。编辑器内置 **43 个预置区块**，分为 3 类。

## 布局区块（6 个）

布局区块使用 MJML section 和 column 定义邮件结构。

| 区块          | 说明                   | MJML 输出                     |
| ------------- | ---------------------- | ----------------------------- |
| 1 Column      | 单个全宽列             | `mj-section` > `mj-column`    |
| 2 Columns     | 两个等宽列（50/50）    | `mj-section` > 2x `mj-column` |
| 3 Columns     | 三个等宽列（33/33/33） | `mj-section` > 3x `mj-column` |
| 4 Columns     | 四个等宽列（各 25%）   | `mj-section` > 4x `mj-column` |
| Sidebar Left  | 33/67 分栏             | `mj-section` > 2x `mj-column` |
| Sidebar Right | 67/33 分栏             | `mj-section` > 2x `mj-column` |

## 内容区块（7 个）

内容区块是放入列中的独立元素。

| 区块    | 说明                       | MJML 标签    |
| ------- | -------------------------- | ------------ |
| Text    | 支持行内编辑的富文本       | `mj-text`    |
| Image   | 带 URL、alt 和 link 的图片 | `mj-image`   |
| Button  | CTA 按钮                   | `mj-button`  |
| Divider | 水平分割线                 | `mj-divider` |
| Spacer  | 垂直空白                   | `mj-spacer`  |
| Social  | 社交媒体图标链接           | `mj-social`  |
| Hero    | 带背景图的全宽 Hero        | `mj-hero`    |

## 组合区块（30 个）

组合区块是预先设计好的「布局 + 内容」组合，是可直接使用的完整 section。

| 区块          | 会创建什么                     |
| ------------- | ------------------------------ |
| Header        | 居中 Logo 区域                 |
| Header + Nav  | Logo 与导航链接                |
| Hero Banner   | 标题、副标题和 CTA 的全宽 Hero |
| Hero Gradient | 渐变背景 Hero                  |
| Image + Text  | 左图右文双列                   |
| Text + Image  | 左文右图双列                   |
| CTA           | 居中行动召唤区域               |
| Image Grid    | 2x2 图片宫格                   |
| Features      | 三列功能亮点与图标             |
| Testimonial   | 带作者信息的引用               |
| Pricing       | 三档价格表                     |
| Promo Code    | 虚线边框促销码                 |
| Video         | 带播放按钮的视频占位           |
| Social        | 社交媒体链接区域               |
| Footer        | 完整页脚                       |
| Simple Footer | 极简退订页脚                   |
| Separator     | 装饰性分隔区域                 |
| Product Card  | 商品图、标题、价格和 CTA       |
| Notification  | 通知横幅                       |
| Statistics    | 三列数据指标                   |
| Announcement  | 公告横幅                       |
| Steps         | 编号步骤流程                   |
| Order         | 订单摘要表                     |
| FAQ           | 问答列表                       |
| Team          | 团队成员卡片                   |
| Countdown     | 活动倒计时                     |
| Review        | 星级评价与推荐语               |
| Mobile App    | iOS 和 Android 下载按钮        |

## 通过代码使用区块

### 节点工厂函数

可以使用 factory 函数在代码中创建节点：

```ts
import {
  createText,
  createImage,
  createButton,
  createSection,
  createColumn,
  createDivider,
  createSpacer,
  createSocial,
  createHero,
  createWrapper,
} from "@fpfe-group/email-editor-ai";

const text = createText("<p>Hello world</p>", {
  "font-size": "16px",
  color: "#333333",
});

const img = createImage({
  src: "https://example.com/photo.jpg",
  alt: "Product photo",
  width: "300px",
});

const btn = createButton("Shop Now", {
  href: "https://shop.example.com",
  "background-color": "#e11d48",
  color: "#ffffff",
});
```

### 通过 API 插入

```ts
const editor = ref();

editor.value.insertBlock(
  {
    id: "custom-text",
    label: "Custom Text",
    category: "content",
    icon: "Type",
    factory: () => createText("<p>Inserted programmatically</p>"),
  },
  "column-node-id",
  0
);
```

## 通过插件添加自定义区块

请查看 [插件指南](/guide/plugins)，了解如何注册自己的区块。
