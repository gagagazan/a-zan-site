# a-zan-site

[![CI](https://github.com/gagagazan/a-zan-site/actions/workflows/ci.yml/badge.svg)](https://github.com/gagagazan/a-zan-site/actions/workflows/ci.yml)

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

## 文章图片

正文图片放在 `src/assets/images/blog/<文章名>/`，在 Markdown 中使用相对路径：

```markdown
![图片说明](../../assets/images/blog/<文章名>/photo.jpg)
```

构建时自动生成 WebP、响应式尺寸和宽高属性。第一张图片立即加载，其余懒加载；PNG 截图使用较高质量以保持文字清晰。图片尺寸提示按博客正文宽度设置，相关规则见 `src/plugins/remark-blog-images.mjs`。

需要图片说明时，可以保留 `<figure>` 和 `<figcaption>`，在其中使用 Markdown 图片语法，并在图片前后留空行。普通 HTML `<img>` 不参与优化。

`public/images/` 中的旧图片保留用于兼容已有地址；新文章优先使用 `src/assets/`。

## 开发约定

项目开发约定见 `AGENTS.md`。
