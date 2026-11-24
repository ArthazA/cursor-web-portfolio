---
title: CODElonize
summary: A multiplayer AR coding quiz game. Players answer programming questions to conquer areas of a shared 3D island placed in the real world.
kind: iOS AR game
role: Frontend & game logic
team: 5
year: "TODO"
stack: [Swift, SwiftUI, ARKit, RealityKit, Peer-to-peer networking]
repo: https://github.com/ArthazA/CODElonize
featured: true
order: 2
---

<!-- DRAFT: rewrite in your own voice. -->

## The idea

TODO: Why a coding quiz in AR? Who is it for?

## What I built

I worked on the frontend and the game logic:

- **Match flow:** lobby, ready-up, timers, scoring and results.
- **Conquest system:** areas of the island that players capture by answering correctly, plus power-ups and freezes.
- **Quiz engine:** loading, randomizing and validating questions, including code-arrangement questions.
- TODO: which screens or systems were yours specifically?

## How the system works

```text
Host device ──(peer discovery)──► Client devices
     │                                 │
     └── game state sync messages ◄────┘
           (join · ready · start · attempt result · state sync)

Shared AR anchor ──► everyone sees the same island in the same place
```

Keeping several phones in agreement about one game state is a small distributed systems problem. TODO: say what was hard about it.

## What I learned

TODO
