import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per project in src/content/projects/.
// The file name becomes the URL: turterra.md → /projects/turterra
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // one or two sentences, shown on cards
    kind: z.string(), // e.g. "iOS app"
    role: z.string(), // what YOU did
    team: z.union([z.number(), z.literal('Solo')]),
    year: z.string(),
    stack: z.array(z.string()),
    repo: z.string().url().optional(),
    link: z.string().url().optional(), // live link / TestFlight, if any
    cover: z.string().optional(), // e.g. "/projects/turterra.png" (put the file in /public/projects/)
    featured: z.boolean().default(false), // show on the homepage
    order: z.number().default(99), // lower = earlier
  }),
});

// One Markdown file per experience in src/content/experiences/.
const experiences = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiences' }),
  schema: z.object({
    role: z.string(),
    org: z.string(),
    period: z.string(), // e.g. "Mar 2026 – Present"
    type: z.string(), // e.g. "Program", "Internship", "Education"
    summary: z.string(),
    location: z.string().optional(),
    related: z.array(z.string()).default([]), // project file names, e.g. ["turterra"]
    order: z.number().default(99), // lower = earlier (put the most recent first)
  }),
});

export const collections = { projects, experiences };
