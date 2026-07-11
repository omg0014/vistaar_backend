# Codebase Guide — UDISE+ School Information Portal

> **Start here if you are new to this project.**
> Read this file top to bottom. Every section tells you *which file to open next* and *what to look for*.

---

## 1. What Is This Project?

This is a **full-stack web clone of [kys.udiseplus.gov.in](https://kys.udiseplus.gov.in)** — the Indian government's school data portal.

- It lets you search for any school in India, view its stats, infrastructure, teachers, and enrolment data.
- Data is **live** — it comes from the real UDISE+ government API.
- You **cannot** modify or write any data. The app is read-only.

**Tech stack at a glance:**

| Side     | Technology                             |
|----------|----------------------------------------|
| Frontend | React 18 + Vite + CSS Modules          |
| Backend  | Node.js + Express 5                    |
| API data | UDISE+ government API (upstream)       |
| HTTP lib | axios (backend) / fetch (frontend)     |

---

## 2. How to Run It (30 seconds)

```bash
# From the project root (yugam_project1/)
npm run dev
```

This starts **both servers at once** using `concurrently`:
- Backend → `http://localhost:3001`
- Frontend → `http://localhost:5173`

Open `http://localhost:5173` in your browser.

> If you get a port error, kill stale processes:
> ```bash
> lsof -ti:3001 | xargs kill -9
> lsof -ti:5173 | xargs kill -9
> ```

---

## 3. Folder Structure Overview

```
yugam_project1/
│
├── package.json              ← ROOT: dev script (runs both servers)
│
├── backend/                  ← Node/Express server
│   ├── .env                  ← SECRET keys (never commit this)
│   ├── server.js             ← Entry point — mounts all routes
│   ├── udise.js              ← Thin re-export → delegates to services/udise.js
│   ├── services/
│   │   └── udise.js          ← Axios helper — all upstream API calls go here
│   └── routes/
│       ├── search.js         ← /api/search/*  (captcha, verify-captcha, search, keyword, categories)
│       ├── schools.js        ← /api/schools/*
│       ├── region.js         ← /api/region/*
│       └── masters.js        ← /api/masters/*
│
├── frontend/
│   ├── vite.config.js        ← Proxy: /api → localhost:3001
│   └── src/
│       ├── main.jsx          ← React entry point
│       ├── App.jsx           ← All URL routes defined here
│       │
│       ├── utils/            ← Pure helpers (no React, no network)
│       │   ├── formatters.js ← clean(), v(), formatNum()
│       │   └── constants.js  ← YEAR_OPTIONS, STATS_YEAR_OPTIONS, NATIONAL_REGION_CD
│       │
│       ├── services/         ← All network calls (no fetch() anywhere else)
│       │   ├── api.js        ← Base fetch wrapper
│       │   ├── searchService.js   ← getCaptcha, verifyCaptcha, searchSchools, searchByKeyword
│       │   ├── schoolService.js
│       │   ├── regionService.js
│       │   └── mastersService.js
│       │
│       ├── hooks/            ← Data-fetching and shared UI logic extracted from pages
│       │   ├── useCaptcha.js          ← captchaImg + captchaInput state, refreshCaptcha()
│       │   ├── useKeywordSuggestions.js ← debounced autocomplete for keyword tab
│       │   ├── useSchoolDetail.js
│       │   └── useReportCard.js
│       │
│       ├── layout/           ← Site chrome (shown on every page)
│       │   ├── Header.jsx
│       │   ├── Navigation.jsx
│       │   └── Footer.jsx
│       │
│       ├── components/
│       │   ├── SchoolCard.jsx    ← Reusable card shown in search results
│       │   └── Accordion.jsx     ← Collapsible section used in AdvanceSearch sidebar
│       │
│       └── pages/
│           ├── Home.jsx
│           ├── AdvanceSearch.jsx
│           ├── RegionProfile.jsx
│           ├── SchoolDetail.jsx
│           ├── TrackSchool.jsx
│           ├── ReportCard/         ← Folder (complex page, split into tabs)
│           │   ├── index.jsx
│           │   ├── constants.js
│           │   ├── tabs/
│           │   │   ├── ProfileTab.jsx
│           │   │   ├── InfraTab.jsx
│           │   │   ├── TeachersTab.jsx
│           │   │   └── MinorityTab.jsx
│           │   └── components/
│           │       └── EnrolTable.jsx
│           └── policy/             ← Static legal pages (FAQ, Privacy etc.)
│
└── API_DOCS.md               ← Full reference for every UDISE+ API endpoint
```

---

## 4. Reading Order — Step by Step

Follow this order. Each step tells you exactly what to look for.

---

### STEP 1 — Understand the entry points

**Read: `package.json` (root)**

Look at the `scripts` section. The single `npm run dev` command runs both servers simultaneously using `concurrently`. That is the only command you ever need.

---

### STEP 2 — Understand the backend secret

**Read: `backend/.env`**

```
PORT=3001
UDISE_BASE=https://kys.udiseplus.gov.in/web-app/api
X_APP_SIGNATURE=9f2c7a4b8e1d6c3f5a9b0e2d4f6a7c8b
```

**Key concept:** The `X_APP_SIGNATURE` is a secret header that the UDISE+ government API requires on every request. Without it, the API returns no data. This value must **never** be sent to the browser — that is the whole reason we have a backend at all.

---

### STEP 3 — Understand the backend entry point

**Read: `backend/server.js`**

This is a standard Express app. There are only 4 things it does:
1. Loads `.env` secrets via `require('dotenv').config()`
2. Enables CORS so the frontend can call it
3. Mounts 4 route files under `/api/*`
4. Starts listening on port 3001

---

### STEP 4 — Understand how the backend calls the UDISE+ API

**Read: `backend/services/udise.js`**

This is the most important file in the backend. It is a tiny wrapper around axios that:
- Prepends the base URL (`https://kys.udiseplus.gov.in/web-app/api`)
- Injects the secret `X-APP-SIGNATURE` header on every call
- Returns the response data directly

**Every single route calls this function.** No route ever uses axios directly.

Usage pattern you will see everywhere in routes:
```js
const data = await udise('some/path', { param1: value1 });
res.json(data);
```

> `backend/udise.js` at the root is just a thin re-export of `services/udise.js` — kept for backward compatibility.

---

### STEP 5 — Read the backend routes (one at a time)

Now read each route file. They all follow the same 3-line pattern:

```js
router.get('/endpoint', async (req, res) => {
  const data = await udise('upstream-path', req.query);
  res.json(data);
});
```

**Read: `backend/routes/masters.js`** — Simplest file. Dropdowns.
- `GET /api/masters/years` → all academic years
- `GET /api/masters/states` → state list
- `GET /api/masters/districts` → districts for a state
- `GET /api/masters/blocks` → blocks for a district

**Read: `backend/routes/search.js`** — Search + captcha functionality.
- `GET /api/search/captcha` → fetch UDISE captcha image (base64 PNG, IP-based)
- `GET /api/search/verify-captcha?captcha=` → check if user-typed value is correct (returns `{ data: true/false }`)
- `GET /api/search?type=&param=&captcha=&stateId=` → search schools (types 1–4 require real captcha)
- `GET /api/search/keyword?q=` → autocomplete suggestions as you type (no captcha)
- `GET /api/search/categories` → school category dropdown

> **Captcha is IP-based.** Both the captcha fetch and the search call must go through this same Express server (same IP) or validation fails. The frontend never calls UDISE directly.

**Read: `backend/routes/schools.js`** — Individual school data (7 endpoints).
> **Critical:** The `:id` parameter in every URL is the **numeric schoolId** (e.g. `4583653`), NOT the 11-digit UDISE code (e.g. `27251900607`). Passing the wrong one causes a Java `NumberFormatException` in the upstream API. See Step 9 for more on this.

- `GET /api/schools/:id` → basic info
- `GET /api/schools/:id/enrolment` → student + teacher counts
- `GET /api/schools/:id/facility` → toilets, library, internet etc.
- `GET /api/schools/:id/profile` → estd year, board, medium
- `GET /api/schools/:id/report-card` → headline stats
- `GET /api/schools/:id/social?flag=N` → enrolment by category
- `GET /api/schools/:id/years` → available academic years
- `GET /api/schools/:id/track` → school history across all years

**Read: `backend/routes/region.js`** — Region-level statistics.
- `GET /api/region/facilities?regionCd=&yearId=` → facility % by region
- `GET /api/region/enrolment?regionCd=&yearId=` → enrolment % by region
- `GET /api/region/teachers?regionCd=&yearId=` → teacher % by region
- `GET /api/region/stats?regionCd=&yearId=` → school count by mgmt type (used on Home)

---

### STEP 6 — Understand how the frontend talks to the backend

**Read: `frontend/vite.config.js`**

One key setting:
```js
proxy: {
  '/api': { target: 'http://localhost:3001' }
}
```

Any `fetch('/api/...')` in the browser gets silently redirected to `http://localhost:3001/api/...`.

---

### STEP 7 — Read the frontend entry points

**Read: `frontend/src/main.jsx`** — Mounts the React app into `index.html`.

**Read: `frontend/src/App.jsx`** — All URL routes live here.

| URL Pattern                        | Page              |
|------------------------------------|-------------------|
| `/`  or  `/home`                   | Home              |
| `/region`                          | Region Profile    |
| `/advancesearch`                   | Advance Search    |
| `/schooldetail/:udise/:yearId`     | School Detail     |
| `/reportcard/:id/:yearId`          | Report Card       |
| `/trackschool?id=&name=`           | Track School      |

---

### STEP 8 — Understand the frontend layer system

The frontend is split into 5 layers. Read them in this order:

**Read: `frontend/src/utils/formatters.js`**

Three pure functions used across every page:
- `clean(val)` — strips numeric prefixes: `"2-Urban"` → `"Urban"`
- `v(val)` — returns `"NA"` for null/undefined values
- `formatNum(val)` — Indian locale comma formatting

**Read: `frontend/src/utils/constants.js`**

- `DEFAULT_YEAR_ID` — `11` (2024-25) — single source of truth for the default yearId used in API calls
- `YEAR_OPTIONS` — academic years for report card / school dropdowns (no Real Time)
- `STATS_YEAR_OPTIONS` — years for Home's "Explore State" stats (includes Real Time / `yearId=0`)
- `NATIONAL_REGION_CD` — `'50'` (national level regionCd)

**Read: `frontend/src/services/api.js`**

The base fetch wrapper. All service files call this. To add a global header or error log to every API call, change this one file.

**Read: `frontend/src/services/searchService.js`**

Wraps `/api/search/*`. Key exports:
- `getCaptcha()` — used by `useCaptcha` hook
- `verifyCaptcha(captcha)` — used in `Home.jsx` before navigating to search
- `searchSchools(type, param, yearId, captcha, stateId)` — main search
- `searchByKeyword(q)` — used by `useKeywordSuggestions` hook

Other service files follow the identical pattern:
- `schoolService.js` → wraps `/api/schools/*`
- `regionService.js` → wraps `/api/region/*`
- `mastersService.js` → wraps `/api/masters/*`

---

### STEP 9 — Read the custom hooks

Hooks sit between services and pages. They own shared state + side-effect logic so pages stay lean.

**Read: `frontend/src/hooks/useCaptcha.js`**

Returns `{ captchaImg, captchaInput, setCaptchaInput, refreshCaptcha }`.
- `refreshCaptcha()` calls `getCaptcha()` and updates `captchaImg`
- Used by both `Home.jsx` and `AdvanceSearch.jsx`

**Read: `frontend/src/hooks/useKeywordSuggestions.js`**

Takes `(keyword, activeTab)`, returns `{ suggestions, showSuggestions, setShowSuggestions }`.
- Fires `searchByKeyword` with a 300ms debounce; only active when `activeTab === 'keyword'`
- Used by both `Home.jsx` and `AdvanceSearch.jsx`

**Read: `frontend/src/hooks/useStates.js`**

Returns the full states array (loaded once on mount using `DEFAULT_YEAR_ID`).
- Used by both `Home.jsx` (School Name tab dropdown + Explore State selector) and `AdvanceSearch.jsx`

**Read: `frontend/src/hooks/useSchoolDetail.js`**

Fires 5 API calls in parallel (school, enrolment, facility, profile, report-card). Used by `SchoolDetail.jsx`.

**Read: `frontend/src/hooks/useReportCard.js`**

Fires 8 API calls in parallel. Used by `ReportCard/index.jsx`.

---

### STEP 10 — Read the layout and shared components

**Read: `frontend/src/layout/Header.jsx`** — Top logo bar.
**Read: `frontend/src/layout/Navigation.jsx`** — Nav links.
**Read: `frontend/src/layout/Footer.jsx`** — Footer with policy links.

**Read: `frontend/src/components/SchoolCard.jsx`**

Reusable card rendered in search results. Key line:
```js
const schoolId = school.schoolId || udise;
```
Always uses numeric `schoolId` for the "Know More" link — not the 11-digit UDISE code.

**Read: `frontend/src/components/Accordion.jsx`**

Collapsible section with a purple header used in the AdvanceSearch sidebar filters. Has its own `Accordion.module.css`.

---

### STEP 11 — Read the pages (in complexity order)

**Read: `frontend/src/pages/Home.jsx`**

The main landing page. Uses:
- `useCaptcha()` — captcha image and input state
- `useKeywordSuggestions(keyword, activeTab)` — autocomplete (keyword tab only)
- `verifyCaptcha()` directly in `handleSimpleSearch` — wrong captcha stays on Home; correct captcha navigates to AdvanceSearch

Flow on search:
1. User types captcha, clicks Search
2. `handleSimpleSearch` calls `verifyCaptcha()` — if wrong: show error, stay on Home
3. If correct: `navigate('/advancesearch?type=...&captcha=...')` — passes captcha in URL

---

**Read: `frontend/src/pages/AdvanceSearch.jsx`**

Reached from Home (after captcha verified) or from KVS/NVS/PM SHRI logo clicks. Uses:
- `useCaptcha()` — fresh captcha for each manual search attempt
- `useKeywordSuggestions(keyword, activeTab)` — autocomplete on keyword tab

Two auto-search paths on mount:
1. **URL params search** (`type` + `captcha`): fired once, uses the captcha passed from Home
2. **Org search** (`searchType` + `searchParam`): KVS/NVS/EMRS — uses fixed `ewDVKv` captcha

Manual search (`handleSearch`): calls `searchSchools` directly (no `verifyCaptcha` — the actual search validates the captcha server-side).

---

**Read: `frontend/src/pages/RegionProfile.jsx`**

Three cascaded dropdowns (state → district → block), fires 3 parallel stats calls.

---

**Read: `frontend/src/pages/SchoolDetail.jsx`** — Uses `useSchoolDetail(schoolId)` hook.

**Read: `frontend/src/pages/TrackSchool.jsx`** — School history timeline/list toggle views.

**Read: `frontend/src/pages/ReportCard/index.jsx`** — Uses `useReportCard(id, selectedYear)`. Sticky side-nav with IntersectionObserver.

Then read tab components: `ProfileTab`, `InfraTab`, `TeachersTab`, `MinorityTab`, `EnrolTable`.

---

## 5. Critical Concepts You Must Know

### schoolId vs udiseschCode

Every school has two IDs:

| Field          | Example         | Type   | Used for                        |
|----------------|-----------------|--------|---------------------------------|
| `schoolId`     | `4583653`       | integer| All detail API calls            |
| `udiseschCode` | `27251900607`   | string | Display only (11-digit UDISE)   |

**Always use `schoolId` (integer) for API calls.** Passing `udiseschCode` causes a `NumberFormatException` in the upstream Java API.

---

### Captcha is IP-based

UDISE ties the captcha to the **server IP** that requested it. Both the captcha image fetch and the subsequent search-schools call must pass through the same Express backend. The frontend cannot call UDISE directly.

`verifyCaptcha` does NOT consume the captcha — the same captcha can be used for the search call afterwards. It is used on Home only to give the user early feedback without navigating away.

---

### Search type mapping

| type | What it searches | Extra param |
|------|-----------------|-------------|
| `1`  | Keyword / broad school name | — |
| `2`  | School name filtered by state | `stateId` required |
| `3`  | 11-digit UDISE code exact match | — |
| `4`  | PIN code | — |
| `5`  | Management org (KVS=`92`, NVS=`93`) | fixed `ewDVKv` captcha |
| `6`  | Special category (PM SHRI=`1`, CWSN=`2`, EMRS=`3`) | fixed `ewDVKv` captcha |

---

### yearId values

| yearId | Academic Year |
|--------|---------------|
| `0`    | Real-time (live data) |
| `11`   | 2024-25 (default) |
| `10`   | 2023-24      |
| `9`    | 2022-23      |

---

### The clean() function — why it exists

The UDISE+ API returns values like `"2-Urban"`, `"1-CBSE"`, `"3-Co-educational"`. `clean()` strips the prefix before display:

```js
clean("2-Urban")    // → "Urban"
clean("1-CBSE")     // → "CBSE"
clean(null)         // → null  (safe)
```

---

## 6. How One Request Flows End-to-End

Example: User searches for a school on Home, sees results, opens detail page.

```
Home.jsx: user types captcha + keyword, clicks Search
      ↓
handleSimpleSearch() calls verifyCaptcha(captchaVal)   ← backend /api/search/verify-captcha
      ↓  (captcha correct)
navigate('/advancesearch?type=1&param=KENDRIYA&captcha=abc123')
      ↓
AdvanceSearch.jsx mounts, reads URL params
      ↓
mount useEffect calls searchSchools('1', 'KENDRIYA', 0, 'abc123')
      ↓
searchService.js: apiFetch('/api/search?type=1&param=KENDRIYA&captcha=abc123')
      ↓
vite proxy → http://localhost:3001/api/search?...
      ↓
backend/routes/search.js → udise('search-schools', { searchType: 1, searchParam: 'KENDRIYA', captcha: 'abc123' })
      ↓
backend/services/udise.js adds X-APP-SIGNATURE → calls UDISE+ government API
      ↓
Results rendered as SchoolCard list — each card links to /schooldetail/:schoolId
      ↓
User clicks Know More → SchoolDetail.jsx → useSchoolDetail(schoolId) fires 5 parallel calls
```

---

## 7. Where to Make Common Changes

| Task                                  | File to edit                                |
|---------------------------------------|---------------------------------------------|
| Add a new academic year to dropdowns  | `frontend/src/utils/constants.js`           |
| Change how API values are displayed   | `frontend/src/utils/formatters.js`          |
| Add a new school API endpoint         | `backend/routes/schools.js` + `frontend/src/services/schoolService.js` |
| Add a new page / URL route            | `frontend/src/App.jsx` + new page file      |
| Change the secret API key             | `backend/.env`                              |
| Add a global fetch header or log      | `frontend/src/services/api.js`              |
| Fix a broken dropdown (states etc.)   | `backend/routes/masters.js`                 |
| Change the default academic year      | `frontend/src/utils/constants.js` (`DEFAULT_YEAR_ID`) |
| Change captcha fetch/display logic    | `frontend/src/hooks/useCaptcha.js`          |
| Change keyword autocomplete behavior  | `frontend/src/hooks/useKeywordSuggestions.js` |
| Change which year states are loaded for | `frontend/src/hooks/useStates.js`          |
| Change search sidebar filters         | `frontend/src/pages/AdvanceSearch.jsx` + `frontend/src/components/Accordion.jsx` |
| Change navigation links               | `frontend/src/layout/Navigation.jsx`        |
| Change a Report Card section          | The relevant tab in `ReportCard/tabs/`      |

---

## 8. Files You Can Safely Ignore

| File                                    | Why you can skip it                          |
|-----------------------------------------|----------------------------------------------|
| `backend/udise.js`                      | Thin re-export of `services/udise.js` — no logic here |
| `frontend/public/styles/global-angular.css` | Copied from original gov site, do not modify |
| `frontend/eslint.config.js`             | Linter config, not business logic            |
| `frontend/package-lock.json` / `backend/package-lock.json` / `package-lock.json` | Auto-generated, never edit |
| `frontend/src/pages/policy/`            | Static legal text pages, no logic            |

---

## 9. Further Reference

**`API_DOCS.md`** — Full reference for every UDISE+ upstream API. Covers field names, example values, and what each field means in plain English.
