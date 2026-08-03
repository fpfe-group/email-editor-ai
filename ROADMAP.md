# Roadmap：成为主流邮件编辑器方案

## 产品定位

**胜出公式**：GrapesJS 的开源属性 + Unlayer 的功能覆盖 + Vue 3 的开发体验。

**核心信息**：「Unlayer 每月收取 $750 的能力，我们免费提供。」

## 竞品背景

|                  | 价格         | Vue 原生 | 开源 | MJML   | 自定义区块 | Merge Tags |
| ---------------- | ------------ | -------- | ---- | ------ | ---------- | ---------- |
| **我们（当前）** | 免费         | 是       | MIT  | 是     | 是（免费） | 基础能力   |
| **Unlayer**      | $250-2000/月 | Wrapper  | 否   | 否     | $750+/月   | $750+/月   |
| **Beefree**      | 付费 tiers   | 否       | 否   | 否     | 付费       | 付费       |
| **GrapesJS**     | 免费         | 否       | BSD  | Plugin | 是         | 自定义     |

**当前优势**：Vue 3 原生、MJML、TypeScript、插件系统、43 个区块、免费。

**当前短板**：DnD 仍偏基础、缺少图片上传、模板数量仍需扩充、文档站仍需完善、行内 Merge Tags 体验还不完整。

---

## Sprint A：稳定性与 E2E 测试（1 周）

_目标：在继续添加功能前建立稳固基础，避免回归。_

### A.1 组件集成测试

- [ ] `EmailEditor.spec.ts`：mount、expose API、plugins init。
- [ ] 完整工作流测试：加载模板 -> 编辑 -> 撤销 -> 导出 MJML/HTML/JSON。
- [ ] 拖拽测试：添加区块、重新排序、删除。

### A.2 Playwright E2E 测试

- [ ] 搭建 Playwright 与最小测试应用（Vue + EmailEditor）。
- [ ] 场景：打开编辑器 -> 添加文本区块 -> 编辑 -> 导出 HTML。
- [ ] 场景：加载模板 -> 修改 -> 撤销 -> 校验内容。
- [ ] 场景：移动端预览 -> 校验 iframe 宽度。
- [ ] GitHub Actions：每个 PR 运行 typecheck + vitest + playwright。

### A.3 回归保护

- [ ] Starter templates 的 MJML 导出快照测试。
- [ ] 组合区块视觉回归测试（screenshot comparison）。

---

## Sprint B：DX 与文档（1 周）

_目标：开发者应能在 10 分钟内发现、理解并接入编辑器。_

### B.1 文档站（VitePress）

- [ ] 在 `docs/` 中搭建 VitePress。
- [ ] 编写可直接复制运行的「Getting Started」指南。
- [ ] 编写带 live preview 的「Theming」指南。
- [ ] 编写包含真实示例的「Plugins」指南。
- [ ] 补齐 API 参考（从类型生成或与类型同步维护）。
- [ ] 部署到 GitHub Pages 或 Netlify。

### B.2 交互式 Playground

- [ ] 在文档中嵌入 live demo（StackBlitz 或 iframe）。
- [ ] 示例：基础用法、自定义主题、自定义插件、法语 labels。
- [ ] 在 README 中添加「Edit on StackBlitz」链接。

### B.3 Storybook（可选）

- [ ] 为每个区块补充 stories（layout、content、composite）。
- [ ] 为主题系统补充 stories。
- [ ] 为属性编辑器补充 stories。

---

## Sprint C：图片上传与 Asset Manager（1 周）

_目标：补齐最关键的生产功能。没有图片上传，很难支撑严肃生产使用。_

### C.1 上传回调

- [ ] 在 `EmailEditor` 上提供 `onImageUpload: (file: File) => Promise<string>` prop。
- [ ] 由使用方管理自己的 storage（S3、Cloudinary 等）。
- [ ] UI：图片属性编辑器中提供「Upload」按钮，并支持拖拽到字段。
- [ ] 上传过程中通过 `URL.createObjectURL` 立即预览。
- [ ] 错误处理：最大尺寸、非法格式等。

### C.2 Asset Manager

- [ ] 提供 `onBrowseAssets?: () => Promise<string>`，由使用方打开自己的素材选择器。
- [ ] 或提供 `assets?: string[]`，在内置 picker 中展示 URL 列表。
- [ ] 图片图库支持搜索、预览和选择。
- [ ] 支持已上传图片历史（session-only，或通过 callback 持久化）。

### C.3 基础图片编辑

- [ ] 裁剪比例预设（1:1、16:9、4:3）。
- [ ] 保持比例的尺寸调整。
- [ ] 强制填写 alt text（a11y）。

---

## Sprint D：高级拖拽体验（1-2 周）

_目标：拖拽体验达到 Unlayer 水平，成为用户第一眼感知到的亮点。_

### D.1 Ghost preview

- [ ] 从侧边栏拖拽时展示半透明区块 ghost。
- [ ] ghost 跟随鼠标并保持合理 offset。
- [ ] drop 后提供「放置」动画。

### D.2 更清晰的 Drop zones

- [ ] 清晰的视觉指示：区块间蓝色线、列内高亮区域。
- [ ] 接近 drop 区域时显示 snap guides。
- [ ] 无效 drop 区域显示红色反馈。

### D.3 从画布内拖拽

- [ ] 直接在 canvas 内通过 drag & drop 重新排序（不只依赖图层面板）。
- [ ] hover 时展示拖拽 handle（区块左侧 grip 图标）。
- [ ] 拖到边缘附近时自动滚动。

### D.4 跨列拖拽

- [ ] 将元素从一列拖到另一列。
- [ ] 通过拖拽分隔线调整列宽。

---

## Sprint E：Merge Tags 与变量（1 周）

_目标：提供杀手级免费功能。Unlayer 将这类能力放在 $750/月套餐中，我们免费提供。_

### E.1 Merge tags 系统

- [ ] 提供 `mergeTags?: MergeTag[]`，结构为 `{ name: string, value: string, category?: string }`。
- [ ] 示例：`[{ name: 'First name', value: '{{first_name}}', category: 'Contact' }]`。
- [ ] TipTap 编辑器中输入 `{{` 触发自动补全。
- [ ] Tags 在编辑器中以彩色 chips 展示。
- [ ] 行内不可编辑，可一键删除。
- [ ] 导出时 tags 保持为 MJML/HTML 中的 `{{first_name}}`。

### E.2 属性中的 Tags

- [ ] URL、alt text、src 字段也支持 Merge Tags。
- [ ] 属性输入框支持自动补全。

### E.3 带数据预览

- [ ] 提供 `mergeTagsPreviewData?: Record<string, string>`。
- [ ] 预览模式中将 tags 替换为真实值。
- [ ] 工具栏中提供 preview/edit 切换。

---

## Sprint F：专业模板库（1 周）

_目标：让模板目录看起来专业，并能激发使用欲望。_

### F.1 丰富 starter templates

- [ ] 20+ 分类模板：Newsletter、Promotion、Transactional、Event、E-commerce、SaaS。
- [ ] 每个模板使用高质量 placeholder 图片，不再使用 via.placeholder.com。
- [ ] 在面板中展示可视化 preview（自动生成 thumbnail）。

### F.2 Template management API

- [ ] `onSaveTemplate?: (template: EmailDesignJson, meta: TemplateMeta) => Promise<void>`。
- [ ] `onLoadTemplates?: () => Promise<TemplateMeta[]>`。
- [ ] 使用方负责存储，编辑器负责 UI。
- [ ] 菜单中支持「保存为模板」。

### F.3 可复用 Sections

- [ ] 任意 section 支持「保存为 section」。
- [ ] 侧边栏提供「我的 sections」面板。
- [ ] 已保存 sections 支持拖拽插入。

---

## Sprint G：条件内容与 AI hooks（1-2 周）

_目标：提供连 Unlayer 都不容易做好的一组差异化能力。_

### G.1 条件区块

- [ ] 提供 `<ConditionalBlock>` wrapper，基于 merge tag 控制显示。
- [ ] 示例：「仅当 `{{plan}}` == 'premium' 时显示」。
- [ ] UI：区块上展示条件图标，并提供配置面板。
- [ ] 导出：输出 HTML 条件注释或 ESP 专用语法。

### G.2 AI Integration hooks

- [ ] 提供 `aiProvider?: AiProvider`，接口如下：

  ```ts
  interface AiProvider {
    generateText: (prompt: string, context: string) => Promise<string>;
    generateSubjectLine?: (emailContent: string) => Promise<string[]>;
    improveText?: (text: string, instruction: string) => Promise<string>;
  }
  ```

- [ ] 在 TipTap 工具栏中提供「AI」按钮。
- [ ] 支持「生成文本」「优化」「缩短」「翻译」。
- [ ] 使用方接入自己的 provider（OpenAI、Anthropic 等）。

### G.3 深色模式邮件预览

- [ ] 工具栏中提供「Dark mode preview」开关。
- [ ] 模拟主流邮件客户端（Gmail、Apple Mail、Outlook）的深色模式渲染。
- [ ] 对深色模式下可能有问题的颜色给出视觉辅助。

---

## Sprint H：性能与 Bundle（1 周）

_目标：比 GrapesJS 更快，bundle 比 Unlayer 更小。_

### H.1 Lazy loading

- [ ] 对组合区块做 code-split，按需加载。
- [ ] CodeMirror（已完成）和 TipTap 做 code-split。
- [ ] 监控 bundle：核心包目标小于 200 KB gzip。

### H.2 Virtual scrolling

- [ ] 当区块数量 > 50（包含插件扩展）时虚拟化区块列表。
- [ ] 大文档场景下虚拟化 layers。

### H.3 Canvas 性能

- [ ] 对 MJML re-render 做 debounce（已有 300 ms，需要验证）。
- [ ] 在合适位置用 `shallowRef` 或 `markRaw` 优化 Vue re-render。
- [ ] Benchmark：50 个 sections 文档的 render 时间。

---

## Sprint I：ESP 集成（1 周）

_目标：提供独特优势：面向每个 ESP 的预配置导出。_

### I.1 导出预设

- [ ] `exportForMailchimp()`：Merge Tags 使用 `*|FNAME|*`，格式兼容。
- [ ] `exportForSendGrid()`：handlebars `{{first_name}}`。
- [ ] `exportForAWS_SES()`：template variables。
- [ ] `exportForBrevo()`：Merge Tags `{{ contact.FIRSTNAME }}`。
- [ ] 每个 preset 映射 Merge Tags，并应用对应 HTML 约束。

### I.2 ESP 文档

- [ ] 在 VitePress 文档中补充每个 ESP 的集成指南。
- [ ] 提供可复制粘贴的完整示例。

---

## Sprint J：社区与采用（持续）

### J.1 曝光

- [ ] 在 dev.to 发布「How we built a free Unlayer alternative」文章。
- [ ] 发布到 r/vuejs、HackerNews、Product Hunt。
- [ ] 在 README 中添加「Made with Vue」与「Built on MJML」徽章。
- [ ] 在文档中补充详细对比（vs Unlayer、vs GrapesJS）。
- [ ] 提供无需安装即可访问的在线 demo。

### J.2 贡献

- [ ] 完善 CONTRIBUTING.md 开发指南。
- [ ] 标记「good first issue」。
- [ ] 提供 issue 模板（Bug 反馈、功能建议）。
- [ ] 建立 Discord 或 GitHub Discussions。

### J.3 插件生态

- [ ] 官方插件：`@fpfe-group/email-editor-ai-plugin-ai`。
- [ ] 官方插件：`@fpfe-group/email-editor-ai-plugin-unsplash`（免费图片）。
- [ ] 在文档中添加「Create your own plugin」指南。
- [ ] 建立社区插件 registry。

---

## 优先级顺序

```
Sprint A（稳定性）       ← 基础，必须优先
  |
Sprint B（文档）         ← 采用与发现
  |
Sprint C（图片上传）     ← 生产使用 blocker #1
  |
Sprint D（高级 DnD）     ← 体验亮点与竞争力
  |
Sprint E（Merge Tags）   ← 免费杀手功能，对标 $750/月能力
  |
Sprint F（专业模板）     ← 让目录显得专业
  |
Sprint G（AI + 条件内容）← 独特差异化
  |
Sprint H（性能）         ← 可扩展性
  |
Sprint I（集成）         ← 企业采用
  |
Sprint J（社区）         ← 自然增长
```

## 成功指标

| 指标                 | 3 个月 | 6 个月 | 12 个月 |
| -------------------- | ------ | ------ | ------- |
| npm weekly downloads | 500    | 2,000  | 5,000+  |
| GitHub stars         | 200    | 1,000  | 3,000+  |
| 内置模板             | 20     | 50     | 100+    |
| 官方插件             | 2      | 5      | 10+     |
| 测试覆盖率           | 80%    | 90%    | 95%     |
| Lighthouse a11y      | 90+    | 95+    | 98+     |
