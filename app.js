'use strict';
(() => {
  const STORAGE_KEY = 'policy-pages-draft-v1';
  const typeNames = { privacy: '隐私政策', terms: '用户协议', support: '技术支持', custom: '自定义页面' };
  const languageNames = { 'zh-Hans': '简体中文', 'zh-Hant': '繁體中文', en: 'English', ja: '日本語', ko: '한국어', fr: 'Français', de: 'Deutsch' };
  const starterSections = {
    privacy: [
      { title: '概述', body: '请介绍你的产品、运营主体，以及本政策适用的服务范围。\n\n请根据实际情况替换这段示例内容。' },
      { title: '我们处理的信息', body: '说明应用实际收集或处理的信息、处理目的、处理方式和保存期限。若不收集个人信息，也请准确说明应用的实际行为。' },
      { title: '第三方服务与共享', body: '列出实际集成的分析、广告、支付、云服务等第三方及其处理目的。若没有，请如实说明。' },
      { title: '你的选择与权利', body: '说明用户如何访问、更正、删除信息，撤回授权或联系你提出隐私请求。' },
      { title: '政策变更与联系我们', body: '说明如何通知政策变更，并提供可以使用的联系渠道。' }
    ],
    terms: [
      { title: '接受条款', body: '说明使用服务即表示接受哪些条款，以及适用的用户资格。请按产品实际情况填写。' },
      { title: '服务使用规则', body: '列出用户使用服务时需要遵守的规则、禁止行为及内容要求。' },
      { title: '知识产权', body: '说明服务、内容和商标等知识产权的归属，以及用户内容的授权范围。' },
      { title: '免责声明与责任限制', body: '根据服务性质说明可用性、风险和责任范围。请咨询专业人士后再发布。' },
      { title: '条款变更与联系', body: '说明条款更新方式、生效时间，以及用户有问题时如何联系你。' }
    ],
    support: [
      { title: '获取帮助', body: '简要说明用户如何获得产品使用帮助。' },
      { title: '联系我们', body: '填写有效的支持邮箱、反馈表单或其他联系渠道。' },
      { title: '常见问题', body: '在这里添加最常见的问题和简短答案。' }
    ],
    custom: [{ title: '章节标题', body: '在这里填写页面内容。' }]
  };
  const defaultData = () => ({ version: 1, productName: '', type: 'privacy', language: 'zh-Hans', title: '隐私政策', updatedDate: new Date().toISOString().slice(0, 10), email: '', accent: '#5367f5', width: 'standard', footer: '', sections: structuredClone(starterSections.privacy) });
  const $ = id => document.getElementById(id);
  const refs = { productName: $('product-name'), type: $('document-type'), language: $('document-language'), title: $('document-title'), updatedDate: $('updated-date'), email: $('contact-email'), accent: $('accent-color'), width: $('content-width'), footer: $('footer-text'), sections: $('sections'), preview: $('preview'), status: $('status-message') };
  let data = defaultData();
  let saveTimer;
  const safeStorage = {
    get() { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } },
    set(value) { try { localStorage.setItem(STORAGE_KEY, value); return true; } catch { return false; } }
  };
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
  function formatDate(date) {
    if (!date) return '未填写';
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    try { return new Intl.DateTimeFormat(data.language || 'zh-Hans', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsed); } catch { return date; }
  }
  function syncForm() {
    refs.productName.value = data.productName || '';
    refs.type.value = data.type;
    refs.language.value = data.language;
    refs.title.value = data.title || '';
    refs.updatedDate.value = data.updatedDate || '';
    refs.email.value = data.email || '';
    refs.accent.value = /^#[0-9a-f]{6}$/i.test(data.accent) ? data.accent : '#5367f5';
    refs.width.value = ['narrow', 'standard', 'wide'].includes(data.width) ? data.width : 'standard';
    refs.footer.value = data.footer || '';
    $('accent-value').textContent = refs.accent.value.toUpperCase();
    renderSections(); renderPreview();
  }
  function renderSections() {
    refs.sections.replaceChildren();
    if (!data.sections.length) {
      const empty = document.createElement('div'); empty.className = 'empty-sections'; empty.textContent = '还没有章节，点击“添加章节”开始编辑。'; refs.sections.append(empty); return;
    }
    data.sections.forEach((section, index) => {
      const card = document.createElement('div'); card.className = 'section-card';
      const head = document.createElement('div'); head.className = 'section-card-head';
      const number = document.createElement('span'); number.className = 'section-number'; number.textContent = `SECTION ${String(index + 1).padStart(2, '0')}`;
      const actions = document.createElement('div'); actions.className = 'section-actions';
      const up = actionButton('上移', '↑', () => moveSection(index, -1), index === 0);
      const down = actionButton('下移', '↓', () => moveSection(index, 1), index === data.sections.length - 1);
      const remove = actionButton('删除章节', '删除', () => { data.sections.splice(index, 1); changed(); }, false, true);
      actions.append(up, down, remove); head.append(number, actions);
      const title = document.createElement('input'); title.type = 'text'; title.maxLength = 100; title.setAttribute('aria-label', `第 ${index + 1} 章标题`); title.placeholder = '章节标题'; title.value = section.title || '';
      title.addEventListener('input', () => { data.sections[index].title = title.value; renderPreview(); queueSave(); });
      const body = document.createElement('textarea'); body.maxLength = 12000; body.setAttribute('aria-label', `第 ${index + 1} 章正文`); body.placeholder = '填写这部分的内容，可使用换行分段'; body.value = section.body || '';
      body.addEventListener('input', () => { data.sections[index].body = body.value; renderPreview(); queueSave(); });
      card.append(head, title, body); refs.sections.append(card);
    });
  }
  function actionButton(label, text, callback, disabled, danger = false) {
    const button = document.createElement('button'); button.type = 'button'; button.className = `icon-button${danger ? ' delete' : ''}`; button.textContent = text; button.title = label; button.setAttribute('aria-label', label); button.disabled = disabled;
    button.addEventListener('click', callback); return button;
  }
  function moveSection(index, direction) {
    const target = index + direction; if (target < 0 || target >= data.sections.length) return;
    [data.sections[index], data.sections[target]] = [data.sections[target], data.sections[index]]; changed();
  }
  function renderPreview() {
    const title = data.title.trim() || typeNames[data.type] || '文档';
    const product = data.productName.trim();
    const sections = data.sections.map(section => `<section><h2>${escapeHtml(section.title || '未命名章节')}</h2><p class="doc-body">${escapeHtml(section.body || '请填写本章节内容。')}</p></section>`).join('');
    const email = data.email.trim();
    const contact = email ? `<div class="doc-contact">联系邮箱：<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>` : '';
    refs.preview.className = `document-preview width-${['narrow', 'standard', 'wide'].includes(data.width) ? data.width : 'standard'}`;
    refs.preview.style.setProperty('--document-accent', /^#[0-9a-f]{6}$/i.test(data.accent) ? data.accent : '#5367f5');
    refs.preview.lang = data.language || 'zh-Hans';
    refs.preview.innerHTML = `<span class="doc-kicker">${escapeHtml(product || '产品名称')} · ${escapeHtml(languageNames[data.language] || data.language || '')}</span><h1>${escapeHtml(title)}</h1><div class="doc-meta">${escapeHtml(typeNames[data.type] || '文档')}　·　更新日期：${escapeHtml(formatDate(data.updatedDate))}</div><p class="doc-intro">本政策说明${escapeHtml(product || '本应用')}如何处理信息。请按应用实际情况修改本段和下方内容。</p>${sections || '<p class="doc-body">请添加至少一个正文章节。</p>'}${contact}<footer class="doc-footer">${escapeHtml(data.footer || `© ${new Date().getFullYear()} ${product || '产品名称'}`)}</footer>`;
    queueSave();
  }
  function readForm() {
    data.productName = refs.productName.value; data.type = refs.type.value; data.language = refs.language.value;
    data.title = refs.title.value; data.updatedDate = refs.updatedDate.value; data.email = refs.email.value;
    data.accent = refs.accent.value; data.width = refs.width.value; data.footer = refs.footer.value;
  }
  function changed() { readForm(); syncForm(); queueSave(); }
  function queueSave() { clearTimeout(saveTimer); saveTimer = setTimeout(() => { if (safeStorage.set(JSON.stringify(data))) refs.status.textContent = '草稿已自动保存在此浏览器。'; }, 350); }
  function saveDraft(showMessage = true) {
    readForm(); const success = safeStorage.set(JSON.stringify(data));
    refs.status.textContent = success ? (showMessage ? '已保存到此浏览器。导出网页后记得提交到仓库。' : '草稿已自动保存在此浏览器。') : '浏览器不允许本地存储；请使用“导出配置”保存备份。';
  }
  function applyTemplate(type) { data.type = type; data.title = typeNames[type] || '自定义页面'; data.sections = structuredClone(starterSections[type] || starterSections.custom); changed(); }
  function buildHtml() {
    const isChinese = (data.language || '').startsWith('zh');
    const title = data.title.trim() || typeNames[data.type] || (isChinese ? '文档' : 'Document');
    const product = data.productName.trim() || (isChinese ? '产品名称' : 'Your product');
    const sections = data.sections.map(section => `<section><h2>${escapeHtml(section.title || (isChinese ? '未命名章节' : 'Untitled'))}</h2><p>${escapeHtml(section.body || '').replace(/\r?\n/g, '<br>')}</p></section>`).join('\n      ');
    const contact = data.email.trim() ? `<p class="contact">${isChinese ? '联系邮箱' : 'Contact'}: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>` : '';
    const footer = data.footer.trim() || `© ${new Date().getFullYear()} ${product}`;
    const updatedLabel = isChinese ? '更新日期' : 'Last updated';
    const intro = isChinese
      ? `本政策说明${product}如何处理信息。请按应用实际情况修改本段和下方内容。`
      : `This page describes how ${product} handles information. Update this paragraph and the sections below to match your app.`;
    return `<!doctype html>\n<html lang="${escapeHtml(data.language || 'en')}">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <meta name="description" content="${escapeHtml(title)}">\n  <title>${escapeHtml(title)} — ${escapeHtml(product)}</title>\n  <style>\n    :root{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#283248;background:#f6f7fb;--accent:${/^#[0-9a-f]{6}$/i.test(data.accent) ? data.accent : '#5367f5'}}\n    *{box-sizing:border-box}body{margin:0;padding:40px 18px;line-height:1.8}.document{max-width:${data.width === 'narrow' ? '620px' : data.width === 'wide' ? '920px' : '760px'};margin:0 auto;background:#fff;padding:clamp(24px,6vw,56px);border-radius:14px;box-shadow:0 12px 40px #26334b0d}.kicker{color:var(--accent);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}h1{font-size:clamp(28px,5vw,40px);line-height:1.25;margin:12px 0} .meta{color:#7b8495;font-size:13px;border-bottom:1px solid #eceef3;padding-bottom:18px}.intro{color:#657087;margin:24px 0 32px}h2{font-size:20px;margin:30px 0 8px}section p{white-space:normal;overflow-wrap:anywhere;color:#4b566b;font-size:15px}.contact{margin-top:30px;padding:14px;background:#f5f6fa;border-radius:8px}.contact a{color:var(--accent)}footer{margin-top:40px;padding-top:16px;border-top:1px solid #eceef3;color:#929aaa;font-size:12px}@media print{body{padding:0;background:#fff}.document{box-shadow:none;max-width:none}}\n  </style>\n</head>\n<body>\n  <main class="document">\n    <span class="kicker">${escapeHtml(product)}</span>\n    <h1>${escapeHtml(title)}</h1>\n    <div class="meta">${escapeHtml(typeNames[data.type] || (isChinese ? '文档' : 'Document'))} · ${updatedLabel}: ${escapeHtml(formatDate(data.updatedDate))}</div>\n    <p class="intro">${escapeHtml(intro)}</p>\n    ${sections}\n    ${contact}\n    <footer>${escapeHtml(footer)}</footer>\n  </main>\n</body>\n</html>\n`;
  }
  function download(name, content, mime) {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function slugify(value) {
    const slug = value.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
    return slug || ({ privacy: 'privacy-policy', terms: 'terms-of-service', support: 'support', custom: 'document' }[data.type] || 'document');
  }
  function validateData(value) {
    if (!value || typeof value !== 'object' || !Array.isArray(value.sections)) throw new Error('配置文件格式不正确，缺少 sections 列表。');
    if (value.sections.length > 100) throw new Error('章节过多，请控制在 100 个以内。');
    value.sections.forEach(section => {
      if (!section || typeof section.title !== 'string' || typeof section.body !== 'string') throw new Error('章节必须包含字符串格式的 title 和 body。');
      if (section.title.length > 100 || section.body.length > 12000) throw new Error('章节标题或正文超出长度限制。');
    });
    const next = defaultData();
    for (const key of ['productName', 'title', 'email', 'updatedDate', 'footer']) if (typeof value[key] === 'string') next[key] = value[key].slice(0, key === 'footer' ? 160 : 200);
    if (['privacy', 'terms', 'support', 'custom'].includes(value.type)) next.type = value.type;
    if (Object.hasOwn(languageNames, value.language)) next.language = value.language;
    if (typeof value.accent === 'string' && /^#[0-9a-f]{6}$/i.test(value.accent)) next.accent = value.accent;
    if (['narrow', 'standard', 'wide'].includes(value.width)) next.width = value.width;
    next.sections = value.sections.map(section => ({ title: section.title, body: section.body }));
    return next;
  }
  function loadSaved() {
    const raw = safeStorage.get(); if (!raw) return;
    try { data = validateData(JSON.parse(raw)); } catch { refs.status.textContent = '发现旧草稿无法读取，已载入默认模板。'; }
  }
  $('add-section').addEventListener('click', () => { data.sections.push({ title: '', body: '' }); changed(); refs.sections.lastElementChild?.querySelector('input')?.focus(); });
  for (const element of [refs.productName, refs.title, refs.updatedDate, refs.email, refs.footer]) element.addEventListener('input', () => { readForm(); renderPreview(); });
  refs.type.addEventListener('change', () => applyTemplate(refs.type.value));
  refs.language.addEventListener('change', () => { readForm(); renderPreview(); });
  refs.accent.addEventListener('input', () => { readForm(); $('accent-value').textContent = refs.accent.value.toUpperCase(); renderPreview(); });
  refs.width.addEventListener('change', () => { readForm(); renderPreview(); });
  $('save-button').addEventListener('click', () => saveDraft());
  $('download-html').addEventListener('click', () => { readForm(); download(`${slugify(data.title || data.productName)}.html`, buildHtml(), 'text/html'); refs.status.textContent = '网页已下载。把 HTML 文件提交到自己的 GitHub 仓库即可发布。'; });
  $('export-config').addEventListener('click', () => { readForm(); download(`${slugify(data.productName)}-policy-config.json`, JSON.stringify(data, null, 2), 'application/json'); refs.status.textContent = '配置备份已下载。'; });
  $('import-config-button').addEventListener('click', () => $('import-config').click());
  $('import-config').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try { if (file.size > 1024 * 1024) throw new Error('配置文件不能超过 1 MB。'); data = validateData(JSON.parse(await file.text())); syncForm(); saveDraft(false); refs.status.textContent = '配置已导入。'; }
    catch (error) { refs.status.textContent = error.message || '无法读取配置文件。'; }
    event.target.value = '';
  });
  loadSaved(); syncForm();
})();
