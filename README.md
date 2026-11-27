# Policy Pages · 静态协议页面编辑器

使用浏览器编写隐私政策、用户协议或技术支持页面，实时预览、导出独立 HTML，并通过 GitHub Pages 免费发布。无需购买域名、服务器或安装构建工具。

[打开编辑器](https://liubdev.github.io/app-policies/editor.html) · [查看发布指南](docs/hosting-guide.md) · [Demo 页面](https://liubdev.github.io/app-policies/Demo-privacy.zh-Hans.html)

## 功能

- 私密草稿：编辑内容保存在当前浏览器，不会上传到服务器。
- 独立导出：下载不依赖本项目的 HTML 文件，可放进任意 GitHub 仓库。
- 简单目录：自动扫描根目录中的 `<产品>-<类型>.<语言>.html` 页面。
- 可定制外观：调整标题、强调色、正文宽度和页脚。
- 配置备份：支持 JSON 配置的导入和导出。
- 零构建部署：纯 HTML、CSS 和 JavaScript，可直接托管到 GitHub Pages。

## 快速开始

1. Fork 或使用本仓库作为模板。
2. 打开仓库地址上的 `editor.html`，例如 `https://<用户名>.github.io/<仓库>/editor.html`。
3. 选择页面类型和语言，填写实际产品、数据处理方式和联系渠道。
4. 点击“下载网页”，将生成的 HTML 提交到自己的仓库。
5. 在仓库的 **Settings → Pages** 中启用 Pages。开发者无需购买域名；仓库会获得免费的 `github.io` 地址。

每次修改政策后，请更新生效或更新日期，并在应用商店中核对公开链接仍可访问。

## 目录

<!-- POLICY-LIST:START -->
- **Demo**：隐私政策： [简体中文](Demo-privacy.zh-Hans.html) ｜ 用户协议： 暂无 ｜ 技术支持： 暂无
<!-- POLICY-LIST:END -->

由 `node generate_readme.mjs` 执行目录更新：

```bash
node generate_readme.mjs
node generate_readme.mjs --check
```

目录扫描规则：根目录中的 `<产品>-privacy.<语言>.html`、`<产品>-user-agreement.<语言>.html` 和 `<产品>-support.<语言>.html`。

## 本地使用

```text
index.html             发布目录
editor.html            可视化编辑器
styles.css             编辑器及目录样式
app.js                 草稿、预览、导入导出与 HTML 生成
Demo-privacy.zh-Hans.html  虚构演示页面
generate_readme.mjs    更新目录和 README 列表
```

直接打开 `editor.html` 即可使用。需要通过浏览器在文件地址中使用时，导入/导出和部分浏览器能力可能受限；若需完整体验，可运行任意本地静态服务器：

```bash
python3 -m http.server 4173
```

然后访问 `http://localhost:4173/editor.html`。

## 重要说明

本项目提供页面排版和发布框架，不提供法律意见，也不保证任何地区的合规性。示例内容和骨架只用于编辑，发布前必须根据真实产品、SDK、数据流、运营主体和适用法律逐项核对。

## 贡献

欢迎提交页面、翻译、修复和无依赖的界面改进。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。不要提交真实用户数据、密钥、未授权法律文本或无权公开的内容。

## 许可证

[MIT License](LICENSE)。
