# a-zan-site

Zan 的个人主页与博客，基于 Astro 构建并部署在 Cloudflare Pages。

- 主页：<https://a-zan.xyz>
- 博客：<https://a-zan.xyz/blog/>
- RSS：<https://a-zan.xyz/rss.xml>

## 技术栈

- Astro
- TypeScript
- 原生 CSS
- @astrojs/sitemap
- @astrojs/rss

## 本地开发

```bash
nvm use
npm ci
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

GitHub Actions 会在 push 和 Pull Request 时运行：

```bash
npm ci
npm run check
npm run build
```

Cloudflare Pages 直接连接 GitHub 仓库并负责部署：

- Production branch：`main`
- Build command：`npm run build`
- Build output directory：`dist`
- Node.js：读取 `.nvmrc`

`a-zan.xyz` 是唯一内容域名。`www.a-zan.xyz` 跳转到主域名，
`blog.a-zan.xyz` 跳转到 `a-zan.xyz/blog/`。

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

> 仓库是公开的，因此已提交文章即使标记为 `draft: true`，Markdown 源码仍然公开。

## 项目结构

详见 `docs/superpowers/specs/2026-06-21-personal-site-design.md`。

项目开发约定见 `AGENTS.md`。
