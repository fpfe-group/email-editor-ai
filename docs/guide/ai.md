# AI 模板生成

编辑器内置 AI Chat 面板，用户可以用自然语言描述想要的邮件，并让 AI 生成完整模板。用户可以在编辑器内预览、继续调整并应用生成结果。

## 工作流程

1. 用户从侧边栏打开 AI 面板。
2. 用户描述想要的邮件，例如「为 SaaS 产品生成一封蓝色主题欢迎邮件」。
3. AI 可以先追问，也可以直接生成完整 `EmailDocument` JSON。
4. 生成模板会被编译为 HTML，并在 iframe 中预览。
5. 用户可以继续要求调整，例如「让 hero 更暗」「加一个 testimonial 区块」，满意后应用到编辑器。

## 接入方式

传入实现了 `AiProvider` 接口的 `aiProvider` prop：

```vue
<template>
  <EmailEditor
    v-model="mjml"
    :ai-provider="aiProvider"
    :merge-tags="mergeTags"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EmailEditor } from "@fpfe-group/email-editor-ai";
import type { AiProvider, MergeTag } from "@fpfe-group/email-editor-ai";

const mjml = ref("");

const mergeTags: MergeTag[] = [
  { name: "First Name", value: "{{first_name}}", category: "Contact" },
  { name: "Company", value: "{{company}}", category: "Contact" },
];

const aiProvider: AiProvider = {
  generateText: async (prompt, context) => {
    const res = await fetch("/api/ai/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });
    return (await res.json()).text;
  },

  generateTemplate: async (messages, systemPrompt) => {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, systemPrompt }),
    });
    return (await res.json()).content;
  },
};
</script>
```

## OpenAI 快速示例

下面是一个可复制的 Node.js/Express + OpenAI 后端示例。

### 1. 安装依赖

```bash
# Backend
npm install express openai cors

# Frontend
npm install @fpfe-group/email-editor-ai
```

### 2. 后端：`server.js`

```js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI chat error:", error);
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.post("/api/ai/text", async (req, res) => {
  try {
    const { prompt, context } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: context || "You are a helpful email copywriter.",
        },
        { role: "user", content: prompt },
      ],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("AI text error:", error);
    res.status(500).json({ error: "Text generation failed" });
  }
});

app.listen(3001, () =>
  console.log("AI backend running on http://localhost:3001")
);
```

### 3. 前端：Vue 组件

```vue
<template>
  <EmailEditor v-model="mjml" :ai-provider="aiProvider" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { EmailEditor } from "@fpfe-group/email-editor-ai";
import type { AiProvider } from "@fpfe-group/email-editor-ai";

const mjml = ref("");
const API_BASE = "http://localhost:3001";

const aiProvider: AiProvider = {
  generateText: async (prompt, context) => {
    const res = await fetch(`${API_BASE}/api/ai/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });
    return (await res.json()).text;
  },

  generateTemplate: async (messages, systemPrompt) => {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, systemPrompt }),
    });
    return (await res.json()).content;
  },
};
</script>
```

### 4. 启动

```bash
OPENAI_API_KEY=sk-... node server.js
```

启动后，AI Chat 面板会出现在编辑器侧边栏中。

## `AiProvider` 接口

```ts
interface AiProvider {
  /** 根据 prompt 和可选上下文生成文本 */
  generateText: (prompt: string, context?: string) => Promise<string>;

  /** 根据邮件内容生成主题建议 */
  generateSubjectLine?: (emailContent: string) => Promise<string[]>;

  /** 根据指令优化已有文本 */
  improveText?: (text: string, instruction: string) => Promise<string>;

  /** 根据多轮对话生成完整邮件模板 */
  generateTemplate?: (
    messages: AiChatMessage[],
    systemPrompt: string
  ) => Promise<string>;

  /** 流式变体：实时产出文本片段 */
  generateTemplateStream?: (
    messages: AiChatMessage[],
    systemPrompt: string
  ) => AsyncIterable<string>;
}
```

### 必需方法

| 方法           | 用途                   |
| -------------- | ---------------------- |
| `generateText` | 编辑器内的行内文本生成 |

### 可选方法

| 方法                     | 用途                               |
| ------------------------ | ---------------------------------- |
| `generateSubjectLine`    | 主题建议                           |
| `improveText`            | 「优化这段文案」类上下文动作       |
| `generateTemplate`       | AI Chat 面板中的完整模板生成       |
| `generateTemplateStream` | AI Chat 面板中的流式生成，体验更好 |

如果没有提供 `generateTemplate` 或 `generateTemplateStream`，AI Chat 面板会隐藏。

## `generateTemplate` 应该返回什么？

`generateTemplate` 和 `generateTemplateStream` 需要返回 AI 响应的**原始文本**。你不需要自己解析 JSON。

编辑器会自动处理：

- 从 AI 响应中提取 JSON，即使 JSON 被 markdown code fence 或说明文字包裹。
- 修复常见格式问题，例如尾逗号、截断输出。
- 补齐缺失字段，例如 `version`、`headAttributes`、`children`。
- 重新生成非法节点 ID。
- 第一次解析失败时，自动要求 AI 只重新发送原始 JSON。

因此后端只需要把 AI 的响应文本原样转发给编辑器。

## 后端模型示例

### OpenAI

```bash
npm install openai
```

```js
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/ai/chat", async (req, res) => {
  const { messages, systemPrompt } = req.body;
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });
  res.json({ content: completion.choices[0].message.content });
});
```

### Anthropic Claude

```bash
npm install @anthropic-ai/sdk
```

```js
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post("/api/ai/chat", async (req, res) => {
  const { messages, systemPrompt } = req.body;
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: systemPrompt,
    messages,
  });
  res.json({ content: response.content[0].text });
});
```

### Google Gemini

```bash
npm install @google/generative-ai
```

```js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/ai/chat", async (req, res) => {
  const { messages, systemPrompt } = req.body;
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1].content;
  const result = await chat.sendMessage(lastMessage);
  res.json({ content: result.response.text() });
});
```

## 测试用 Mock Provider

开发、单元测试或 demo 中可以使用 mock provider，避免消耗 API 额度：

```ts
import type { AiProvider } from "@fpfe-group/email-editor-ai";

const mockAiProvider: AiProvider = {
  generateText: async (prompt) => {
    await new Promise((r) => setTimeout(r, 500));
    return `Generated text for: "${prompt.slice(0, 50)}..."`;
  },

  improveText: async (text) => {
    await new Promise((r) => setTimeout(r, 500));
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  generateTemplate: async () => {
    await new Promise((r) => setTimeout(r, 1000));
    return JSON.stringify({
      version: "1.0",
      headAttributes: { subject: "Test Email" },
      children: [
        {
          type: "mj-section",
          attributes: { "background-color": "#ffffff", padding: "20px" },
          children: [
            {
              type: "mj-column",
              attributes: {},
              children: [
                {
                  type: "mj-text",
                  attributes: { "font-size": "24px", align: "center" },
                  content: "<p>Welcome!</p>",
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
```

```vue
<EmailEditor v-model="mjml" :ai-provider="mockAiProvider" />
```

## 错误处理

生产环境中建议为 AI 请求加入超时、状态码处理和网络错误提示：

```ts
const aiProvider: AiProvider = {
  generateText: async (prompt, context) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const res = await fetch("/api/ai/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context }),
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 429) throw new Error("请求过于频繁，请稍后再试。");
        throw new Error(`AI request failed (${res.status})`);
      }

      return (await res.json()).text;
    } finally {
      clearTimeout(timeout);
    }
  },
};
```

`AiProvider` 方法抛出的错误会展示在编辑器 UI 中，方便用户理解发生了什么。

## 流式输出

为了更好的体验，可以实现 `generateTemplateStream`，按 chunk 返回内容：

```ts
const aiProvider: AiProvider = {
  generateText: async (prompt) => {
    /* ... */
  },

  async *generateTemplateStream(messages, systemPrompt) {
    const response = await fetch("/api/ai/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, systemPrompt }),
    });
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  },
};
```

使用流式输出时，Chat 面板会展示实时生成缓冲区，用户能看到生成进度。

## Merge Tags

传入 `mergeTags` 后，AI 系统提示词会包含这些个性化变量，因此模型可以在模板中使用 `{{first_name}}`、`{{company}}` 等变量。

```ts
const mergeTags: MergeTag[] = [
  { name: "First Name", value: "{{first_name}}", category: "Contact" },
  { name: "Last Name", value: "{{last_name}}", category: "Contact" },
  { name: "Company", value: "{{company}}", category: "Company" },
  { name: "Unsubscribe URL", value: "{{unsubscribe_url}}", category: "System" },
];
```

## 图片附件

用户可以在消息中附加图片，例如截图、设计稿或品牌规范。AI 可以分析这些图片，从而匹配颜色、布局和视觉风格：

```ts
interface AiAttachment {
  mimeType: string; // 例如 'image/png'
  data: string; // base64 编码
  name?: string; // 原始文件名
}
```

后端需要把这些附件转发给支持多模态输入的模型，例如 Claude 或 GPT-4o。

## System Prompt

编辑器通过 `buildTemplateSystemPrompt()` 生成详细系统提示词，其中包含：

- `EmailDocument` JSON schema。
- MJML 渲染规则和约束。
- 设计指南，例如色板、字体、布局模式。
- 一个完整示例模板。
- 可用 Merge Tags（如果提供）。

可以通过 `promptPrefix` 和 `promptSuffix` 自定义提示词：

```ts
import { buildTemplateSystemPrompt } from "@fpfe-group/email-editor-ai";

const systemPrompt = buildTemplateSystemPrompt({
  mergeTags,
  promptPrefix:
    "You are the email designer for Acme Corp. Always use brand color #FF6B35.",
  promptSuffix: "Always include an unsubscribe link in the footer.",
});
```

## AI 响应解析

编辑器使用 `parseAiTemplateResponse()` 从 AI 响应中提取并校验 `EmailDocument` JSON。它支持：

- 原始 JSON。
- 被 code fence 包裹的 JSON。
- 混在自然语言说明中的 JSON。
- 尾逗号或截断输出的自动修复。
- 缺失 `version`、`headAttributes`、`children` 时自动补齐。
- 非法节点 ID 自动重新生成。

如果第一次解析失败，composable 会自动要求 AI 只重新发送原始 JSON。

## 预览与迭代流程

模板生成后：

1. 通过 `documentToMjml()` + `compileMjml()` 编译为 HTML。
2. 在 sandboxed iframe 中展示预览。
3. 用户可在 **Chat** 和 **Preview** 标签页之间切换。
4. 用户继续聊天时，AI 会收到当前预览模板作为上下文。
5. 满意后点击 **应用** 加载到编辑器。

这个迭代流程可以避免把未完成的模板直接应用到当前编辑器内容中。

## 自定义 AI Labels

通过 `labels` prop 覆盖 AI 相关文案：

```ts
const labels = {
  ai_chat: "AI 助手",
  ai_chat_placeholder: "描述你想要的邮件...",
  ai_chat_send: "发送",
  ai_chat_apply: "应用",
  ai_chat_discard: "放弃",
  ai_chat_preview: "预览",
  ai_chat_generating: "生成中...",
  ai_chat_error: "生成失败",
  ai_chat_retry: "重试",
};
```

完整 label 列表请查看 [国际化](/guide/i18n)。
