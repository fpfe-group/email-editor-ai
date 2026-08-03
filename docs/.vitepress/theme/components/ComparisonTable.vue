<script setup lang="ts">
const features = [
  { name: "开源（MIT）", us: true, stripo: false, unlayer: false },
  { name: "可自托管", us: true, stripo: false, unlayer: true },
  { name: "Vue 3 原生", us: true, stripo: false, unlayer: false },
  { name: "MJML 输出", us: true, stripo: false, unlayer: false },
  { name: "TypeScript", us: true, stripo: false, unlayer: true },
  { name: "无需 iframe 嵌入", us: true, stripo: false, unlayer: false },
  { name: "拖拽编辑", us: true, stripo: true, unlayer: true },
  { name: "入门模板", us: "36", stripo: "1500+", unlayer: "100+" },
  { name: "月费", us: "免费", stripo: "$125+", unlayer: "$240+" },
  { name: "插件系统", us: true, stripo: false, unlayer: true },
  { name: "i18n 支持", us: true, stripo: true, unlayer: true },
  { name: "自定义区块", us: true, stripo: false, unlayer: true },
];
</script>

<template>
  <section class="compare-section">
    <p class="compare-section__eyebrow">能力对比</p>
    <h2 class="compare-section__title">为想掌控细节的开发者而构建</h2>
    <p class="compare-section__subtitle">
      看看 Email Editor And AI 与商业方案相比有哪些差异。
    </p>

    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="compare-table__feature-col">能力</th>
            <th class="compare-table__brand-col">
              <span class="compare-table__brand">Email Editor And AI</span>
            </th>
            <th>Stripo</th>
            <th>Unlayer</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in features" :key="f.name">
            <td class="compare-table__feature">{{ f.name }}</td>
            <td class="compare-table__brand-cell">
              <template v-if="typeof f.us === 'boolean'">
                <span v-if="f.us" class="compare-check compare-check--yes">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span v-else class="compare-check compare-check--no">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </template>
              <span v-else class="compare-text compare-text--brand">{{
                f.us
              }}</span>
            </td>
            <td>
              <template v-if="typeof f.stripo === 'boolean'">
                <span v-if="f.stripo" class="compare-check compare-check--yes">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span v-else class="compare-check compare-check--no">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </template>
              <span v-else class="compare-text">{{ f.stripo }}</span>
            </td>
            <td>
              <template v-if="typeof f.unlayer === 'boolean'">
                <span v-if="f.unlayer" class="compare-check compare-check--yes">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span v-else class="compare-check compare-check--no">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              </template>
              <span v-else class="compare-text">{{ f.unlayer }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.compare-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}

.compare-section__eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.5rem;
}

.compare-section__title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.compare-section__subtitle {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  max-width: 480px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
}

.compare-table-wrap {
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  text-align: center;
}

.compare-table thead {
  background: var(--vp-c-bg-soft);
}

.compare-table th {
  padding: 1rem 1.25rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--vp-c-divider);
}

.compare-table__feature-col {
  text-align: left !important;
  min-width: 180px;
}

.compare-table__brand-col {
  min-width: 160px;
}

.compare-table__brand {
  color: var(--vp-c-brand-1);
  font-weight: 800;
  font-size: 0.9rem;
}

.compare-table td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
  vertical-align: middle;
}

.compare-table tbody tr:last-child td {
  border-bottom: none;
}

.compare-table tbody tr:hover {
  background: var(--vp-c-bg-soft);
}

.compare-table__feature {
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.compare-table__brand-cell {
  background: rgba(1, 168, 171, 0.04);
}

.compare-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.compare-check--yes {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.compare-check--no {
  color: var(--vp-c-text-3);
  background: rgba(0, 0, 0, 0.04);
}

.dark .compare-check--no {
  background: rgba(255, 255, 255, 0.04);
}

.compare-text {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.compare-text--brand {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

@media (max-width: 640px) {
  .compare-section__title {
    font-size: 1.5rem;
  }
  .compare-table {
    font-size: 0.8rem;
  }
  .compare-table th,
  .compare-table td {
    padding: 0.65rem 0.75rem;
  }
}
</style>
