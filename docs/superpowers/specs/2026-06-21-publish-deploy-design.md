# 个人站发布与部署设计

## 目标

将现有 Astro 静态站发布到公开 GitHub 仓库 `gagagazan/a-zan-site`，通过 GitHub Actions 验证代码，并由 Cloudflare Pages 从 `main` 分支持续部署。

## GitHub 仓库

- 仓库设为公开。站点源码和文章内容本身面向公开访问，当前已跟踪文件未发现凭证。
- 默认分支使用 `main`，本地仓库直接推送为远程初始历史。
- 发布前补充项目级 `AGENTS.md`、安全的 `.gitignore`、准确的 `README.md` 和 GitHub Actions 工作流。
- `draft: true` 只阻止 Astro 构建文章，不会隐藏公开仓库中的 Markdown 源文；敏感草稿不得提交。

## CI 与部署

- GitHub Actions 使用固定 Node.js 主版本，依次执行 `npm ci`、`npm run check` 和 `npm run build`。
- Cloudflare Pages 直接连接 GitHub 仓库，以 `main` 为生产分支。
- Pages 构建命令为 `npm run build`，产物目录为 `dist`；Pull Request 分支生成预览部署。
- GitHub Actions 不直接调用 Wrangler 部署，避免重复部署和额外维护 Cloudflare API Token。

## 域名与路由

- `https://a-zan.xyz` 是唯一规范站点域名。
- 博客规范地址为 `https://a-zan.xyz/blog/`，站内导航、RSS 与 canonical 均使用该地址体系。
- `https://blog.a-zan.xyz/*` 通过 Cloudflare 301 跳转到 `https://a-zan.xyz/blog/*`。
- `https://www.a-zan.xyz/*` 通过 Cloudflare 301 跳转到对应的 `https://a-zan.xyz/*`。
- 替换当前 `a-zan.xyz` 和 `www.a-zan.xyz` 指向 `8.8.8.8` 的占位 DNS 记录；邮件 MX、SPF、DKIM、DMARC 及其他业务子域记录保持不变。

## 验证与失败处理

- 推送前运行 Astro 检查和完整生产构建，并检查 Git diff、忽略规则及潜在凭证。
- 推送后确认 GitHub Actions 成功、Cloudflare Pages 生产部署成功。
- 最后通过 HTTPS 检查主页、博客、RSS、sitemap、`www` 跳转和 `blog` 跳转。
- GitHub 或 Cloudflare 授权失效时停止写入操作，完成重新授权后从失败步骤继续，不回滚用户文章改动。
