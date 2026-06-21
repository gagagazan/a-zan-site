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
