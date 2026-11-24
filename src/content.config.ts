import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    subtitle: z.string(),
    location: z.string(),
    category: z.enum(['Hospitality', 'F&B', 'Real Estate & Platforms', 'Archive']),
    year: z.string(),
    summary: z.string(),
    services: z.array(z.string()),
    techStack: z.array(z.string()),
    accentColor: z.string().default('#D4A373'),
    featured: z.boolean().default(true),
    order: z.number().default(0),
    thumbnail: z.string().optional(),
    reel: z.string().optional(),
    logo: z.string().optional(),
    liveUrl: z.string().optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.number(),
          prefix: z.string().optional(),
          suffix: z.string().optional(),
        })
      )
      .default([]),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    code: z.string(),
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    deliverables: z.array(z.string()),
    stack: z.array(z.string()),
    order: z.number().default(0),
    featured: z.boolean().default(false),
  }),
});

export const collections = { work, services };
