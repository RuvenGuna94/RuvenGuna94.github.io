import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';

const root = resolve('dist');
const failures = [];
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}
const pages = (await files(root)).filter(path => path.endsWith('.html'));
let checked = 0;
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  if (/Local design preview|Sample draft|Sample content is not published/.test(html)) failures.push(`${page}: draft or preview content leaked`);
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) continue;
    const ref = new URL(value, `https://local.invalid/${page.slice(root.length+1).split(sep).join('/')}`);
    let path = resolve(root, `.${decodeURIComponent(ref.pathname)}`);
    if (!path.startsWith(`${root}${sep}`) && path !== root) { failures.push(`${page}: unsafe internal path ${value}`); continue; }
    try {
      if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
      await stat(path);
      checked++;
      if (ref.hash && path.endsWith('.html')) {
        const target = await readFile(path, 'utf8');
        const id = decodeURIComponent(ref.hash.slice(1));
        if (!target.includes(`id="${id}"`) && !target.includes(`id='${id}'`)) failures.push(`${page}: missing anchor ${value}`);
      }
    } catch { failures.push(`${page}: missing local target ${value}`); }
  }
}
for (const sample of ['writing/reading-a-retrieval-result/index.html', 'labs/inspect-evidence/index.html']) {
  try { await stat(join(root, sample)); failures.push(`Unapproved sample route exists: ${sample}`); } catch {}
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Verified ${pages.length} HTML pages and ${checked} local links/assets; no sample drafts or preview notices.`);
