import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { url } from '../lib/content';
export async function GET(context: APIContext) {
  const entries = await getCollection('writing', ({data}) => !data.draft && !!data.date);
  return rss({title: 'Ruven Guna', description: 'Writing on learning and building in data and AI.', site: context.site || 'http://localhost:4321', items: entries.map(entry => ({title:entry.data.title,description:entry.data.description,pubDate:entry.data.date!,link:url(`writing/${entry.id}/`)}))});
}
