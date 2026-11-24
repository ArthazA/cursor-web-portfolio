# cursor-web-portfolio

Personal portfolio of Arthaz, built with [Astro](https://astro.build), plain CSS and [GSAP](https://gsap.com).

Its signature: an animated "Arthaz" cursor that drags sections into place as you scroll.

## Run it

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site → dist/
```

## Where to edit things

| What | File |
|---|---|
| Name, title, tagline, email, links, skills | `src/data/site.ts` |
| Projects (one file each) | `src/content/projects/*.md` |
| Experiences (one file each) | `src/content/experiences/*.md` |
| Colors, fonts, spacing | top of `src/styles/global.css` |
| About page text | `src/pages/about.astro` |
| Animations | `src/scripts/motion.ts` |

Search the project for `TODO` and `DRAFT` to find every placeholder.

### Add a project

Create `src/content/projects/my-project.md`:

```md
---
title: My Project
summary: One or two sentences for the card.
kind: iOS app
role: What I did
team: 4          # or Solo
year: "2026"
stack: [Swift, SwiftUI]
repo: https://github.com/...
cover: /projects/my-project.png   # optional, put the image in public/projects/
featured: true   # show on the homepage
order: 1         # lower = earlier
---

## The problem
...
```

It appears at `/projects/my-project` automatically.

### Animate a component

Add `data-reveal="drag"` to any element and the ghost cursor will drag it in when it scrolls into view.
Use `data-reveal="fade"` for a quiet fade-up instead. Keep `drag` for a few key moments per page.
Visitors with "reduce motion" turned on see everything without animation.
