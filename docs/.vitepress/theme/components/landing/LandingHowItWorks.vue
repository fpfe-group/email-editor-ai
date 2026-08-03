<template>
  <section class="hiw">
    <div class="hiw__inner">
      <p class="hiw__eyebrow">快速开始</p>
      <h2 class="hiw__title">3 步接入并运行</h2>
      <p class="hiw__subtitle">
        Drop it into your Vue app and start building emails instantly.
      </p>

      <div class="hiw__grid">
        <!-- Step 1 -->
        <div class="hiw__card">
          <span class="hiw__num">01</span>
          <h3 class="hiw__card-title">安装依赖包</h3>
          <div class="hiw__code">
            <code>npm i @fpfe-group/email-editor-ai</code>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="hiw__card">
          <span class="hiw__num">02</span>
          <h3 class="hiw__card-title">导入组件</h3>
          <div class="hiw__code">
            <code>&lt;EmailEditor :templates=&quot;templates&quot; /&gt;</code>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="hiw__card">
          <span class="hiw__num">03</span>
          <h3 class="hiw__card-title">定制并发送</h3>
          <p class="hiw__card-desc">
            Choose a template, customize it visually, export responsive HTML.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hiw {
  background: #111827;
  padding: 96px 72px;
}

.hiw__inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.hiw__eyebrow {
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #01a8ab;
  margin-bottom: 16px;
}

.hiw__title {
  font-family: "Newsreader", Georgia, serif;
  font-size: 42px;
  font-weight: 500;
  letter-spacing: -1px;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.15;
}

.hiw__subtitle {
  font-family: "Inter", sans-serif;
  font-size: 17px;
  font-weight: 400;
  color: #94a3b8;
  margin-bottom: 48px;
  line-height: 1.6;
}

.hiw__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.hiw__card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 32px;
  text-align: left;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.hiw__card:hover {
  transform: translateY(-4px);
  border-color: #01a8ab;
}

.hiw__num {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 32px;
  font-weight: 700;
  color: #01a8ab;
  margin-bottom: 16px;
}

.hiw__card-title {
  font-family: "Inter", sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  line-height: 1.3;
}

.hiw__card-desc {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.6;
}

.hiw__code {
  background: #0f172a;
  border-radius: 8px;
  padding: 16px 20px;
  overflow-x: auto;
}

.hiw__code code {
  font-family: "JetBrains Mono", monospace;
  font-size: 13px;
  font-weight: 400;
  color: #01a8ab;
  white-space: nowrap;
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .hiw {
    padding: 64px 32px;
  }
  .hiw__grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }
  .hiw__title {
    font-size: 32px;
  }
}

@media (max-width: 640px) {
  .hiw {
    padding: 48px 16px;
  }
  .hiw__title {
    font-size: 28px;
  }
}
</style>
