import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      summary: z.string(),
      year: z.string(),
      role: z.string(),
      team: z.string().optional(),
      status: z.enum(['Live', 'In development', 'Case study', 'Open source']),
      stack: z.array(z.string()),
      highlights: z.array(z.string()).max(4),
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#ff6b35'),
      live: z.url().optional(),
      repo: z.url().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      mock: z.enum(['dashboard', 'chat', 'marketplace']).default('dashboard'),
      featured: z.boolean().default(true),
      order: z.number().default(100),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
