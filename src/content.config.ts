import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const family = z.enum(['AI Governance', 'RAG Engineering']);
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({ title: family, description: z.string(), order: z.number(), repository: z.string().url().optional() }),
});
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({ title: z.string(), description: z.string(), draft: z.boolean().default(true), date: z.coerce.date().optional(), tags: z.array(z.string()), references: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]) }).refine(data => data.draft || !!data.date, { message: 'Approved articles require a publication date.', path: ['date'] }),
});
const labs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/labs' }),
  schema: z.object({ title: z.string(), description: z.string(), family, draft: z.boolean().default(true), duration: z.string(), repository: z.string().url().optional() }),
});
export const collections = { projects, writing, labs };
