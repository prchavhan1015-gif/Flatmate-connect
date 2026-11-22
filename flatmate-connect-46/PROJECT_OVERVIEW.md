# RoomMate — Project Overview

RoomMate is a roommate-finder web app for students and working
professionals: create a profile, set your budget/city/lifestyle
preferences, and (in later phases) get matched with compatible
roommates and rooms.

This is a **local-only** build: it's a plain React + Vite single-page app
with no backend, no database, and no TypeScript. Everything (auth,
profiles, avatar "uploads") lives entirely in your browser's
`localStorage`. Clone it and run it — no `.env` file, no accounts to
create, nothing to configure.

For a full breakdown of every technology used and what it's for, plus a
file-by-file map of the codebase, see [TECH_STACK.md](./TECH_STACK.md).

## Tech stack (short version)

- React + Vite + react-router-dom — the app itself and page navigation
- Tailwind CSS + Radix UI — styling and accessible UI primitives
- Plain JavaScript (no TypeScript)
- Browser `localStorage` — the entire "backend" (see `frontend/src/lib/db.js`)

## Folder structure

```
.
├── frontend/           the entire application — this is the whole project
│   ├── src/
│   │   ├── pages/             one file per page (Home, Login, Signup, Onboarding, Profile, 404)
│   │   ├── components/        shared UI (Navbar, Footer, form fields, buttons, ...)
│   │   ├── lib/                non-visual logic: db.js (the "backend"), auth, theme, helpers
│   │   ├── App.jsx             routes + providers
│   │   └── main.jsx            entry point
│   ├── vite.config.js
│   └── package.json
│
├── PROJECT_OVERVIEW.md  this file
└── TECH_STACK.md        full tech-stack breakdown + file-by-file guide
```

There's no server of any kind — `frontend/` is a static site once built
(`npm run build` produces plain HTML/CSS/JS in `frontend/dist/`). Every
data operation (auth, profile reads/writes, avatar uploads) happens
entirely in the browser, against `localStorage`.

## How the local "backend" works

Everything lives in [frontend/src/lib/db.js](./frontend/src/lib/db.js) —
sign up, log in, log out, save/read a profile, and store an avatar photo,
all backed by these `localStorage` keys:

- `roommate_local_users` / `roommate_local_session` — accounts and the active session
- `roommate_local_profiles` — profile data (budget, city, lifestyle, interests, ...)
- `roommate_local_avatar:*` — avatar images, stored as data URLs

Because everything lives in `localStorage`, accounts only exist in the one
browser that created them — clearing site data (or opening a different
browser) resets the app to a blank state.

## Running locally

```sh
cd frontend
npm install
npm run dev
```

Then open http://localhost:8080 and sign up — no credentials or setup
needed.

To build for production:

```sh
cd frontend
npm run build
npm run preview   # to try the production build locally
```
