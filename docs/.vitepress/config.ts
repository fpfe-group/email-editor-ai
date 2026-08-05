import { defineConfig } from 'vitepress'
import { resolve } from 'path'
import { version } from '../../package.json';

export default defineConfig({
  title: '@fpfe-group/email-editor-ai',
  description: '面向 Vue 3 的专业可扩展拖拽式邮件编辑器，基于 MJML 构建。',
  base: '/email-editor-ai/',
  appearance: true,

  head: [
    ['link', { rel: 'icon', href: '/email-editor-ai/logo.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
    ['meta', { property: 'og:title', content: 'Email Editor And AI — 面向 Vue 3 的拖拽式邮件编辑器' }],
    ['meta', { property: 'og:description', content: '基于 MJML 的专业可扩展邮件编辑器，免费开源。' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://github.com/fpfe-group/email-editor-ai.git' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/props' },
      {
        text: `v${version}`,
        items: [
          { text: '更新日志', link: 'https://github.com/fpfe-team/email-editor-ai/releases' },
          { text: 'npm', link: 'https://www.npmjs.com/package/@fpfe-group/email-editor-ai' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '为什么选择它？', link: '/guide/why' },
          ],
        },
        {
          text: '核心能力',
          items: [
            { text: '主题定制', link: '/guide/theming' },
            { text: '国际化', link: '/guide/i18n' },
            { text: '区块', link: '/guide/blocks' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: 'AI 生成', link: '/guide/ai' },
            { text: '插件', link: '/guide/plugins' },
            { text: '事件', link: '/guide/events' },
            { text: '命令式 API', link: '/guide/imperative-api' },
          ],
        },
      ],
      '/api/': [
        {
          text: '参考',
          items: [
            { text: 'Props', link: '/api/props' },
            { text: '事件', link: '/api/events' },
            { text: 'API 方法', link: '/api/methods' },
            { text: '类型', link: '/api/types' },
            { text: '导出项', link: '/api/exports' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fpfe-group/email-editor-ai.git' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@fpfe-group/email-editor-ai' },
    ],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 MIT License 发布，©FPFE — 保留所有权利。<br>开源不易，且行且珍惜。',
    },

    editLink: {
      pattern: 'https://github.com/fpfe-group/email-editor-ai.git',
    },
  },

  vite: {
    resolve: {
      alias: {
        '@fpfe-group/email-editor-ai': resolve(__dirname, '../../src/index.ts'),
      },
    },
    optimizeDeps: {
      include: ['mjml-browser'],
    },
  },
})
