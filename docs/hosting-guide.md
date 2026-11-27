# 使用 GitHub Pages 发布政策页面

GitHub Pages 可以托管静态 HTML 页面。GitHub Free 支持公开仓库使用 Pages；部署后可以使用 GitHub 提供的 `github.io` 地址，不需要单独购买域名或管理服务器。套餐支持范围和 Pages 使用条款可能调整，请以 GitHub 当前文档与账号设置为准。[官方发布来源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [官方自定义 Actions 部署说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 独立维护自己的页面

1. 在 GitHub 上 Fork 本项目。
2. 在仓库根目录添加自己的 HTML 页面，例如 `MyApp-privacy.zh-Hans.html`。链接应是自包含的相对路径，不依赖本地文件路径。
3. 编辑文件中的产品名称、数据处理细节、联系渠道和生效日期。检查所有示例文字、第三方 SDK 和数据类型是否与真实产品一致。
4. 打开 Fork 的 **Settings → Pages**。
5. 在 **Build and deployment** 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/(root)`，然后保存。
6. 等待 Pages 发布完成。在设置页复制站点网址，并在末尾添加页面文件名，例如 `https://<账号>.github.io/<仓库>/MyApp-privacy.zh-Hans.html`。

每次提交到所选分支后，Pages 会重新发布。修改政策后，更新页面中的生效日期并确认应用商店中保存的链接仍然有效。

## 共享本项目的目录

如果你向本项目提交页面，合并后页面会发布到本项目的 Pages 站点。可从首页目录找到链接。请注意，仓库是公开的，政策文本、邮箱和其他提交内容也会公开。公共目录由社区维护，页面作者仍需对自己的政策负责。

## 公开链接和安全

- GitHub Pages 页面是公开网页，不适合存放未公开信息、访问令牌或用户数据。
- 不要将政策页面写成“本项目已审核”或“保证合规”。项目维护者不验证应用实际的数据行为。
- 避免加入不必要的第三方脚本。提交者需对页面中的外部资源和链接负责。
- GitHub Pages 提供静态文件托管，不提供数据库、表单处理或私密内容访问控制。

## 常见问题

**Pages 设置里没有发布地址？** 确认分支和目录选对，并等待 Pages 构建完成。首次发布可能需要几分钟。

**能否使用自己的域名？** 可以，但不是必需步骤。默认 `github.io` 地址即可作为公开链接；自定义域名需要你自行注册并配置 DNS。

**应用商店是否一定接受这个链接？** 由应用商店的当前规则决定。提交前请在商店后台验证链接可访问，并核对其隐私政策要求。
