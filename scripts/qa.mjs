import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.QA_URL || 'http://127.0.0.1:4321';
const out = new URL('../work/qa/', import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { checks: [], failures: [], contrast: [] };
const paths = ['/', '/projects/', '/projects/ai-governance/', '/projects/rag-engineering/', '/labs/', '/writing/', '/writing/reading-a-retrieval-result/', '/labs/inspect-evidence/'];
function luminance(hex) { const v = hex.match(/\w\w/g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4); return v[0]*.2126+v[1]*.7152+v[2]*.0722; }
for (const theme of ['light','dark']) {
  const context = await browser.newContext({colorScheme:theme});
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [1280,390,320]) {
    await page.setViewportSize({width,height:960});
    for (const path of paths) {
      const response = await page.goto(`${base}${path}`);
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => ({
        theme: document.documentElement.dataset.theme,
        overflow: document.documentElement.scrollWidth > innerWidth,
        h1: document.querySelectorAll('h1').length,
        font: getComputedStyle(document.body).fontFamily,
        size: getComputedStyle(document.body).fontSize,
        prose: document.querySelector('.prose') ? {width:document.querySelector('.prose').getBoundingClientRect().width,lineHeight:getComputedStyle(document.querySelector('.prose p')).lineHeight} : null,
        links: [...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(x=>x.startsWith('/')),
      }));
      const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
      const check = {theme,width,path,status:response.status(),...result,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))};
      report.checks.push(check);
      if (check.status!==200 || check.overflow || check.h1!==1 || check.theme!==theme || check.violations.length) report.failures.push(check);
      if (['/','/writing/reading-a-retrieval-result/','/labs/inspect-evidence/'].includes(path) && width!==320) await page.screenshot({path:new URL(`${theme}-${width}-${path==='/'?'home':path.startsWith('/writing')?'article':'lab'}.png`,out).pathname.replace(/^\/(\w:)/,'$1'),fullPage:true});
    }
  }
  await page.goto(base);
  const colors=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(['ink','muted','merlot','sage','bg','panel','sage-panel','control'].map(k=>[k,s.getPropertyValue(`--${k}`).trim().replace('#','')]));});
  for(const foreground of ['ink','muted','merlot','sage']) for(const background of ['bg','panel','sage-panel']) {
    const a=luminance(colors[foreground]),b=luminance(colors[background]); const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    report.contrast.push({theme,foreground,background,ratio:Number(ratio.toFixed(2))});
    if(ratio<4.5) report.failures.push({theme,foreground,background,ratio});
  }
  await page.keyboard.press('Tab');
  if(await page.locator(':focus').textContent()!=='Skip to content') report.failures.push({theme,keyboard:'Skip link not first'});
  await page.keyboard.press('Enter');
  if(await page.locator(':focus').getAttribute('id')!=='main') report.failures.push({theme,keyboard:'Skip target not focused'});
  await page.getByRole('button',{name:`Switch to ${theme==='light'?'dark':'light'} mode`}).click();
  await page.reload();
  if(await page.locator('html').getAttribute('data-theme')===theme) report.failures.push({theme,persistence:'Theme not saved'});
  if(errors.length) report.failures.push({theme,errors});
  await context.close();
}
const links=[...new Set(report.checks.flatMap(c=>c.links))];
const context=await browser.newContext();
for(const link of links) {
  const response=await context.request.get(`${base}${link.split('#')[0]}`);
  if(response.status()!==200) report.failures.push({link,status:response.status()});
}
await browser.close();
await writeFile(new URL('report.json',out),JSON.stringify(report,null,2));
console.log(`${report.checks.length} page/theme/viewport checks; ${links.length} internal links; ${report.contrast.length} contrast pairs; ${report.failures.length} failures.`);
if(report.failures.length) {console.log(JSON.stringify(report.failures,null,2));process.exitCode=1;}
