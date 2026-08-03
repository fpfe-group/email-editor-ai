# 贡献指南：@fpfe-group/email-editor-ai

感谢你愿意参与贡献！这份指南会帮助你快速搭建开发环境，并了解项目的协作规则。

## 开发环境

```bash
# 克隆仓库
git clone https://github.com/fpfe-group/email-editor-ai.git
cd email-editor-ai

# 安装依赖
npm install

# 运行类型检查
npm run typecheck

# 运行测试
npm test

# 构建组件库
npm run build
```

## 项目结构

```
src/
  components/         # Vue 组件（EditorShell、Canvas、Sidebar、Toolbar）
  composables/        # Vue composables（useEmailDocument、useEmailHistory 等）
  serializer/         # MJML <-> JSON 序列化
  blocks/             # 区块定义（布局、内容、组合区块）
  properties/         # 属性面板定义
  extensions/         # TipTap 扩展（merge tags）
  export/             # ESP 导出预设
  i18n/               # 翻译文件
  utils/              # 树结构工具
  types.ts            # 全部 TypeScript 类型
  labels.ts           # i18n label 接口与中文默认值
  index.ts            # 公共 API 导出
```

## 如何提交改动

### 1. 选择 Issue

- 优先选择带有 **good first issue** 标签的任务，适合第一次贡献。
- 查看 [ROADMAP.md](ROADMAP.md) 了解计划中的功能。
- 开始前请在 issue 下留言，方便其他人知道你正在处理。

### 2. 分支命名

```
feat/short-description     # 新功能
fix/short-description      # Bug 修复
docs/short-description     # 文档
perf/short-description     # 性能优化
```

### 3. 代码约定

- **TypeScript strict**：不要使用 `any`，所有导出都需要有类型。
- **Vue 3 Composition API**：组件统一使用 `<script setup lang="ts">`。
- **BEM-like CSS class**：统一使用 `ebb-` 前缀（Email Body Builder）。
- **i18n**：所有用户可见文案必须使用 `EditorLabels` 中的 label key。
- **CSS Variables**：可主题化的值统一使用 `var(--ee-*)`。
- **不要硬编码颜色**：优先使用主题 token。

### 4. Commit 信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat: add image cropping support
fix: resolve drag-and-drop offset in Firefox
docs: update plugin API documentation
perf: lazy-load TipTap extensions
test: add ESP export preset tests
```

### 5. 测试

- 新功能和 Bug 修复都需要补充测试。
- 提交前运行 `npm test`。
- 运行 `npm run typecheck` 验证类型。
- 优先覆盖 composables、serializers 和 utils。

### 6. 提交 Pull Request

- 填写 PR 模板。
- 关联对应 issue。
- UI 改动请附带前后截图。
- 确保 CI 通过（typecheck、tests、build）。

## 添加新区块

1. 在 `src/blocks/` 下合适的文件中创建 factory 函数。
2. 在 `src/labels.ts` 的 `EditorLabels` 中添加 label key。
3. 在 `DEFAULT_LABELS` 中添加中文默认值。
4. 在 `src/i18n/fr.ts` 中添加法语翻译。
5. 在 `src/blocks/block-definitions.ts` 中注册区块。

## 添加新的 ESP 预设

1. 在 `src/export/esp-presets.ts` 中创建预设。
2. 添加到 `ESP_PRESETS` 注册表。
3. 创建便捷导出函数。
4. 从 `src/index.ts` 导出。
5. 在 `src/export/__tests__/esp-presets.spec.ts` 中补充测试。

## 添加 i18n 文案

1. 在 `src/labels.ts` 的 `EditorLabels` 接口中添加 key。
2. 在 `DEFAULT_LABELS` 中添加中文默认值。
3. 在 `src/i18n/fr.ts` 中添加法语翻译。
4. 在组件中使用 `resolveLabel('key')` 或 `labels.key`。

## 创建插件

请参考 README.md 中的 [Plugin System](#) 章节，了解 `PluginContext` API。

## 问题与反馈

- 发起 [GitHub Discussion](https://github.com/fpfe-group/email-editor-ai.git)。
- 提交 [Bug Report](https://github.com/fpfe-group/email-editor-ai.git)。
- 提交 [功能建议](https://github.com/fpfe-group/email-editor-ai.git)。

## 许可证

提交贡献即表示你同意贡献内容以 MIT License 授权。
