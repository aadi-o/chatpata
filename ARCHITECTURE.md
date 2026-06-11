# ChatPata AI - Production Architecture

This document describes the enterprise-grade architecture for **ChatPata AI**. Designed to handle 100,000+ users, real-time creature interactions, streaming AI responses, and deep contextual memory.

## Tech Stack Overview

- **Frontend:** React 18+ via Vite (SPA), Tailwind CSS, Framer Motion, Zustand (State Management)
- **Backend:** Express Server (Full-Stack integration matching `production` expectations in Railway)
- **AI Processing:** `@google/genai` (Server-side)
- **Database:** PostgreSQL via Prisma ORM
- **Deployment:** Containerized (Docker) targeting Railway

---

## 1. Domain-Driven Project Structure

Following enterprise best-practices, the codebase is separated into functional domains rather than grouped by technology.

\`\`\`text
src/
├── app/               # Main application shell and routing (App.tsx, main.tsx)
├── features/          # Domain modules
│   ├── chat/          # Chat interface, streaming, UI layout
│   ├── creature/      # 3D canvas, animations, expression engine
│   ├── memory/        # Long/short term storage summaries
│   ├── personality/   # Modes (Chaos, Yapper, Roast)
│   └── auth/          # Authentication flows
├── components/        # Reusable global design system components (buttons, inputs)
├── server/            # Backend route logic, API layers
├── lib/               # Utility functions (cn, formatters)
├── hooks/             # Custom global React hooks
├── stores/            # Zustand global state (useChatStore, useCreatureStore)
└── types/             # Shared TypeScript schemas
\`\`\`

---

## 2. Dynamic Model Routing & Gemini Architecture

The AI layer is strictly decoupled from the UI. UI dispatches a request -> API Layer intercepts it -> Generates system prompt -> Streams via SDK -> Returns stream to UI.

### Humanization System

Our mid-layer intervenes before passing to the model using injected prompts, ensuring responses skip robotic filler. 
Example instructions injected:
_“Use conversational Hinglish. Do not apologize. Reject corporate phrasing like ‘based on your input’.”_

### Dynamic Routing
- Context window under 20k tokens or simple chat -> \`gemini-2.5-flash\`
- Deep reasoning or large context -> \`gemini-2.5-pro\`

---

## 3. Streaming Engine

- The `Express` server utilizes `text/event-stream` (Server-Sent Events) to push tokens in real-time.
- The UI listens via a Custom Hook leveraging `ReadableStreamDefaultReader` for lowest latency playback.
- **Interruption Support:** User can type mid-stream, breaking the reader and emitting an abort signal to the backend.

---

## 4. The Creature Engine

The Creature reacts to more than just text.

1. **Input Triggers:** Chat frequency, detected user sentiment, interaction depth.
2. **Sentiment Analysis:** (Parallel execution to Gemini) determines anger/joy/sorrow.
3. **State System:** Managed via global Zustand store \`useCreatureStore.getState().setMood('roasting')\`.
4. **Visual Layer:** Modifies the animated SVG/3D avatar immediately reflecting the state update.

---

## 5. Unified Memory Loop

We deploy dual-stage memory:

- **Short-Term Context:** Maintained locally in standard conversation chunks sent dynamically to Gemini.
- **Long-Term Synthesized Recall:** Async backend workers summarize topics ("User cares heavily about football updates", "User is studying for Exams"), mapping them into the `Memory` Prisma table. These weights influence the system prompt later.

---

## 6. Railway Containerization

The project runs in a customized 2-stage Alpine Linux Docker build.
- **Stage 1 (Builder):** Uses `npx prisma generate` and `vite build` plus `esbuild` for server standalone packaging.
- **Stage 2 (Runner):** Moves optimized standalone chunks limiting surface area securely. Deployed natively with automatic restart policies configured in `#railway.json`.

---

## 7. PostgreSQL Database Schema

We manage a robust relational architecture holding Users, Conversations, Messages, explicit Creature States, Synthesized Memories, Achievements (Night Owl, etc.), and strict user settings.
