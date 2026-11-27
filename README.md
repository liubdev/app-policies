# App Policies

用 GitHub Pages 发布应用隐私政策、用户协议和支持页面。项目提供一个静态目录和浏览器编辑器，不需要后端。GitHub Pages 会提供 `https://<账号>.github.io/<仓库>/` 地址；自定义域名可选。

可以向本仓库提交政策页面，也可以 Fork 后只维护自己的文件。**提交到公共仓库的页面会公开访问**，不要加入密钥、用户数据或未经授权的内容。

## 在浏览器中编辑

打开 [`editor.html`](editor.html) 即可填写产品信息、编辑章节并查看实时预览。草稿只保存在当前浏览器，不会上传；点击“下载网页”得到独立 HTML 文件。需要在另一台设备继续编辑时，可导出并导入 JSON 配置。

## 发布自己的页面

1. Fork 本仓库，在你的 Fork 中添加政策 HTML 文件。建议按 `产品名-类型.语言.html` 命名，例如 `MyApp-privacy.zh-Hans.html`。支持类型：`privacy`、`user-agreement`、`support`。
2. 页面内容应准确反映你的应用行为。不要直接照搬示例政策；按实际数据处理情况修改，并自行确认适用的法律要求。
3. 在仓库 **Settings → Pages** 中将 **Build and deployment** 设置为 **Deploy from a branch**，选择 `main` 分支和 `/(root)` 目录并保存。
4. 等待 Pages 发布，在仓库 **Settings → Pages** 查看站点地址。提交到应用商店的链接格式为 `https://<账号>.github.io/<仓库>/<文件名>`。

详细说明见[托管指南](docs/hosting-guide.md)。GitHub Pages 是静态托管服务；公共仓库中的文件和页面可被公开访问。若你只需自己的页面，Fork 后只保留自己的页面即可。

## 本地预览与目录生成

直接在浏览器打开 `index.html` 可查看目录；每份政策页面也可单独打开。修改或添加根目录政策文件后，运行：

```bash
node generate_readme.mjs
```

这会更新 `index.html` 和 README 中的页面列表。检查生成文件是否最新：

```bash
node generate_readme.mjs --check
```

该项目不需要依赖安装、构建工具或后端。GitHub Actions 会在 Pull Request 和主分支更新时检查目录是否已同步。

## 页面索引

<!-- POLICY-LIST:START -->
- **Demo**：隐私政策：[简体中文](Demo-privacy.zh-Hans.html) ｜ 用户协议：暂无 ｜ 技术支持：暂无
<!-- POLICY-LIST:END -->

## 贡献

欢迎提交新语言、修正和易于复用的页面。请先阅读[贡献指南](CONTRIBUTING.md)，并确保内容没有误导用户或声称本项目提供法律审核。

## 免责声明

本项目仅提供静态页面托管样例与目录，不提供法律意见，也不保证页面满足任何应用商店、地区或司法辖区的要求。发布者需自行核对政策内容并对其准确性负责。

## License

MIT，详见 [LICENSE](LICENSE)。
