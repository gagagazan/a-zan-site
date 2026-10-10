# 曲目目录字体

仅供 `bangdream-cover-song-list` 文章使用的 Noto Sans SC / JP 字符子集。
由本站 Cloudflare Pages 直接提供，读者不会连接 Google Fonts。
保留的授权文件为 `OFL-SC.txt`、`OFL-JP.txt`。

- 修改这篇文章后运行 `npm run fonts:generate`（需要连接 Google Fonts 官方接口）。
- `npm run fonts:check` 离线检查字符覆盖、文件校验和与 300,000 字节预算（字体 + CSS）。
- `npm run build` 自动执行离线检查，普通部署不需要访问字体服务。
- 生成文件名包含内容哈希；内容不变则可复用长期浏览器缓存。
- `src/styles/song-catalog-fonts.css` 和 `manifest.json` 都由脚本生成，不手工编辑。

字体生成接口使用公开文章中的文字。将来为其他文章引入字体时应单独评估字符覆盖和预算。
