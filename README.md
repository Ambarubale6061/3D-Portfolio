# Animated Portfolio Site

A full-stack animated portfolio with a React/Vite frontend and an Express/Node backend.

---

## Project Structure

```
Animated-Portfolio-Site/
├── frontend/                  ← React + Vite + Tailwind + Three.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/      ← Hero, About, Skills, Services, Projects,
│   │   │   │                     Experience, Testimonials, Contact, Navbar
│   │   │   ├── ui/            ← shadcn/ui base components
│   │   │   ├── ChatBubble.tsx ← AI chat widget (calls /api/chat)
│   │   │   ├── Earth3D.tsx    ← WebGL 3D Earth (Three.js / R3F)
│   │   │   ├── FloatingRobot.tsx
│   │   │   ├── MagicCursor.tsx
│   │   │   ├── ResumeQRModal.tsx
│   │   │   ├── RobotAvatar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   │   ├── resume.ts      ← PDF resume download logic
│   │   │   ├── robotSound.ts  ← Sound effects
│   │   │   ├── utils.ts
│   │   │   └── webgl.ts       ← WebGL feature detection
│   │   ├── pages/
│   │   ├── App.tsx
│   │   ├── index.css          ← Tailwind + CSS variables (dark theme)
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts         ← Proxies /api → localhost:3001
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── backend/                   ← Express + TypeScript + OpenAI streaming
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.ts        ← POST /api/chat — SSE streaming to OpenAI
│   │   │   ├── health.ts      ← GET /api/healthz
│   │   │   └── index.ts       ← Registers all routes
│   │   ├── lib/
│   │   │   └── logger.ts      ← Pino logger
│   │   ├── app.ts             ← Express app setup (CORS, JSON, routes)
│   │   └── index.ts           ← Starts the server on port 3001
│   ├── build.mjs              ← esbuild script → dist/index.mjs
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── package.json               ← npm workspaces root
├── .gitignore
└── README.md
```

---

## How Frontend & Backend Connect

```
Browser
  │
  ├── Loads from  → frontend (Vite dev server :5173)
  │
  └── POST /api/chat ──proxy──→ backend (Express :3001)
                                    │
                                    └── Streams response from OpenAI
```

The Vite dev server (`frontend/vite.config.ts`) proxies all `/api/*` requests
to `http://localhost:3001`. So the frontend never hard-codes the backend URL —
it just calls `/api/chat` and Vite handles the rest in development.

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- An **OpenAI API key** (for the AI chat widget)

---

## Setup

### 1. Install all dependencies (both frontend and backend)

```bash
npm install
```

This uses npm workspaces and installs everything in one command.

### 2. Configure environment variables

**Backend:**

```bash
cd backend
cp .env.example .env
# Open .env and paste your OPENAI_API_KEY
```

**Frontend** (optional — only needed if you want a custom port):

```bash
cd frontend
cp .env.example .env
```

---

## Running the Project

### Run both at the same time (recommended)

From the root directory:

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) concurrently.

Then open → **http://localhost:5173**

---

### Run them separately (two terminals)

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
# Server starts on http://localhost:3001
# Test it: curl http://localhost:3001/api/healthz
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

---

## Building for Production

```bash
# From the root
npm run build
```

This compiles:

- **Backend** → `backend/dist/index.mjs` (run with `node dist/index.mjs`)
- **Frontend** → `frontend/dist/` (serve with any static host: Vercel, Netlify, Nginx, etc.)

### Production start:

```bash
# Backend
cd backend
npm run start

# Frontend — serve the static dist/ with a web server
cd frontend
npm run serve    # vite preview (for testing only)
```

---

## Key Files to Edit

| What you want to change  | File                                                |
| ------------------------ | --------------------------------------------------- |
| Your name, bio, stats    | `frontend/src/components/sections/About.tsx`        |
| Hero headline            | `frontend/src/components/sections/Hero.tsx`         |
| Contact email/location   | `frontend/src/components/sections/Contact.tsx`      |
| AMBI chatbot personality | `backend/src/routes/chat.ts` → `SYSTEM_PROMPT`      |
| AI model used            | `backend/src/routes/chat.ts` → `model: "gpt-4o"`    |
| Color theme              | `frontend/src/index.css` → CSS variables in `:root` |
| Backend port             | `backend/.env` → `PORT=3001`                        |
| Frontend port            | `frontend/.env` → `PORT=5173`                       |

---

## Troubleshooting

**Chat widget says "Connection hiccup"**  
→ Make sure the backend is running and your `OPENAI_API_KEY` is set in `backend/.env`

**`npm install` fails**  
→ Make sure you're using Node 18+ (`node --version`) and npm 9+ (`npm --version`)

**Frontend can't reach `/api`**  
→ Check that the backend is running on port 3001. The Vite proxy in `frontend/vite.config.ts` expects the backend there.
