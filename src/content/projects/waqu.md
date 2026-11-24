---
title: WaQu
summary: A mobile app that predicts water quality from a phone camera photo and maps the results, so communities can spot unsafe water sources early.
kind: Cross-platform mobile app
role: Frontend & auth
team: 3
year: "2025"
stack: [React Native, Expo, TypeScript, Appwrite, React Native Maps]
repo: https://github.com/evanfhartono/waqu-water-quality-app
featured: true
order: 4
---

<!-- DRAFT: rewrite in your own voice. -->

## The problem

Many rivers and wells face pollution risks, and most people have no quick way to check. WaQu was built for PKM-KC 2025 and aligns with SDG 6: Clean Water and Sanitation.

## What I built

- **Authentication:** sign up, log in and profile management with Appwrite.
- **Frontend screens:** TODO, which ones?

## How the system works

```text
Camera capture ──► prediction model ──► result
                                          │
                     Appwrite (auth + data) ◄──┘
                                          │
                                 Map of water quality
```

TODO: confirm where the prediction runs (on the phone or a server?).

## What I learned

TODO
