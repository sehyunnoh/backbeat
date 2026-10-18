import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    level: z.number().int().min(0).max(9),
    order: z.number().int(),
    summary: z.string(),
    minutes: z.number().int(),
    /** What "done" looks like for this lesson. */
    goal: z.string(),
  }),
});

export const collections = { lessons };
