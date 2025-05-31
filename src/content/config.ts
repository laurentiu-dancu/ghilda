import { defineCollection, z } from 'astro:content';

const calatorii = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    location: z.string(),
    duration: z.string(),
    difficulty: z.enum(['ușor', 'mediu', 'dificil']).optional(),
  }),
});

export const collections = {
  'calatorii': calatorii,
};