---
title: Turterra
summary: An iOS app and IoT pipeline that helps turtle conservation hatcheries map nests, track incubation temperature, and record hatching results.
kind: iOS app + IoT
role: IoT engineer & backend
team: 5
year: "2026"
stack: [Swift, SwiftUI, Supabase, PostgreSQL, Core ML, Create ML, Python, IoT]
repo: https://github.com/mluat26/ch5-penyu-community
featured: true
order: 1
---

<!-- DRAFT: rewrite in your own voice. Keep the headings or change them. -->

## The problem

TODO: Who are the hatchery volunteers, and what was hard for them before? One or two sentences.

## What I built

As the IoT engineer and backend developer, I worked on the path data takes from a sensor in the sand to the app on a volunteer's phone:

- **Trusted IoT ingest.** Devices report only their own stable ID. The server works out which nest a reading belongs to, so hardware never has to know about nests.
- **Device assignment history.** A device can be moved between nests without losing which readings belonged where.
- **Database schema and security.** About 30 versioned Supabase migrations, with Row Level Security so each organization only sees its own hatcheries.
- TODO: anything else you owned (hardware choice, sensors, firmware?)

## How the system works

```text
Temperature sensor ──► Supabase (trusted ingest)
                          │
                          ├─ device_assignment ──► nest ──► hatchery ──► organization
                          │
                          └─ iotdata (reading + resolved nest)
                                      │
                                      ▼
                         iOS app (SwiftUI) ── on-device Core ML
                                              hatchery layout detection
```

TODO: check this matches reality, and add the hardware you used.

## What I learned

TODO: One honest paragraph. What surprised you about building a system that spans hardware, a database and an app?
