# Policy Pages — 开源协议页面制作器

A small, static editor for privacy policies, terms of service, support pages, and other product documents. Edit content in a visual form, preview the layout, download a standalone HTML file, and host it on GitHub Pages—no paid domain, server, build step, or account required.

## 试用 / Try it

- Open the editor from this repository's GitHub Pages site after enabling Pages in **Settings → Pages**.
- Or clone/download the repository and open `index.html` in a modern browser. No build tools or dependencies are required.

## 使用流程 / Workflow

1. Fill in the product name, document type, language, title, date, and optional contact email.
2. Edit, add, remove, or reorder content sections. Use **外观设置** to change the accent color, page width, and footer.
3. Review the live preview.
4. Click **下载网页** to export a standalone HTML page. Optionally export/import a JSON configuration to continue editing later.
5. Put the downloaded HTML file in your own GitHub repository and enable GitHub Pages in **Settings → Pages**. GitHub will provide a free `https://<username>.github.io/<repository>/` address. A custom domain is optional.

The editor draft is stored locally in the current browser. It is not uploaded to GitHub automatically. To publish changes, download the HTML and commit it to your repository. Export the JSON config as a backup or to move the draft to another device.

## Important legal note

This project is a document layout and publishing tool, not legal advice and not a guarantee of legal compliance. Starter copy is illustrative only and may not fit your app, data practices, or jurisdiction. Replace it with accurate information and seek qualified legal advice where appropriate. You are responsible for reviewing the final content before publication.

## Privacy and security

The editor has no backend and does not transmit the text you enter. Drafts are stored in browser `localStorage` when available. Exported HTML is generated locally. Avoid entering sensitive information on a shared device, and remember that published GitHub Pages content is public.

## Project files

- `index.html` — editor interface and live preview
- `styles.css` — responsive layout and document styles
- `app.js` — local editor, draft storage, import/export, and HTML generation
- Existing policy documents in the repository are retained as examples/legacy pages.

## License

MIT. See [LICENSE](LICENSE).
