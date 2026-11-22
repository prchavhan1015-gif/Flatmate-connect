# Tech Stack & File Guide

This document explains **every technology used in this project and exactly
what it's for**, plus a file-by-file map of the whole codebase. It's written
for someone who's comfortable with basic JavaScript/React but hasn't used
some of these specific tools before.

For a quick "how do I run this" see [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).

---

## 1. The stack, in one table

| Technology | What it actually does here |
|---|---|
| **React** | Builds the UI out of reusable components (`<Navbar />`, `<Button />`, etc). Everything you see on screen is a React component. |
| **Vite** | The build tool / dev server. Runs `npm run dev` to instantly preview your code in the browser with hot-reload, and `npm run build` to produce the optimized files you'd deploy. |
| **react-router-dom** | Client-side routing. Decides which page component to show for a given URL (`/login` → `LoginPage`, `/profile` → `ProfilePage`) without a full page reload. |
| **Tailwind CSS** | Styling, via utility classes written directly in JSX (`className="flex items-center gap-2"`) instead of separate `.css` files per component. |
| **Radix UI** | A small set of unstyled, accessible component "primitives" (dropdown select, accordion, progress bar, label) that handle the fiddly keyboard/screen-reader behavior correctly. We style them with Tailwind on top — see `src/components/ui/`. |
| **lucide-react** | The icon set (`<Home />`, `<LogOut />`, etc — every icon in the app comes from this package). |
| **zod** | Validates form input (e.g. "is this a real email address?", "is the password at least 8 characters?") and produces friendly error messages. |
| **sonner** | The little toast notifications that pop up ("Welcome back!", "Profile saved!"). |
| **class-variance-authority, clsx, tailwind-merge** | Small helpers for building components that have style "variants" (e.g. `<Button variant="outline">` vs `<Button variant="hero">`) without the className strings turning into spaghetti. |
| **ESLint + Prettier** | ESLint catches likely bugs (unused variables, broken React Hook usage). Prettier auto-formats code consistently. Neither one runs in the browser — they're editor/CI tools only. |

**Notably absent:** no TypeScript (plain JavaScript/JSX instead — see §4), no
backend framework, no database, no authentication service. See §2.

---

## 2. There is no backend — on purpose

This app has **no server and no database**. Every "backend" operation —
signing up, logging in, saving a profile, uploading a photo — is implemented
in [`frontend/src/lib/db.js`](./frontend/src/lib/db.js) using nothing but
the browser's built-in `localStorage`.

Why: this project is meant to run entirely on one machine with zero setup —
no accounts to create, no API keys, no internet connection required. Open
`frontend/src/lib/db.js` and you'll find the entire "backend" in one
readable file — no framework, no ORM, just JavaScript objects saved as JSON.

**The tradeoff:** data only exists in the one browser that created it.
There's no way for two people to see each other's profiles, since there's no
shared server. If this ever needed to become a real multi-user product,
`db.js` is the one file that would need to be replaced with real API calls —
every other file in the app talks to `db.js`, not to `localStorage`
directly, specifically so that swap would be contained to one place.

---

## 3. How the pieces fit together

```
index.html
  └─ loads src/main.jsx
       └─ renders <App /> inside a <BrowserRouter>
            └─ App.jsx wraps everything in:
                 ThemeProvider   (light/dark mode)
                 AuthProvider    (who's logged in, from db.js)
                 ErrorBoundary   (catches crashes, shows a friendly message)
                 <Routes>        (react-router-dom: URL → page component)
```

A typical user action, end to end — signing up:

1. User fills the form on `SignupPage.jsx` and clicks "Sign up".
2. `SignupPage` calls `db.auth.signUp(...)` (from `lib/db.js`).
3. `db.js` writes the new account into `localStorage` and starts a session.
4. `lib/auth.jsx`'s `AuthProvider` is listening for that session change and
   updates React state — every component using `useAuth()` re-renders
   automatically (e.g. the Navbar now shows the profile avatar).
5. `SignupPage` navigates to `/onboarding` using react-router-dom.

---

## 4. Why plain JavaScript instead of TypeScript

Earlier versions of this project used TypeScript (`.ts`/`.tsx` files, type
annotations everywhere). It's been converted to plain JavaScript (`.js`/
`.jsx`) to keep the code approachable — no type syntax to learn, and any
file can be read top-to-bottom without needing to understand generics or
interfaces.

The tradeoff: JavaScript won't catch a typo like `profile.fullname` (should
be `full_name`) until you actually run that code path, whereas TypeScript
would catch it while you type. For a project this size, that's a fine
trade — the file-header comments and readable code are meant to make up the
difference.

There's still a `jsconfig.json` in `frontend/` — that's not TypeScript, it
just tells your editor (VS Code, etc.) where `@/` imports point to, so you
still get autocomplete and "jump to definition" without any type checking.

---

## 5. Full file map

```
.
├── README.md                Original product brief / roadmap
├── PROJECT_OVERVIEW.md       Quick overview + how to run
├── TECH_STACK.md             This file
│
└── frontend/                 The entire app — this is the whole project
    ├── index.html             The one HTML page. Vite injects the built
    │                          JS/CSS into it. <div id="root"> is where
    │                          React mounts.
    ├── vite.config.js         Build tool config: React plugin, Tailwind
    │                          plugin, and the "@/ means src/" alias.
    ├── eslint.config.js       Lint rules (catches bugs, not style).
    ├── jsconfig.json          Editor-only config for "@/" import autocomplete.
    ├── package.json           Dependency list + npm scripts (dev/build/lint).
    │
    ├── public/                 Files served as-is (not processed by Vite).
    │   ├── favicon.ico
    │   └── robots.txt
    │
    └── src/
        ├── main.jsx             Entry point. Mounts <App /> into the page.
        ├── App.jsx              Sets up providers (theme/auth) and the
        │                        page routes (URL → component mapping).
        ├── styles.css           All CSS: Tailwind setup, color theme
        │                        (light + dark), fonts, animations.
        │
        ├── assets/               Images used on the landing page.
        │
        ├── pages/                 One file per page/URL:
        │   ├── HomePage.jsx         "/"           — the landing page
        │   ├── LoginPage.jsx        "/login"      — log in form
        │   ├── SignupPage.jsx       "/signup"     — sign up form
        │   ├── OnboardingPage.jsx   "/onboarding" — 3-step profile form
        │   ├── ProfilePage.jsx      "/profile"    — read-only profile view
        │   └── NotFoundPage.jsx     any other URL — 404 page
        │
        ├── components/            Reusable pieces shared across pages:
        │   ├── ErrorBoundary.jsx    Catches crashes app-wide.
        │   ├── RequireAuth.jsx      Wraps a page so it redirects to
        │   │                        /login if nobody's signed in.
        │   ├── ProfileAvatar.jsx    Profile photo (or initials fallback).
        │   ├── InterestChips.jsx    The pill-shaped interest tags.
        │   ├── SectionHeading.jsx   "Eyebrow + title" heading block.
        │   ├── ThemeToggle.jsx      The light/dark mode button.
        │   │
        │   ├── layout/               Bigger structural pieces:
        │   │   ├── Navbar.jsx          Top nav bar, on every page.
        │   │   ├── Footer.jsx          Bottom footer, on every page.
        │   │   └── AuthLayout.jsx      Two-column layout used by
        │   │                          Login/Signup only.
        │   │
        │   └── ui/                   Small, generic, styled building
        │       │                     blocks used to build the components
        │       │                     above (buttons, inputs, dropdowns...).
        │       │                     Each one wraps a Radix UI primitive
        │       │                     (or is plain HTML) with Tailwind
        │       │                     styling. Only the ones actually used
        │       │                     anywhere in the app are kept here.
        │       ├── button.jsx
        │       ├── input.jsx
        │       ├── textarea.jsx
        │       ├── label.jsx
        │       ├── select.jsx
        │       ├── progress.jsx
        │       ├── accordion.jsx
        │       ├── loader.jsx
        │       └── sonner.jsx          (toast notification container)
        │
        └── lib/                    Logic that isn't a visual component:
            ├── db.js                 The entire "backend" — see §2.
            ├── auth.jsx               React context: "who's logged in"
            │                         (built on top of db.js).
            ├── profile.js             Helpers: completion %, avatar
            │                         lookup, name → initials.
            ├── demo-data.js           Static text/content for the
            │                         landing page (not user data).
            ├── theme.jsx              Light/dark mode context.
            ├── use-page-title.js      One-line hook to set the browser
            │                         tab title per page.
            └── utils.js               `cn()` — merges Tailwind class names.
```

---

## 6. Everyday commands

All run from inside `frontend/`:

| Command | What it does |
|---|---|
| `npm install` | Downloads all dependencies (run this once after cloning). |
| `npm run dev` | Starts the local dev server at http://localhost:8080 with hot-reload. |
| `npm run build` | Builds the optimized production files into `frontend/dist/`. |
| `npm run preview` | Serves the built `dist/` folder locally, to sanity-check a build. |
| `npm run lint` | Checks the code for likely mistakes. |
| `npm run format` | Auto-formats every file with Prettier. |
