---
title: JagaKin
summary: A native iOS app that helps primary caregivers share daily care tasks with family and friends, so the mental load isn't carried by one person.
kind: iOS app
role: Frontend developer
team: 6
year: "TODO"
stack: [Swift, SwiftUI, Supabase, PostgreSQL]
repo: https://github.com/heyitskeira/CaregiverApp
featured: true
order: 3
---

<!-- DRAFT: rewrite in your own voice. -->

## The problem

Caregivers often carry the whole job of scheduling, delegating and following up on care tasks. JagaKin gives them one place to assign responsibilities and see who is accountable for what.

## What I built

TODO: Which screens did you build? (Timeline, task composer, care group, onboarding, settings…?)

## How the system works

```text
SwiftUI views ──► @Observable stores ──► repository protocols
                                              │
                         mock repositories ◄──┴──► Supabase (Postgres + RLS)
```

The app talks to data through repository protocols, so it could run on seed data first and switch to Supabase later without rewriting the screens.

## What I learned

TODO
