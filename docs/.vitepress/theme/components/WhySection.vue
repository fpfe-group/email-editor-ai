<script setup lang="ts">
const reasons = [
  {
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    title: '真正的 Vue 3 组件',
    description: '不是包在旧 jQuery 库外面的 wrapper，而是基于 Vue 3 Composition API、响应式 props 和 TypeScript 从头构建。',
  },
  {
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    title: '底层基于 MJML',
    description: '生成清晰的 MJML 标记，并编译为稳定 HTML，让邮件在 Gmail、Outlook、Apple Mail 等常见客户端中可靠渲染。',
  },
  {
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    title: '无供应商锁定',
    description: 'MIT License，可自托管，无追踪。代码、数据和部署都掌握在你手里，也能替代需要持续付费的 SaaS 方案。',
  },
]
</script>

<template>
  <section class="why-section">
    <p class="why-section__eyebrow">为什么选择它</p>
    <h2 class="why-section__title">从架构开始就不一样</h2>
    <p class="why-section__subtitle">
      很多邮件编辑器要么是笨重的 iframe，要么绑定在 SaaS 平台里。
      这个编辑器是你真正可以掌控的 Vue 3 原生组件。
    </p>

    <div class="why-section__grid">
      <div v-for="(reason, i) in reasons" :key="i" class="why-card">
        <div class="why-card__icon" v-html="reason.icon" />
        <h3 class="why-card__title">{{ reason.title }}</h3>
        <p class="why-card__desc">{{ reason.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-section {
  max-width: 1152px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}

.why-section__eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.why-section__title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.why-section__subtitle {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  max-width: 520px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.why-section__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.why-card {
  padding: 2rem 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-align: left;
  transition: all 0.3s ease;
}

.why-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(1, 168, 171, 0.1);
  border-color: var(--vp-c-brand-1);
}

.why-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 1.25rem;
}

.why-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.why-card__desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .why-section__grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .why-section__title {
    font-size: 1.5rem;
  }
}
</style>
