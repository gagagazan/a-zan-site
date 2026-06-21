# 个人主页 + 技术博客设计方案

**日期：** 2026-06-21
**项目：** a-zan-site
**范围：** 第一版 MVP

---

## 1. 目标

为 `a-zan.xyz`（个人主页）和 `blog.a-zan.xyz`（技术博客）搭建一个纯静态 Astro 站点，作为个人品牌入口、技术沉淀平台和未来作品的统一入口。

---

## 2. 架构决策

### 2.1 单项目 vs 双项目

选择：**单 Astro 项目，双域名部署**。

原因：
- 一个仓库、一套依赖、一次构建，维护成本最低。
- 主页和博客共享布局、组件、样式变量和站点配置。
- Cloudflare Pages 可直接绑定多个自定义域名到同一个 Pages 项目，无需 Workers。
- 未来新增 `*.a-zan.xyz` 工具站时，可复用本项目的组件和样式系统。

### 2.2 域名与路由

| 请求域名 | 实际路径 | 页面 |
|---|---|---|
| `a-zan.xyz/` | `src/pages/index.astro` | 个人主页 |
| `blog.a-zan.xyz/` | `src/pages/blog/index.astro` | 博客列表 |
| `blog.a-zan.xyz/slug` | `src/pages/blog/[...slug].astro` | 文章详情 |
| `blog.a-zan.xyz/tags/tag` | `src/pages/blog/tags/[tag].astro` | 标签页 |
| `blog.a-zan.xyz/rss.xml` | `src/pages/rss.xml.ts` | RSS 订阅 |

Cloudflare Pages 按请求 Host 服务同一份静态产物，无需额外路由重写。

---

## 3. 页面设计

### 3.1 首页 `a-zan.xyz`

风格：**极简文字型**。

区块：
1. 站点标识 `A-ZAN.XYZ`
2. 姓名 `Zan`
3. 个人简介：4 年测试开发经验，专注质量平台、自动化测试、AI Agent 评测与工程效率工具。
4. 技术方向标签：测试开发、质量平台、自动化测试、AI Agent、AI 评测、工程效率。
5. 入口链接：技术博客、工具作品、关于我、GitHub。
6. 联系方式：GitHub、Email 占位。

### 3.2 博客列表页 `blog.a-zan.xyz`

风格：**紧凑列表型**。

元素：
- 每行一篇文章：日期 + 标签 + 标题。
- 点击标题进入文章详情。
- 顶部有标签云/常用标签链接。

### 3.3 文章详情页

元素：
- 标题、发布日期、更新日期（如有）、标签。
- Markdown 渲染内容。
- 返回博客列表链接。
- 底部预留评论区 DOM 容器（giscus 未来接入）。

### 3.4 标签页

- 列出所有标签及对应文章数。
- 单个标签页展示该标签下的文章列表。

### 3.5 404 页

- 简洁的 404 提示。
- 返回首页 / 博客首页链接。

---

## 4. 内容

### 4.1 文章格式

使用 Markdown，frontmatter 字段：

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

### 4.2 第一版示例文章

共 3 篇：
1. 为什么搭建个人主页和技术博客
2. 测试开发工程师的技术沉淀
3. AI Agent 与质量保障的一些想法

---

## 5. 工程结构

```
a-zan-site/
├── src/
│   ├── config.ts              # 站点常量
│   ├── content.config.ts      # Astro Content Layer 配置
│   ├── content/
│   │   └── blog/
│   │       ├── why-build-site.md
│   │       ├── qa-engineer-growth.md
│   │       └── ai-agent-qa.md
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostList.astro
│   │   ├── PostMeta.astro
│   │   └── TagCloud.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts
│   │   └── blog/
│   │       ├── index.astro
│   │       ├── [...slug].astro
│   │       └── tags/
│   │           ├── index.astro
│   │           └── [tag].astro
│   └── styles/
│       └── global.css
├── public/
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. 技术栈

- **Astro**（静态站点生成）
- **@astrojs/sitemap**
- **@astrojs/rss**
- **TypeScript**
- **原生 CSS**（CSS 变量 + 响应式）

不引入：CMS、数据库、评论系统、UI 框架、Tailwind。

---

## 7. SEO / 元数据

- `BaseLayout` 统一输出 `title`、`meta description`、`canonical`、`Open Graph`、`Twitter Card`。
- 文章页覆盖 `og:title`、`og:description`、`og:type=article`。
- 生成 `sitemap-index.xml` 和 `sitemap-0.xml`。
- 生成 `rss.xml`。

---

## 8. 部署

### 8.1 Cloudflare Pages 配置

- **Framework preset:** Astro
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** 无需特殊变量

### 8.2 域名绑定

1. 创建 Cloudflare Pages 项目，连接 GitHub 仓库 `a-zan-site`。
2. 在 Pages 项目设置 → Custom domains 中添加：
   - `a-zan.xyz`
   - `blog.a-zan.xyz`
3. 按 Cloudflare 提示配置 DNS CNAME 记录。
4. push `main` 分支自动触发构建部署。

---

## 9. 不在第一版实现

以下功能仅预留扩展点，第一版不实现：

- giscus 评论系统（仅预留 DOM 容器）
- 全文搜索
- R2 / 外部图床
- 统一 footer 脚本（用于未来子域名工具站）
- 作品集自动索引
- 阅读时长、文章系列、相关文章推荐
- 暗色模式

---

## 10. 验收标准

- [ ] `npm install` 成功
- [ ] `npm run build` 成功
- [ ] `npm run preview` 可本地预览
- [ ] 首页 `a-zan.xyz/` 正常显示
- [ ] 博客列表页 `blog.a-zan.xyz/` 显示文章
- [ ] 文章详情页正常渲染 Markdown
- [ ] 标签页可用
- [ ] RSS 可访问
- [ ] sitemap 生成
- [ ] draft 文章不在生产环境显示
- [ ] 404 页面存在

---

## 11. 设计选择记录

- 架构：单 Astro 项目，双域名部署。
- 首页风格：极简文字型。
- 博客列表风格：紧凑列表型。
- 样式方案：原生 CSS，CSS 变量管理主题。
- 内容方案：Markdown + frontmatter，Astro Content Layer 管理。
