# HairCoaction

A modern web app built with Vite + React + TypeScript + Tailwind CSS and Firebase Authentication. The project includes a production-ready CI/CD pipeline using GitHub Actions and Netlify for automatic deployments.

## Table of Contents
- Overview
- Tech Stack
- Features
- Project Structure
- Pages & Routes
- Getting Started (Local Setup)
- Scripts
- CI (Continuous Integration)
- CD (Continuous Deployment)
- API Stubs (Future Backend)
- Troubleshooting
- Roadmap / Next Steps

## Overview
HairCoaction provides a polished landing experience, authentication, and a dashboard with modular sections for future expansion (education, events, consultations, community, profile). The codebase emphasizes responsiveness, accessibility, and maintainability, with automated CI/CD for reliable releases.

## Tech Stack
- Build tooling: Vite 7
- Frontend: React 18, TypeScript 5, Tailwind CSS 3
- Routing: react-router-dom
- Auth: Firebase Authentication (email/password + Google)
- Icons & UI: lucide-react
- Animations: CSS + small libraries
- DevOps: GitHub Actions (CI) + Netlify (CD)

## Features
- Landing page with hero, features, pricing, testimonials, CTA, contact, and footer
- Authentication: email/password and Google sign-in
- Protected dashboard with tabs: Home, Education, Consultation, Event, Community, Profile, Tutorial
- Dark/Light theme toggle with persistence
- Responsive, mobile-first design and accessible focus states
- Automated CI checks (lint, typecheck, build) and auto-deploy on main

## Project Structure
```
.
├─ api/
│  ├─ community.ts
│  ├─ consultation.ts
│  ├─ education.ts
│  ├─ event.ts
│  ├─ profile.ts
│  ��─ server.ts
├─ src/
│  ├─ components/
│  │  ├─ BeautifulLoader.tsx
│  │  ├─ Community.tsx
│  │  ├─ Consultation.tsx
│  │  ├─ Education.tsx
│  │  ├─ EventPage.tsx
│  │  ├─ Home.tsx
│  │  ├─ Landingpage.tsx
│  │  ├─ Login.tsx
│  │  ├─ NotFound404.tsx
│  │  ├─ Profile.tsx
│  │  ├─ Sidebar.tsx
│  │  ├─ Signup.tsx
│  │  └─ Tutorial.tsx
│  ├─ pages/
│  │  ├─ DashboardPage.tsx
│  │  └─ Landingpage.tsx
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ firebase.ts
├─ public assets (favicon in index.html)
├─ .github/workflows/ci.yml
├─ .github/workflows/deploy-netlify.yml
├─ netlify.toml
├─ package.json
└─ README.md
```

## Pages & Routes
- / → Public landing page (redirects to /dashboard if authenticated)
- /login, /signup → Public authentication routes
- /dashboard → Protected; visible after login (tabs rendered by DashboardPage)
- Convenience protected routes (redirect into dashboard):
  - /event, /education, /consultation, /community, /profile
- 404 fallback → NotFound404

Routing is defined in ./src/App.tsx and dashboard content in ./src/pages/DashboardPage.tsx.

## Getting Started (Local Setup)
Prerequisites: Node.js 18+ (CI uses Node 20)

1) Install dependencies
- npm ci

2) Start the dev server (Vite default port 5173)
- npm run dev
- Open http://localhost:5173/

3) Build for production
- npm run build

4) Preview production build
- npm run preview

Firebase Authentication
- The app is configured via ./firebase.ts. It currently points to a Firebase project for demonstration.
- To use your own Firebase project, replace the config in ./firebase.ts with your project values and ensure your domain (localhost and deployment host) is added under Firebase Authentication → Authorized domains.

## Scripts
- dev: start Vite dev server
- build: production build
- preview: preview the production build
- lint: run eslint
- typecheck: run TypeScript without emitting

## CI (Continuous Integration)
Workflow: ./.github/workflows/ci.yml
- Trigger: on every push and pull request
- Steps: npm ci → lint → typecheck → build → upload dist as artifact
- Purpose: catch errors early and ensure reproducible builds across machines

## CD (Continuous Deployment)
Workflow: ./.github/workflows/deploy-netlify.yml
- Trigger: push to main
- Build: npm ci → npm run build
- Deploy: Netlify CLI deploys ./dist to production
- Required GitHub repo secrets:
  - NETLIFY_SITE_ID: your Netlify site ID
  - NETLIFY_AUTH_TOKEN: a Netlify personal access token
Configuration: ./netlify.toml (publish=dist, command=npm run build)

## API Stubs (Future Backend)
Server entry: ./api/server.ts
- Endpoints (mock):
  - /api/profile (GET/POST)
  - /api/event (GET/POST)
  - /api/education (GET/POST)
  - /api/consultation (GET/POST)
  - /api/community (GET/POST)
Run locally (optional):
- npx ts-node ./api/server.ts (listens on http://localhost:4000)
Note: The frontend does not rely on these stubs yet; they are placeholders for future data integration.

## Troubleshooting
- Dev server doesn’t open: ensure port 5173 is available; then run npm run dev and visit http://localhost:5173/
- Firebase auth errors: add localhost and deployment host to Authorized domains in Firebase Console; ensure sign-in methods (Email/Password, Google) are enabled.
- Netlify deploy fails: confirm NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN secrets are set; check workflow logs.
- Type errors or build failures: run npm run typecheck and npm run build locally to reproduce and fix.

## Roadmap / Next Steps
- Replace mock API with a real backend (recommended: Supabase/Postgres or Express + Postgres) and add role-based access control.
- Add tests: Vitest + React Testing Library (unit) and Playwright (E2E), integrated into CI gates.
- Observability and security: Sentry for error monitoring and Semgrep for security scanning.
- Move Firebase config to environment variables (Vite VITE_*), injected via repository secrets in CI.

---
Maintainer: Pankaj Kumar
