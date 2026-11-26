import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('./', import.meta.url);
const output = new URL('./docs/', root);
const source = new URL('./site/', root);
const repository = process.env.BAMEN_SITE_REPOSITORY || 'etaivan96/bamen';
if (!/^[a-z0-9-]+\/[a-z0-9._-]+$/i.test(repository)) throw new Error('Use a GitHub owner/repository name');
const github = 'https://github.com/' + repository;

const pages = [
  ['index', 'Overview', 'Storyboard and SketchUp in one background workflow.'],
  ['guide', 'Usage guide', 'Install Bamen and take a storyboard panel through capture and render.'],
  ['updates', 'Updates', 'Recent changes to Bamen Desktop and the SketchUp HUD.'],
  ['support', 'Support', 'Get help, report a bug, or send feedback about Bamen.'],
  ['about', 'About', 'Why Bamen is being built for storyboard and background artists.'],
];

await mkdir(output, { recursive: true });
await cp(new URL('./assets/', source), new URL('./assets/', output), { recursive: true });
for (const [slug, name, description] of pages) {
  const contents = await readFile(new URL('./sections/' + slug + '.html', source), 'utf8');
  const nav = pages.map(([link, label]) =>
    '<a href="' + link + '.html"' + (link === slug ? ' aria-current="page"' : '') + '>' + label + '</a>'
  ).join('');
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="description" content="${description}">
  <title>${slug === 'index' ? 'Bamen — Storyboard to background' : name + ' — Bamen'}</title>
  <link rel="icon" href="assets/bamen.ico">
  <link rel="stylesheet" href="assets/site.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="index.html"><img src="assets/bamen.ico" alt="" width="31" height="31">Bamen</a>
      <nav aria-label="Main navigation">${nav}</nav>
      <a class="button small header-action" href="guide.html#install">Get Bamen <span aria-hidden="true">↗</span></a>
    </div>
  </header>
  <main id="main">${contents.replaceAll('{{github}}', github)}</main>
  <footer class="site-footer">
    <div class="wrap footer-inner">
      <a class="brand" href="index.html"><img src="assets/bamen.ico" alt="" width="26" height="26">Bamen</a>
      <span>Storyboard and background production for SketchUp.</span>
      <a href="${github}">GitHub <span aria-hidden="true">↗</span></a>
    </div>
  </footer>
</body>
</html>`;
  await writeFile(new URL(slug + '.html', output), html);
}
await writeFile(new URL('.nojekyll', output), '');
console.log('Built ' + pages.length + ' pages in ' + fileURLToPath(output));
