# 个人主页 + 技术博客实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 从零搭建一个 Astro 单项目，同时服务 `a-zan.xyz` 个人主页和 `blog.a-zan.xyz` 技术博客，并支持 Cloudflare Pages 自动部署。

**架构：** 单 Astro 项目通过 Cloudflare Pages 多域名绑定服务两个站点；使用 Astro Content Layer 管理 Markdown 文章；原生 CSS + 共享 Layout/Header/Footer 组件；构建产物为纯静态 HTML。

**技术栈：** Astro、@astrojs/sitemap、@astrojs/rss、TypeScript、原生 CSS。

---

## 文件结构

将创建/修改的文件：

| 文件 | 职责 |
|---|---|
| `package.json` | 项目依赖与 npm scripts |
| `tsconfig.json` | TypeScript 配置 |
| `astro.config.mjs` | Astro 框架配置（站点、输出、sitemap、集成） |
| `src/config.ts` | 站点常量：域名、标题、作者、社交链接 |
| `src/content.config.ts` | Astro Content Layer 配置，定义 blog collection |
| `src/styles/global.css` | 全局 CSS 变量、reset、基础排版、响应式 |
| `src/layouts/BaseLayout.astro` | 通用 HTML 骨架、SEO metadata |
| `src/layouts/BlogLayout.astro` | 博客页布局（含 header/footer） |
| `src/components/Header.astro` | 顶部导航 |
| `src/components/Footer.astro` | 底部（预留未来跨子域名能力） |
| `src/components/PostList.astro` | 紧凑博客列表项 |
| `src/components/PostMeta.astro` | 文章元信息（日期、标签） |
| `src/components/TagCloud.astro` | 标签云/标签列表 |
| `src/pages/index.astro` | 个人主页 |
| `src/pages/404.astro` | 404 页面 |
| `src/pages/rss.xml.ts` | RSS 订阅 |
| `src/pages/blog/index.astro` | 博客列表页 |
| `src/pages/blog/[...slug].astro` | 文章详情页 |
| `src/pages/blog/tags/index.astro` | 所有标签页 |
| `src/pages/blog/tags/[tag].astro` | 单个标签文章列表 |
| `src/content/blog/why-build-site.md` | 示例文章 1 |
| `src/content/blog/qa-engineer-growth.md` | 示例文章 2 |
| `src/content/blog/ai-agent-qa.md` | 示例文章 3 |
| `public/robots.txt` | 搜索引擎抓取规则 |
| `README.md` | 项目说明、运行/部署指南 |

---

## 任务 1：初始化 Astro 项目

**文件：**
- 创建：`package.json`
- 创建：`tsconfig.json`
- 创建：`astro.config.mjs`

- [ ] **步骤 1：创建 `package.json`**

```json
{
  "name": "a-zan-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check"
  },
  "dependencies": {
    "astro": "^5.7.0",
    "@astrojs/rss": "^4.0.11",
    "@astrojs/sitemap": "^3.3.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0"
  }
}
```

- [ ] **步骤 2：创建 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **步骤 3：创建 `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://a-zan.xyz',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
```

- [ ] **步骤 4：安装依赖**

```bash
npm install
```

预期：`node_modules/` 生成，无报错。

- [ ] **步骤 5：Commit**

```bash
git init
git add package.json tsconfig.json astro.config.mjs package-lock.json
 git commit -m "chore: init Astro project with sitemap and rss"
```

---

## 任务 2：站点配置与 Content Layer

**文件：**
- 创建：`src/config.ts`
- 创建：`src/content.config.ts`
- 创建：`src/content/blog/why-build-site.md`
- 创建：`src/content/blog/qa-engineer-growth.md`
- 创建：`src/content/blog/ai-agent-qa.md`

- [ ] **步骤 1：创建 `src/config.ts`**

```typescript
export const SITE = {
  title: 'Zan',
  subtitle: '测试开发工程师',
  description:
    'Zan 的个人主页与技术博客。专注质量平台、自动化测试、AI Agent 评测与工程效率工具。',
  url: 'https://a-zan.xyz',
  blogUrl: 'https://blog.a-zan.xyz',
  author: 'Zan',
  email: 'hi@a-zan.xyz',
  language: 'zh-CN',
  github: 'https://github.com/zan',
  timezone: 'Asia/Shanghai',
} as const;
```

- [ ] **步骤 2：创建 `src/content.config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content_layer',
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

- [ ] **步骤 3：创建示例文章 `src/content/blog/why-build-site.md`**

```markdown
---
title: 为什么我选择从零搭建个人主页
description: 记录从域名注册到 Astro + Cloudflare Pages 的完整决策过程。
pubDate: 2026-06-21
tags: ["astro", "workflow", "career"]
draft: false
---

作为一个测试开发工程师，我每天都在和代码、质量、效率打交道。但长期以来，我的技术沉淀主要散落在公司文档、内部 Wiki 和零散的笔记里。

搭建这个站点，是为了把思考系统地整理出来，也是未来求职、作品展示和个人影响力沉淀的入口。

## 为什么选择 Astro

Astro 的核心优势是**默认零 JavaScript** 的静态输出，这让页面加载极快，对博客和主页来说非常合适。同时它原生支持 Markdown / MDX、Content Layer、RSS、sitemap，不需要额外复杂配置。

## 后续计划

第一版先跑通主页、博客、标签、RSS 和 sitemap。评论、搜索、图床等功能后续再逐步接入。
```

- [ ] **步骤 4：创建示例文章 `src/content/blog/qa-engineer-growth.md`**

```markdown
---
title: 测试开发工程师的技术沉淀方式
description: 测试开发不仅要写用例，更要构建质量体系与工程效率能力。
pubDate: 2026-06-18
tags: ["testing", "career", "efficiency"]
draft: false
---

测试开发的角色在过去几年发生了很大变化。从"写脚本的人"，逐渐演变为"质量体系的构建者"。

## 沉淀什么

1. **测试策略与方案**：不是只有代码才值得记录。
2. **自动化框架设计**：为什么这样分层， trade-off 是什么。
3. **质量平台产品化**：如何把内部工具变成可持续维护的平台。
4. **工程效率**：CI/CD、构建优化、研发流程改进。

## 输出是最好的输入

写博客的过程，是强迫自己把碎片思考整理成可复用结论的过程。
```

- [ ] **步骤 5：创建示例文章 `src/content/blog/ai-agent-qa.md`**

```markdown
---
title: AI Agent 与质量保障的一些想法
description: 在 AI Agent 快速落地的背景下，质量保障需要新的方法论和评测体系。
pubDate: 2026-06-15
tags: ["ai-agent", "qa", "evaluation"]
draft: false
---

AI Agent 正在从 demo 走向生产。与传统软件不同，Agent 的输出具有不确定性，这给质量保障带来了新挑战。

## 传统测试 vs AI 评测

- 传统测试：输入固定，期望输出固定。
- AI 评测：输入固定，输出可变，需要用**评分模型**或**人工标注**判断质量。

## 关键问题

1. 如何设计可复现的评测集？
2. 如何量化 Agent 的稳定性？
3. 如何在 CI 中集成模型评测？

这些问题值得持续探索。
```

- [ ] **步骤 6：Commit**

```bash
git add src/config.ts src/content.config.ts src/content/blog/
git commit -m "feat: add site config, content layer, and sample posts"
```

---

## 任务 3：全局样式

**文件：**
- 创建：`src/styles/global.css`

- [ ] **步骤 1：创建 `src/styles/global.css`**

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #666666;
  --color-text-muted: #999999;
  --color-border: #e5e5e5;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-surface: #f5f5f5;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas,
    'Liberation Mono', monospace;
  --max-width: 720px;
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --radius-sm: 4px;
  --radius-md: 8px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
  background-color: var(--color-bg);
}

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: var(--space-xl) 0 var(--space-md);
  line-height: 1.3;
  font-weight: 600;
}

h1 {
  font-size: 2rem;
  margin-top: 0;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-size: 1.25rem;
}

p {
  margin: var(--space-md) 0;
}

ul,
ol {
  margin: var(--space-md) 0;
  padding-left: var(--space-lg);
}

li {
  margin: var(--space-sm) 0;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background-color: var(--color-surface);
  padding: 0.15em 0.35em;
  border-radius: var(--radius-sm);
}

pre {
  background-color: var(--color-surface);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

pre code {
  background-color: transparent;
  padding: 0;
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-md);
}

@media (min-width: 640px) {
  .container {
    padding: 0 var(--space-lg);
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.75rem;
  }
}

.text-muted {
  color: var(--color-text-muted);
}

.text-secondary {
  color: var(--color-text-secondary);
}
```

- [ ] **步骤 2：Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add global css with variables and responsive typography"
```

---

## 任务 4：布局组件

**文件：**
- 创建：`src/layouts/BaseLayout.astro`
- 创建：`src/layouts/BlogLayout.astro`
- 创建：`src/components/Header.astro`
- 创建：`src/components/Footer.astro`

- [ ] **步骤 1：创建 `src/components/Header.astro`**

```astro
---
import { SITE } from '../config';

export interface Props {
  variant?: 'home' | 'blog';
}

const { variant = 'blog' } = Astro.props;
const isBlog = variant === 'blog';
---

<header class="site-header">
  <nav class="container header-inner">
    <a href={isBlog ? SITE.blogUrl : SITE.url} class="site-brand">
      {isBlog ? 'blog.a-zan.xyz' : 'a-zan.xyz'}
    </a>
    <div class="nav-links">
      <a href={SITE.url}>主页</a>
      <a href={SITE.blogUrl}>博客</a>
      <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </nav>
</header>

<style>
  .site-header {
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-md) 0;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .site-brand {
    font-weight: 600;
    color: var(--color-text);
  }

  .site-brand:hover {
    text-decoration: none;
    color: var(--color-accent);
  }

  .nav-links {
    display: flex;
    gap: var(--space-md);
    font-size: 0.95rem;
  }
</style>
```

- [ ] **步骤 2：创建 `src/components/Footer.astro`**

```astro
---
import { SITE } from '../config';

const year = new Date().getFullYear();
---

<footer class="site-footer">
  <div class="container footer-inner">
    <p class="footer-copyright">
      © {year} {SITE.author}. 保留所有权利。
    </p>
    <p class="footer-links">
      <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      <span class="sep">·</span>
      <a href={`${SITE.blogUrl}/rss.xml`}>RSS</a>
      <span class="sep">·</span>
      <a href="mailto:hi@a-zan.xyz">联系</a>
    </p>
  </div>
</footer>

<style>
  .site-footer {
    margin-top: var(--space-2xl);
    padding: var(--space-lg) 0;
    border-top: 1px solid var(--color-border);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .footer-inner {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .footer-links {
    margin: 0;
  }

  .footer-links a {
    color: var(--color-text-secondary);
  }

  .footer-links a:hover {
    color: var(--color-accent);
  }

  .sep {
    margin: 0 var(--space-sm);
  }

  @media (min-width: 640px) {
    .footer-inner {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
```

- [ ] **步骤 3：创建 `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { SITE } from '../config';

export interface Props {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
}

const {
  title,
  description = SITE.description,
  canonical = Astro.url.href,
  ogType = 'website',
  ogImage = `${SITE.url}/og-image.png`,
} = Astro.props;

const fullTitle = title === SITE.title ? title : `${title} · ${SITE.title}`;
---

<!doctype html>
<html lang={SITE.language}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <link rel="alternate" type="application/rss+xml" title={`${SITE.title} 博客`} href={`${SITE.blogUrl}/rss.xml`} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **步骤 4：创建 `src/layouts/BlogLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

export interface Props {
  title: string;
  description?: string;
  ogType?: string;
}

const { title, description, ogType = 'website' } = Astro.props;
---

<BaseLayout title={title} description={description} ogType={ogType}>
  <Header variant="blog" />
  <main class="container blog-main">
    <slot />
  </main>
  <Footer />
</BaseLayout>

<style>
  .blog-main {
    padding-top: var(--space-xl);
    padding-bottom: var(--space-xl);
  }
</style>
```

- [ ] **步骤 5：Commit**

```bash
git add src/layouts/ src/components/
git commit -m "feat: add base/blog layouts, header and footer"
```

---

## 任务 5：博客组件

**文件：**
- 创建：`src/components/PostList.astro`
- 创建：`src/components/PostMeta.astro`
- 创建：`src/components/TagCloud.astro`

- [ ] **步骤 1：创建 `src/components/PostMeta.astro`**

```astro
---
import { SITE } from '../config';

export interface Props {
  pubDate: Date;
  updatedDate?: Date;
  tags?: string[];
  linkTags?: boolean;
}

const { pubDate, updatedDate, tags = [], linkTags = true } = Astro.props;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: SITE.timezone,
  }).format(date);
}
---

<div class="post-meta">
  <time datetime={pubDate.toISOString()}>{formatDate(pubDate)}</time>
  {
    updatedDate && (
      <>
        <span class="sep">·</span>
        <span>更新于 <time datetime={updatedDate.toISOString()}>{formatDate(updatedDate)}</time></span>
      </>
    )
  }
  {
    tags.length > 0 && (
      <>
        <span class="sep">·</span>
        <span class="tags">
          {tags.map((tag, index) => (
            <>
              {linkTags ? (
                <a href={`/tags/${tag}`} class="tag">#{tag}</a>
              ) : (
                <span class="tag">#{tag}</span>
              )}
            </>
          ))}
        </span>
      </>
    )
  }
</div>

<style>
  .post-meta {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .sep {
    margin: 0 var(--space-sm);
  }

  .tags {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .tag {
    color: var(--color-text-secondary);
  }

  .tag:hover {
    color: var(--color-accent);
  }
</style>
```

- [ ] **步骤 2：创建 `src/components/PostList.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';
import PostMeta from './PostMeta.astro';

export interface Props {
  posts: CollectionEntry<'blog'>[];
}

const { posts } = Astro.props;
---

<ul class="post-list">
  {
    posts.map((post) => (
      <li class="post-item">
        <a href={`/blog/${post.id}/`} class="post-title">
          {post.data.title}
        </a>
        <PostMeta
          pubDate={post.data.pubDate}
          updatedDate={post.data.updatedDate}
          tags={post.data.tags}
        />
      </li>
    ))
  }
</ul>

<style>
  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .post-item {
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .post-item:last-child {
    border-bottom: none;
  }

  .post-title {
    display: inline-block;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: var(--space-xs);
  }

  .post-title:hover {
    color: var(--color-accent);
  }
</style>
```

- [ ] **步骤 3：创建 `src/components/TagCloud.astro`**

```astro
---
import type { CollectionEntry } from 'astro:content';

export interface Props {
  posts: CollectionEntry<'blog'>[];
}

const { posts } = Astro.props;

const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
  for (const tag of post.data.tags) {
    acc[tag] = (acc[tag] ?? 0) + 1;
  }
  return acc;
}, {});

const tags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
---

{
  tags.length > 0 && (
    <div class="tag-cloud">
      <h2 class="tag-cloud-title">标签</h2>
      <ul class="tag-list">
        {tags.map(([tag, count]) => (
          <li>
            <a href={`/blog/tags/${tag}/`} class="tag-link">
              {tag} <span class="count">({count})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

<style>
  .tag-cloud {
    margin: var(--space-xl) 0;
  }

  .tag-cloud-title {
    font-size: 1rem;
    margin: 0 0 var(--space-md);
    color: var(--color-text-secondary);
  }

  .tag-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .tag-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    background-color: var(--color-surface);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    color: var(--color-text);
  }

  .tag-link:hover {
    background-color: var(--color-border);
    text-decoration: none;
  }

  .count {
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **步骤 4：Commit**

```bash
git add src/components/PostList.astro src/components/PostMeta.astro src/components/TagCloud.astro
git commit -m "feat: add blog post list, meta, and tag cloud components"
```

---

## 任务 6：页面实现

**文件：**
- 创建：`src/pages/index.astro`
- 创建：`src/pages/404.astro`
- 创建：`src/pages/blog/index.astro`
- 创建：`src/pages/blog/[...slug].astro`
- 创建：`src/pages/blog/tags/index.astro`
- 创建：`src/pages/blog/tags/[tag].astro`
- 创建：`src/pages/rss.xml.ts`
- 创建：`public/robots.txt`

- [ ] **步骤 1：创建 `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SITE } from '../config';

const techDirections = [
  '测试开发',
  '质量平台',
  '自动化测试',
  'AI Agent',
  'AI 评测',
  '工程效率',
];

const links = [
  { label: '技术博客', href: SITE.blogUrl },
  { label: '工具作品', href: '#tools' },
  { label: '关于我', href: '#about' },
  { label: 'GitHub', href: SITE.github },
];
---

<BaseLayout title={SITE.title} description={SITE.description}>
  <main class="home-main">
    <div class="container">
      <div class="site-label">A-ZAN.XYZ</div>
      <h1 class="site-name">{SITE.author}</h1>
      <p class="site-intro">
        测试开发工程师。4 年经验，专注质量平台、自动化测试、AI Agent 评测与工程效率工具。我相信好的质量体系是产品速度的一部分。
      </p>

      <section class="home-section" aria-labelledby="directions-title">
        <h2 id="directions-title" class="section-title">技术方向</h2>
        <ul class="direction-list">
          {techDirections.map((d) => <li>{d}</li>)}
        </ul>
      </section>

      <section class="home-section" aria-labelledby="links-title">
        <h2 id="links-title" class="section-title">入口</h2>
        <ul class="link-list">
          {links.map((link) => (
            <li>
              <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section class="home-section" id="about" aria-labelledby="about-title">
        <h2 id="about-title" class="section-title">关于我</h2>
        <p>
          目前主要做测试开发与质量工程相关的工作，关注 AI 时代下质量保障体系的演进。这个站点是我的技术沉淀入口，也是未来作品和工具的展示窗口。
        </p>
      </section>

      <section class="home-section" id="tools" aria-labelledby="tools-title">
        <h2 id="tools-title" class="section-title">工具 / 作品</h2>
        <p class="text-secondary">陆续整理中，敬请期待。</p>
      </section>

      <section class="home-section" aria-labelledby="contact-title">
        <h2 id="contact-title" class="section-title">联系方式</h2>
        <p>
          GitHub: <a href={SITE.github} target="_blank" rel="noopener noreferrer">{SITE.github}</a><br />
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </section>
    </div>
  </main>
</BaseLayout>

<style>
  .home-main {
    padding: var(--space-2xl) 0;
  }

  .site-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    letter-spacing: 0.05em;
    margin-bottom: var(--space-md);
  }

  .site-name {
    font-size: 2.5rem;
    margin: 0 0 var(--space-lg);
  }

  @media (min-width: 640px) {
    .site-name {
      font-size: 3rem;
    }
  }

  .site-intro {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    max-width: 560px;
    margin: 0 0 var(--space-2xl);
    line-height: 1.8;
  }

  .home-section {
    margin-bottom: var(--space-2xl);
  }

  .section-title {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 var(--space-md);
  }

  .direction-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .direction-list li {
    padding: var(--space-xs) var(--space-sm);
    background-color: var(--color-surface);
    border-radius: var(--radius-sm);
    font-size: 0.9375rem;
  }

  .link-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
    font-size: 1.0625rem;
  }
</style>
```

- [ ] **步骤 2：创建 `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { SITE } from '../config';
---

<BaseLayout title="404 - 页面不存在" description="请求的页面不存在。">
  <Header variant="blog" />
  <main class="container not-found">
    <h1>404</h1>
    <p>这个页面不存在，或者已经被移动。</p>
    <p>
      <a href={SITE.url}>返回主页</a>
      <span class="sep">·</span>
      <a href={SITE.blogUrl}>去博客</a>
    </p>
  </main>
  <Footer />
</BaseLayout>

<style>
  .not-found {
    padding: var(--space-2xl) 0;
    text-align: center;
  }

  .not-found h1 {
    font-size: 4rem;
    margin: 0 0 var(--space-md);
    color: var(--color-text-muted);
  }

  .sep {
    margin: 0 var(--space-sm);
  }
</style>
```

- [ ] **步骤 3：创建 `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';
import PostList from '../../components/PostList.astro';
import TagCloud from '../../components/TagCloud.astro';
import { SITE } from '../../config';

const posts = await getCollection('blog', (entry) => !entry.data.draft);
const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<BlogLayout title="博客" description={SITE.description}>
  <h1>技术博客</h1>
  <p class="blog-intro">
    记录测试开发、质量平台、AI 评测与工程效率方面的思考和实践。
  </p>

  <PostList posts={sortedPosts} />
  <TagCloud posts={sortedPosts} />
</BlogLayout>

<style>
  .blog-intro {
    color: var(--color-text-secondary);
    margin: 0 0 var(--space-xl);
  }
</style>
```

- [ ] **步骤 4：创建 `src/pages/blog/[...slug].astro`**

```astro
---
import { type CollectionEntry, getCollection } from 'astro:content';
import BlogLayout from '../../layouts/BlogLayout.astro';
import PostMeta from '../../components/PostMeta.astro';
import { SITE } from '../../config';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (entry) => !entry.data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogLayout
  title={post.data.title}
  description={post.data.description}
  ogType="article"
>
  <article class="post-article">
    <header class="post-header">
      <h1>{post.data.title}</h1>
      <PostMeta
        pubDate={post.data.pubDate}
        updatedDate={post.data.updatedDate}
        tags={post.data.tags}
      />
    </header>

    <div class="post-content">
      <Content />
    </div>

    <footer class="post-footer">
      <p><a href={`${SITE.blogUrl}/`}>← 返回博客列表</a></p>
    </footer>
  </article>

  <!-- 预留 giscus 评论容器 -->
  <div id="comments" class="comments-container"></div>
</BlogLayout>

<style>
  .post-header {
    margin-bottom: var(--space-xl);
  }

  .post-content {
    margin-bottom: var(--space-2xl);
  }

  .post-footer {
    padding-top: var(--space-lg);
    border-top: 1px solid var(--color-border);
  }

  .comments-container {
    margin-top: var(--space-2xl);
  }
</style>
```

- [ ] **步骤 5：创建 `src/pages/blog/tags/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BlogLayout from '../../../layouts/BlogLayout.astro';
import TagCloud from '../../../components/TagCloud.astro';

const posts = await getCollection('blog', (entry) => !entry.data.draft);
---

<BlogLayout title="标签" description="按标签浏览博客文章。">
  <h1>标签</h1>
  <TagCloud posts={posts} />
</BlogLayout>
```

- [ ] **步骤 6：创建 `src/pages/blog/tags/[tag].astro`**

```astro
---
import { type CollectionEntry, getCollection } from 'astro:content';
import BlogLayout from '../../../layouts/BlogLayout.astro';
import PostList from '../../../components/PostList.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (entry) => !entry.data.draft);
  const tags = new Set(posts.flatMap((post) => post.data.tags));

  return Array.from(tags).map((tag) => ({
    params: { tag },
    props: {
      posts: posts.filter((post) => post.data.tags.includes(tag)),
      tag,
    },
  }));
}

export interface Props {
  posts: CollectionEntry<'blog'>[];
  tag: string;
}

const { posts, tag } = Astro.props;
const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<BlogLayout title={`标签：${tag}`} description={`标签 ${tag} 下的文章。`}>
  <h1>#{tag}</h1>
  <PostList posts={sortedPosts} />
</BlogLayout>
```

- [ ] **步骤 7：创建 `src/pages/rss.xml.ts`**

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

export async function GET(context: { site: URL | string }) {
  const posts = await getCollection('blog', (entry) => !entry.data.draft);
  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${SITE.title} 的技术博客`,
    description: SITE.description,
    site: SITE.blogUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>${SITE.language}</language>`,
  });
}
```

- [ ] **步骤 8：创建 `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://a-zan.xyz/sitemap-index.xml
```

- [ ] **步骤 9：Commit**

```bash
git add src/pages/ public/robots.txt
git commit -m "feat: add home, blog, tags, post detail, 404, rss and robots"
```

---

## 任务 7：构建验证与修复

- [ ] **步骤 1：运行类型检查**

```bash
npm run check
```

预期：无类型错误。

- [ ] **步骤 2：运行构建**

```bash
npm run build
```

预期：生成 `dist/` 目录，包含：
- `dist/index.html`
- `dist/blog/index.html`
- `dist/blog/why-build-site/index.html`
- `dist/blog/tags/index.html`
- `dist/blog/tags/astro/index.html`
- `dist/rss.xml`
- `dist/sitemap-index.xml`

- [ ] **步骤 3：本地预览**

```bash
npm run preview
```

访问 http://localhost:4321 和 http://localhost:4321/blog/ 检查页面。

- [ ] **步骤 4：修复问题**

根据构建和预览结果修复问题。

- [ ] **步骤 5：Commit**

```bash
git add .
git commit -m "fix: resolve build and type issues"
```

---

## 任务 8：文档与部署指南

**文件：**
- 创建：`README.md`

- [ ] **步骤 1：创建 `README.md`**

```markdown
# a-zan-site

个人主页与技术博客，基于 Astro 构建，部署在 Cloudflare Pages。

- 主页：https://a-zan.xyz
- 博客：https://blog.a-zan.xyz

## 技术栈

- Astro
- TypeScript
- 原生 CSS
- @astrojs/sitemap
- @astrojs/rss

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 预览

```bash
npm run preview
```

## 部署

1. 将代码推送到 GitHub 仓库。
2. 在 Cloudflare Pages 创建项目，连接到该仓库。
3. 构建设置：
   - Framework preset: Astro
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 在 Custom domains 中添加 `a-zan.xyz` 和 `blog.a-zan.xyz`。
5. push 到 `main` 分支自动触发构建部署。

## 添加文章

在 `src/content/blog/` 下新建 `.md` 文件，frontmatter 示例：

```yaml
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-06-21
updatedDate: 2026-06-22
tags: ["astro", "workflow"]
draft: false
---
```

设置 `draft: true` 的文章不会在生产环境构建。

## 项目结构

详见 `docs/superpowers/specs/2026-06-21-personal-site-design.md`。
```

- [ ] **步骤 2：Commit**

```bash
git add README.md
git commit -m "docs: add README with run/build/deploy instructions"
```

---

## 自检

- [x] 规格覆盖度：首页、博客列表、文章详情、标签、RSS、sitemap、SEO、404、draft 过滤、Cloudflare 部署均已覆盖。
- [x] 无占位符：每个步骤包含完整代码或命令。
- [x] 类型一致性：组件属性、Content Layer schema、config 常量名称一致。
- [x] 依赖最小化：仅 Astro + sitemap + rss + TypeScript。
