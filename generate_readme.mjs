import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const readmePath = path.join(root, 'README.md');
const indexPath = path.join(root, 'index.html');
const startMarker = '<!-- POLICY-LIST:START -->';
const endMarker = '<!-- POLICY-LIST:END -->';
const policyPattern = /^([A-Za-z0-9][A-Za-z0-9_-]*)-(privacy|user-agreement|support)\.([A-Za-z-]+)\.html$/;
const typeNames = { privacy: '隐私政策', 'user-agreement': '用户协议', support: '技术支持' };
const languageNames = {
  de: 'Deutsch', en: 'English', ja: '日本語', ko: '한국어',
  'zh-Hans': '简体中文', 'zh-Hant': '繁體中文',
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function discover() {
  const apps = new Map();
  for (const filename of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
    const match = policyPattern.exec(filename);
    if (!match) continue;
    const [, app, type, language] = match;
    if (!apps.has(app)) apps.set(app, new Map());
    const types = apps.get(app);
    if (!types.has(type)) types.set(type, new Map());
    types.get(type).set(language, filename);
  }
  return new Map([...apps].sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase())));
}

function appLabel(key) {
  return key.replaceAll('_', '-').split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
}

function renderCatalog(apps) {
  const cards = [];
  for (const [app, types] of apps) {
    const sections = Object.entries(typeNames).map(([type, label]) => {
      const languages = types.get(type);
      const links = languages
        ? [...languages].sort(([a], [b]) => a.localeCompare(b)).map(([language, filename]) =>
          `<a href="./${escapeHtml(filename)}">${escapeHtml(languageNames[language] ?? language)}</a>`).join('')
        : '<span class="empty">暂未提供</span>';
      return `<section><h3>${label}</h3><nav>${links}</nav></section>`;
    }).join('\n');
    cards.push(`<article>\n    <h2>${escapeHtml(appLabel(app))}</h2>\n    ${sections}\n  </article>`);
  }
  const body = cards.join('\n') || '<p>暂无协议页面。欢迎通过 Pull Request 添加。</p>';
  return `<!doctype html>
<html lang="zh-Hans">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="应用隐私政策、用户协议与支持页面">
  <title>应用政策页面目录</title>
  <style>
    :root { color-scheme: light; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #202a3b; background: #f5f7fb; }
    * { box-sizing: border-box; } body { margin: 0; padding: 64px 24px 40px; line-height: 1.65; }
    main { max-width: 880px; margin: auto; } header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin: 0 0 42px; padding-bottom: 28px; border-bottom: 1px solid #dce2ed; }
    h1 { max-width: 15ch; margin: 0; font-size: clamp(38px, 6vw, 54px); line-height: 1.08; letter-spacing: -0.035em; text-wrap: balance; }
    header p { max-width: 58ch; margin: 16px 0 0; color: #566277; font-size: 16px; }
    .edit-link { flex: none; padding: 11px 15px; border-radius: 8px; color: #fff; background: #4358c8; font-size: 14px; font-weight: 650; text-decoration: none; }
    .edit-link:hover { color: #fff; background: #3448b2; }
    .edit-link:focus-visible { outline: 3px solid #7282ed; outline-offset: 4px; }
    article { margin: 0; padding: 0; background: transparent; border: 0; border-radius: 0; }
    article h2 { margin: 0; padding: 0 0 15px; border-bottom: 2px solid #202a3b; font-size: 25px; line-height: 1.3; text-wrap: balance; }
    section { display: flex; gap: 22px; align-items: baseline; padding: 15px 0; border-bottom: 1px solid #dce2ed; }
    h3 { width: 110px; flex: none; margin: 0; color: #46546b; font-size: 15px; font-weight: 650; }
    nav { display: flex; flex-wrap: wrap; gap: 10px 22px; } a { color: #3549b7; text-underline-offset: 3px; text-decoration-thickness: 1px; } a:hover { color: #263794; text-decoration-thickness: 2px; }
    a:focus-visible { outline: 3px solid #7282ed; outline-offset: 4px; border-radius: 2px; } .empty { color: #58647a; }
    footer { margin-top: 38px; padding-top: 16px; border-top: 1px solid #dce2ed; color: #566277; font-size: 13px; }
    @media (max-width: 560px) { body { padding: 36px 18px 28px; } header { align-items: flex-start; flex-direction: column; margin-bottom: 30px; padding-bottom: 22px; } h1 { font-size: clamp(36px, 10vw, 46px); } section { display: block; padding: 13px 0; } h3 { width: auto; margin-bottom: 5px; } }
  </style>
</head>
<body><main>
  <header><div><h1>应用政策页面</h1><p>查看仓库中的政策页面，或创建一份自己的页面。</p></div><a class="edit-link" href="./editor.html">打开编辑器</a></header>
  ${body}
  <footer>页面内容由提交者维护。请在发布前自行核对。</footer>
</main></body>
</html>
`;
}

function renderReadmeList(apps) {
  const rows = [];
  for (const [app, types] of apps) {
    const entries = Object.entries(typeNames).map(([type, label]) => {
      const languages = types.get(type);
      const links = languages
        ? [...languages].sort(([a], [b]) => a.localeCompare(b)).map(([language, filename]) =>
          `[${languageNames[language] ?? language}](${filename})`).join(' / ')
        : '暂无';
      return `${label}：${links}`;
    });
    rows.push(`- **${appLabel(app)}**：${entries.join(' ｜ ')}`);
  }
  return rows.join('\n') || '_目前还没有页面。欢迎贡献。_';
}

function updateReadme(current, listing) {
  if (current.split(startMarker).length !== 2 || current.split(endMarker).length !== 2) {
    throw new Error(`README.md 必须恰好包含 ${startMarker} 和 ${endMarker} 标记`);
  }
  const [before, rest] = current.split(startMarker);
  const [, after] = rest.split(endMarker);
  return `${before}${startMarker}\n${listing}\n${endMarker}${after}`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const apps = discover();
  const currentReadme = fs.readFileSync(readmePath, 'utf8');
  const expectedReadme = updateReadme(currentReadme, renderReadmeList(apps));
  const expectedIndex = renderCatalog(apps);
  const stale = [];
  const currentIndex = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
  const expectedLinks = [...apps.values()].flatMap(types => [...types.values()].flatMap(languages => [...languages.values()]));
  if (!fs.existsSync(indexPath) || expectedLinks.some(filename => !currentIndex.includes(filename))) stale.push('index.html');
  if (currentReadme !== expectedReadme) stale.push('README.md');

  if (checkOnly) {
    if (stale.length) {
      console.error(`生成文件需要更新：${stale.join(', ')}`);
      process.exitCode = 1;
      return;
    }
    console.log('协议目录和 README 列表均为最新。');
    return;
  }

  fs.writeFileSync(indexPath, expectedIndex, 'utf8');
  fs.writeFileSync(readmePath, expectedReadme, 'utf8');
  console.log('已更新 index.html 和 README.md。');
}

main();
