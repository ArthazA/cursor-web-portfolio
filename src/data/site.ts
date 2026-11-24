// ─────────────────────────────────────────────────────────────
// Everything about "you" lives here. Edit freely.
// Lines marked DRAFT or TODO are placeholders for your own words.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Arthaz',
  fullName: 'Arthaz Anthony', // TODO: confirm your full name
  title: 'Software Engineer · Systems & DevOps', // DRAFT
  tagline:
    'I build apps, then take them apart to understand the system underneath.', // DRAFT
  description:
    'Arthaz is a software engineer who builds mobile apps and backends, and is moving deeper into DevOps and systems.', // DRAFT: used for search results and link previews
  location: 'Indonesia', // TODO: city, country
  email: 'anthony.arthaz@gmail.com',
  cv: '', // TODO: put your CV in /public (e.g. /public/cv.pdf) and set this to '/cv.pdf'
};

// The terminal-style "status" card on the homepage.
export const now = [
  { state: 'on', key: 'building', value: 'cursor-web-portfolio' },
  { state: 'off', key: 'learning', value: 'Docker · CI/CD · Linux' }, // TODO
  { state: 'off', key: 'open to', value: 'DevOps / Platform roles' }, // TODO
];

export const links = [
  { label: 'GitHub', href: 'https://github.com/ArthazA', handle: '@ArthazA' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/arthaz-anthony/', handle: 'arthaz-anthony' },
  // Set show: false to hide Instagram from the site.
  { label: 'Instagram', href: 'https://www.instagram.com/arthaz_a/', handle: '@arthaz_a', show: true },
].filter((l) => l.show !== false);

// Skills & Technologies, gathered from your project repos.
export const skills: { group: string; note?: string; items: string[] }[] = [
  {
    group: 'Languages',
    items: ['Swift', 'TypeScript', 'JavaScript', 'Dart', 'Python', 'SQL / PL/pgSQL', 'Shell'],
  },
  {
    group: 'Apple platforms',
    items: ['SwiftUI', 'ARKit', 'RealityKit', 'Core ML', 'Create ML', 'AVFoundation', 'Peer-to-peer networking'],
  },
  {
    group: 'Cross-platform',
    items: ['React Native', 'Expo', 'Flutter', 'React Native Reanimated'],
  },
  {
    group: 'Backend & data',
    items: ['Supabase', 'PostgreSQL', 'Row Level Security', 'Database migrations', 'Appwrite', 'IoT data ingest'],
  },
  {
    group: 'Systems & DevOps',
    note: 'Currently learning', // TODO: move items up as you use them in real projects
    items: ['Git & GitHub', 'Linux', 'Docker', 'GitHub Actions', 'CI/CD'],
  },
  {
    group: 'Design',
    items: ['Figma', 'Sketch'],
  },
];
