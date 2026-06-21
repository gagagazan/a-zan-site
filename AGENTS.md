# 项目 Agent 指令

## 项目约定

- 这是基于 Astro 5、TypeScript 和原生 CSS 的静态个人站。
- 使用 npm 和现有 `package-lock.json`，不要引入其他包管理器。
- 优先沿用现有组件、布局、内容集合和样式变量，不做无关重构。
- 规范站点域名是 `https://a-zan.xyz`，博客位于 `https://a-zan.xyz/blog/`。

## 开发与验证

- 安装依赖：`npm ci`
- 本地开发：`npm run dev`
- 类型与内容检查：`npm run check`
- 生产构建：`npm run build`
- 修改代码、配置或文章后，至少运行与改动相关的检查；发布前必须运行完整构建。

## 内容规则

- 博客文章位于 `src/content/blog/`，使用 Markdown 和现有 frontmatter schema。
- `draft: true` 只会阻止生产构建；仓库公开后，已提交的草稿源码仍对外可见。
- 不要擅自改写文章观点、语气或个人信息。内容修改应保持范围清晰。

## 安全与发布

- 不得提交 token、cookie、私钥、密码、`.env*`、`.dev.vars*` 或 Cloudflare 本地状态。
- GitHub Actions 只负责检查和构建；Cloudflare Pages Git 集成负责部署。
- 修改 DNS、Pages、Redirect Rules 或 GitHub 仓库设置前，先读取现状并保留无关配置。
- 不得删除或覆盖邮件 MX、SPF、DKIM、DMARC 以及其他业务子域记录。
