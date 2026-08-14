# CodeZen — Architecture & System Design

## 🏛️ System Overview

CodeZen is an intelligent, multi-tier digital learning platform designed for the **Smart India Hackathon (SIH) Problem Statement PS-013**. It bridges foundational school education (Class 1–12) and advanced higher education (Undergrad, BTech, MTech, Research) into a unified learning universe.

```
                  ┌──────────────────────────────────────────────┐
                  │                 USER BROWSER                 │
                  └──────────────────────┬───────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │      Next.js App Router (Client/SSR)     │
                    └─────────┬──────────────────────┬────────┘
                              │                      │
       ┌──────────────────────┴──────┐        ┌──────┴──────────────────────┐
       │   3D Course Solar System    │        │  Interactive Coding Lab UI  │
       │   (Three.js / React 3D)     │        │   (Monaco/CodeMirror Lab)   │
       └─────────────────────────────┘        └──────────────┬──────────────┘
                                                             │
                    ┌────────────────────────────────────────┴┐
                    │      Next.js Server API Endpoints       │
                    │   (/api/tutor, /api/execute, etc.)      │
                    └─────────┬──────────────────────┬────────┘
                              │                      │
        ┌─────────────────────┴──────┐        ┌──────┴──────────────────────┐
        │    AI Tutor Knowledge RAG  │        │   Piston Code Engine API    │
        │   (cs-knowledge base)      │        │    (Multi-language runner)   │
        └────────────────────────────┘        └─────────────────────────────┘
```

---

## 🧩 Architectural Layers

### 1. Presentation & UI Layer (`src/app` & `src/components`)
- Built with **Next.js 16 App Router**, **React 19**, and **Tailwind CSS v4**.
- Uses **Framer Motion** for scroll-linked camera storytelling transitions.
- Renders the interactive 3D **Course Solar System** via `@react-three/fiber` and `@react-three/drei`.

### 2. State & Progression Engine (`src/services` & `src/data`)
- **Education Groups & Grade Hierarchy**: Maps students across 18 levels from Primary School to MTech/Research.
- **Mastery Tracking**: Evaluates quiz performance, coding exercise completions, and weakness analytics.

### 3. Server API Layer (`src/app/api`)
- `/api/tutor`: Processes student questions against the 130KB+ CS Knowledge RAG system.
- `/api/execute`: Relays code compilation requests to the Piston engine backend securely.
- `/api/ai/assist`: Generates instant code explanations, debugging hints, and summaries.
- `/api/youtube`: Fetches curated educational video lessons.

### 4. Integration Services (`src/services`)
- **Firebase Auth (`src/lib/firebase.ts`)**: Manages user authentication and persistent user state.
- **Piston Service (`src/services/coding.service.ts`)**: Manages code execution across 10+ programming languages.
