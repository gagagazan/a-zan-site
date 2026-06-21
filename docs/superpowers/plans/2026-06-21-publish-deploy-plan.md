# 个人站发布与部署实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将当前 Astro 个人站安全发布到公开 GitHub 仓库，并配置 GitHub Actions、Cloudflare Pages、主域名及两个跳转域名。

**架构：** GitHub Actions 只验证代码，Cloudflare Pages 的 Git 集成负责 `main` 生产部署和 PR 预览。`a-zan.xyz` 是唯一内容域名，`www.a-zan.xyz` 和 `blog.a-zan.xyz` 在 Cloudflare 边缘执行 301 跳转。

**技术栈：** Astro 5、TypeScript、npm、GitHub Actions、Cloudflare Pages、Cloudflare DNS/Redirect Rules

---

## 文件结构

- 修改 `.gitignore`：排除凭证、Cloudflare 本地状态和 Agent 本地目录。
- 创建 `.nvmrc`：统一本地、CI 和 Cloudflare 构建的 Node.js 主版本。
- 创建 `AGENTS.md`：记录本仓库的开发、内容和安全约定。
- 创建 `.github/workflows/ci.yml`：对 push 和 Pull Request 执行可复现构建。
- 修改 `README.md`：准确记录公开仓库、规范 URL、CI 和 Pages 配置。
- 修改 `src/config.ts`：将博客规范 URL 改为主域名下的 `/blog`。
- 修改本计划文件：逐步更新执行状态。

### 任务 1：整理仓库元数据和安全边界

**文件：**
- 修改：`.gitignore`
- 创建：`.nvmrc`
- 创建：`AGENTS.md`
- 修改：`README.md`

- [x] **步骤 1：扩展忽略规则**

加入 `.env*`、`.dev.vars*`、`.wrangler/`、`coverage/`、`.claude/`、`.codex/` 和 `.agents/`，保留示例环境文件的显式例外。

- [x] **步骤 2：固定 Node.js 版本**

创建 `.nvmrc`，内容为：

```text
24
```

- [x] **步骤 3：增加项目级 Agent 约定**

`AGENTS.md` 明确使用 npm、Astro 静态输出、检查命令、文章 frontmatter、公开草稿风险、规范域名和不得提交凭证。

- [x] **步骤 4：更新 README**

README 记录 `https://a-zan.xyz/blog/` 为博客规范地址，并说明公开源码中的草稿仍可见、GitHub Actions 验证流程和 Cloudflare Pages 构建设置。

- [x] **步骤 5：检查忽略结果**

运行：

```bash
git status --short --ignored
git check-ignore -v .env .dev.vars .wrangler/state .claude/settings.local.json
```

预期：敏感或本地状态路径均命中 `.gitignore`，项目源文件仍正常显示。

### 任务 2：增加 CI 并统一规范 URL

**文件：**
- 创建：`.github/workflows/ci.yml`
- 修改：`src/config.ts`

- [x] **步骤 1：创建最小权限 CI**

工作流在 `main` push 和 Pull Request 上运行，设置 `contents: read`，使用 `.nvmrc` 与 npm 缓存，执行：

```yaml
- run: npm ci
- run: npm run check
- run: npm run build
```

- [x] **步骤 2：修改博客规范 URL**

将配置改为：

```ts
blogUrl: 'https://a-zan.xyz/blog',
```

现有 Header、Footer、RSS 和文章返回链接均复用该配置，无需分散修改。

- [x] **步骤 3：升级存在 high 公告的 Astro 依赖**

`npm audit` 在原锁文件稳定复现 1 个 high；将 Astro 及现有官方集成升级到当前稳定版本，并将 Zod 导入迁移为 Astro 6 推荐的 `astro/zod`。

- [x] **步骤 4：运行本地验证**

运行：

```bash
npm ci
npm run check
npm run build
git diff --check
```

预期：所有命令退出码为 0，`dist/blog/index.html`、`dist/rss.xml` 和 `dist/sitemap-index.xml` 存在。

### 任务 3：审查并提交发布内容

**文件：**
- 包含任务 1、2 的文件
- 包含用户已修改的 `src/content/blog/build-site-first.md`
- 包含用户已修改的 `src/content/blog/from-qa-to-next-job.md`

- [x] **步骤 1：检查完整 diff 和凭证模式**

运行 `git diff --stat`、`git diff --check`，并扫描常见 token、私钥、密码和 Cloudflare Account ID 模式；不得输出发现的凭证值。

- [x] **步骤 2：分开提交基础设施与文章**

先提交仓库规范、CI、URL 和计划，再单独提交两篇用户文章，避免将内容修改隐藏在部署提交中。

- [x] **步骤 3：重新运行构建**

在最终提交状态运行 `npm run build`，预期退出码为 0。

### 任务 4：创建并推送公开 GitHub 仓库

**外部资源：**
- GitHub 仓库：`gagagazan/a-zan-site`

- [x] **步骤 1：修复 GitHub CLI 授权**

运行 `gh auth status`；若 token 失效，使用 GitHub Web 授权重新登录，再次确认活动账号为 `gagagazan` 且具有 `repo`、`workflow` 权限。

- [x] **步骤 2：确认仓库名未占用并创建公开仓库**

运行：

```bash
gh repo create gagagazan/a-zan-site --public --source=. --remote=origin
```

预期：创建空公开仓库并添加 `origin`，不生成额外 README、许可证或 `.gitignore`。

- [x] **步骤 3：推送 main**

运行：

```bash
git push -u origin main
```

预期：远程 `main` 指向本地 HEAD。

- [x] **步骤 4：读取 GitHub 状态**

确认仓库 visibility 为 `PUBLIC`、默认分支为 `main`，并等待 CI workflow 成功。

### 任务 5：创建 Cloudflare Pages 项目

**外部资源：**
- Pages 项目：`a-zan-site`
- 生产分支：`main`
- 构建命令：`npm run build`
- 产物目录：`dist`

- [x] **步骤 1：确认 Pages 项目不存在**

读取 Cloudflare Pages 项目列表；若同名项目已存在，先核对 source、build config 和 production branch，只补齐差异。

- [x] **步骤 2：通过已授权 GitHub 集成创建项目**

创建 `a-zan-site`，连接 `gagagazan/a-zan-site`，启用生产部署、PR 预览和 PR 评论，设置 Node.js 24 构建环境。

- [x] **步骤 2.5：授权 Cloudflare Pages GitHub App 访问新仓库**

在 GitHub `Settings -> Applications -> Installed GitHub Apps` 中为 Cloudflare Pages 添加 `gagagazan/a-zan-site` 仓库访问。

- [x] **步骤 3：等待首次部署并检查结果**

读取 deployment 状态和阶段日志，预期生产部署成功且 `a-zan-site.pages.dev` 可访问。

### 任务 6：配置主域名与跳转域名

**外部资源：**
- Zone：`a-zan.xyz`
- 主域名：`a-zan.xyz`
- 跳转域名：`www.a-zan.xyz`、`blog.a-zan.xyz`

- [x] **步骤 1：绑定 Pages 主域名**

向 Pages 项目添加 `a-zan.xyz`，等待验证状态变为 active；Cloudflare 自动管理其 Pages DNS 目标。

- [x] **步骤 2：准备跳转域名的代理 DNS**

将 `www.a-zan.xyz` 的 `8.8.8.8` 占位 A 记录替换为仅用于 Cloudflare 代理的记录，并为 `blog.a-zan.xyz` 创建同类记录。邮件和其他子域记录保持不变。

- [x] **步骤 3：创建或合并 Redirect Rules**

在 zone 的 `http_request_dynamic_redirect` phase 中增加两条 301：

```text
www.a-zan.xyz/<path>  -> https://a-zan.xyz/<path>
blog.a-zan.xyz/<path> -> https://a-zan.xyz/blog/<path>
```

两条规则均保留查询字符串，不覆盖现有无关规则。

- [x] **步骤 4：验证线上行为**

运行 HTTPS 请求，确认主页和博客返回 200，RSS 与 sitemap 返回 200，`www` 和 `blog` 返回 301 且 Location 正确。

### 任务 7：最终状态核对

- [x] **步骤 1：检查 Git 和 GitHub**

确认本地工作树干净、`origin/main` 与本地 HEAD 一致、CI 成功、仓库公开。

- [x] **步骤 2：检查 Cloudflare**

确认 Pages production deployment 成功、自定义域 active、DNS 仅改变获批的站点记录、跳转规则 active。

- [x] **步骤 3：记录最终证据**

汇总 commit、远程仓库 URL、CI run、Pages deployment、域名 HTTP 状态及任何仍在传播中的证书/DNS 状态。
