# Working Notes — Stress & Mental Health Survey

> **INTERNAL DOCUMENT — NOT PUBLIC FACING.**
> This file is for the developer and any AI assistants working on this project.
> Update this file at the end of every working session before closing.

---

## How to Use This File (For AI Assistants)

1. **Read this entire file first** before writing a single line of code or making any suggestion.
2. **Read `README.md` next** for public-facing context, setup instructions, and the tech stack overview.
3. **Do not change folder structure or file naming conventions** without discussing it with the developer first.
4. **Follow all conventions exactly** as described in the Conventions section — naming, code style, routing, Tailwind class patterns, and Supabase usage.
5. **Do not suggest anything listed in "What Was Tried and Rejected"** — those decisions are final for this project.
6. **Ask before making large structural changes** — refactoring routing, replacing the Supabase client, changing the chart library, or restructuring the page layout all require explicit approval.
7. **This project was built with AI assistance** — refactor conservatively. Prefer targeted edits over rewrites. If something looks unusual but works, leave it alone unless there is a clear bug.
8. **Environment variables prefixed with `VITE_`** are baked into the bundle at build time. Never suggest moving them to a backend or server-side context — there is no backend in this project.

---

## Current State

**Last Updated:** 2026-03-24

The app is a complete, working single-page application. All three pages are implemented and tested. Supabase connectivity is confirmed. The app runs cleanly in the Replit development environment with no console errors. It has not yet been deployed to Azure Static Web Apps.

### What Is Working

- [x] Home page (`/`) — hero text, "Take the Survey" and "View Results" buttons, footer
- [x] Survey page (`/survey`) — all 7 questions with full client-side validation
- [x] Conditional "Other" text inputs (stress sources and coping methods) with auto-focus on reveal
- [x] Confirmation screen after successful submission showing a summary of the user's answers
- [x] Supabase insert — `mental_health_survey_results` table receives rows correctly
- [x] Results page (`/results`) — fetches all rows from Supabase and renders 5 charts
- [x] Stress Frequency bar chart (vertical)
- [x] Mental Health Ratings bar chart (vertical)
- [x] Top Stress Sources horizontal bar chart (sorted descending)
- [x] Coping Methods horizontal bar chart (sorted descending)
- [x] School Support pie chart with percentage labels
- [x] "Other" write-in text is surfaced in charts as `Other: <text>`
- [x] Empty state on Results page (0 responses) — prompt links to survey
- [x] Error and retry state on Results page (Supabase fetch failure)
- [x] WCAG 2.1 AA accessible: `aria-invalid`, `aria-describedby`, `aria-required`, `role="alert"`, `aria-live="polite"`, focus rings on all interactive elements
- [x] Fully responsive — single column on mobile, centered max-width on desktop
- [x] Footer on all three pages: "Survey by Brianne Bonus, BAIS:3300 - spring 2026."
- [x] `staticwebapp.config.json` in `public/` for Azure SWA SPA routing fallback
- [x] `README.md` at project root
- [x] `WORKING_NOTES.md` at project root (this file)

### What Is Partially Built

- [ ] Azure Static Web Apps deployment — `staticwebapp.config.json` is in place, but `vite.config.ts` still throws if `PORT` or `BASE_PATH` env vars are absent (Replit-specific requirement). The config needs a small change before running `vite build` on Azure.

### What Is Not Started

- [ ] CSV / JSON export of raw responses
- [ ] Admin/password-protected view of results
- [ ] Major field grouping / normalization on the Results page
- [ ] Trend-over-time chart (responses by week)
- [ ] Rate limiting / anti-spam on form submissions
- [ ] Any form of authentication

---

## Current Task

The application is feature-complete for its v1.0.0 scope. The immediate pending item is deploying to Azure Static Web Apps. Before doing so, `vite.config.ts` must be updated to make `PORT` optional (only used by the dev server, not the build step) and to default `BASE_PATH` to `"/"` when not provided by the environment.

**Single next step:** Update `artifacts/survey-app/vite.config.ts` — replace the hard throws for `PORT` and `BASE_PATH` with safe fallbacks, then run `vite build` to confirm the production bundle compiles cleanly.

---

## Architecture and Tech Stack

| Technology | Version | Why It Was Chosen |
|---|---|---|
| React | 18 (catalog) | Component model, hooks, and ecosystem maturity |
| Vite | (catalog) | Fast HMR in Replit; straightforward static build output |
| TypeScript | 5.9 | Type safety for form state, Supabase response shapes, and chart data |
| Tailwind CSS | (catalog) | Utility-first; co-locates styles with markup; no CSS file sprawl |
| `@supabase/supabase-js` | ^2.100.0 | Official Supabase client; handles auth, RLS headers, and query building |
| Recharts | ^2.15.2 | Already in the scaffold; declarative API; good accessibility support |
| wouter | ^3.3.5 | Already in the scaffold; lightweight SPA router; smaller than react-router-dom |
| pnpm workspaces | 9 | Monorepo tooling already in place for the broader project |
| Supabase (hosted) | — | User already had a Supabase project; no backend infrastructure to manage |

---

## Project Structure Notes

```text
artifacts/survey-app/
├── public/
│   └── staticwebapp.config.json  # SPA fallback for Azure SWA — routes all paths to index.html
├── src/
│   ├── components/
│   │   ├── Footer.tsx            # Shared footer — renders the exact attribution string
│   │   └── ui/                   # Radix/Shadcn primitives — not used by survey pages directly
│   ├── hooks/                    # Scaffold hooks (use-mobile, use-toast) — not used by survey pages
│   ├── lib/
│   │   ├── supabaseClient.ts     # Single export: `supabase` client + `SurveyResponse` interface
│   │   └── utils.ts              # `cn()` helper (clsx + tailwind-merge)
│   ├── pages/
│   │   ├── Home.tsx              # Landing page; no data fetching
│   │   ├── Survey.tsx            # All form logic; local state only; inserts to Supabase on submit
│   │   ├── Results.tsx           # Fetches all rows from Supabase on mount; computes chart data client-side
│   │   └── not-found.tsx         # 404 fallback
│   ├── App.tsx                   # WouterRouter with BASE_URL base path + Switch/Route declarations
│   ├── index.css                 # Global styles + Tailwind directives; custom HSL CSS vars
│   └── main.tsx                  # ReactDOM.createRoot entry point
├── index.html                    # HTML shell; title and meta tags for SEO
├── vite.config.ts                # Reads PORT and BASE_PATH from env; Replit-specific plugins gated on REPL_ID
├── tsconfig.json                 # Extends tsconfig.base.json; paths alias @ → src/
└── package.json                  # Dependencies; scripts: dev, build, serve, typecheck
```

### Non-Obvious Decisions

- **`ui/` components are unused by the survey pages.** They came with the Replit React-Vite scaffold. They are not imported by `Home.tsx`, `Survey.tsx`, or `Results.tsx`. Do not add them without a reason — the survey uses plain semantic HTML elements with Tailwind classes for full control over accessibility attributes.
- **Form state is all local React `useState`.** There is no form library (React Hook Form is in devDependencies from the scaffold but not used). The survey is simple enough that a form library would add more complexity than it saves.
- **Chart data is computed entirely client-side in `Results.tsx`.** `countOccurrences()` reduces the raw array of all responses into frequency maps. This is fine at the expected response volumes (hundreds to low thousands). If responses grow to tens of thousands, push aggregation to a Supabase RPC or view.
- **`wouter` `<Link>` renders its own `<a>` tag.** Never wrap an `<a>` inside `<Link>` — this was a bug that was fixed and must not be reintroduced.
- **Accent color is hardcoded as `#8A3BDB`** in Tailwind arbitrary-value classes and also as the `ACCENT` constant in `Results.tsx`. It is not a CSS variable. If the color ever changes, it must be updated in both places.

### Files/Folders That Must Not Be Changed Without Discussion

- `artifacts/survey-app/public/staticwebapp.config.json` — required for Azure SWA routing; removing or changing the `navigationFallback` will break direct URL access to `/survey` and `/results`.
- `artifacts/survey-app/src/lib/supabaseClient.ts` — the `SurveyResponse` interface must stay in sync with the Supabase table schema. Column names use snake_case to match the database.
- `artifacts/survey-app/src/components/Footer.tsx` — the attribution string is exact and required: `Survey by Brianne Bonus, BAIS:3300 - spring 2026.`

---

## Data / Database

**Provider:** Supabase (PostgreSQL, hosted)
**Table:** `mental_health_survey_results`

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `uuid` | Auto | `gen_random_uuid()` default; not sent by client |
| `created_at` | `timestamptz` | Auto | `now()` default; not sent by client |
| `year_in_college` | `text` | Yes | One of: `freshman`, `sophomore`, `junior`, `senior` |
| `major` | `text` | Yes | Free-text; trimmed before insert |
| `stress_frequency` | `text` | Yes | One of: `never`, `rarely`, `sometimes`, `often`, `always` |
| `stress_sources` | `text[]` | Yes | Array of preset labels; see `STRESS_SOURCES` constant in `Survey.tsx` |
| `stress_sources_other` | `text` | No | Populated only when `"Other"` is in `stress_sources`; otherwise `null` |
| `coping_methods` | `text[]` | Yes | Array of preset labels; see `COPING_METHODS` constant in `Survey.tsx` |
| `coping_other` | `text` | No | Populated only when `"Other"` is in `coping_methods`; otherwise `null` |
| `mental_health_rating` | `integer` | Yes | Integer 1–5; parsed from radio button string value |
| `school_support` | `text` | Yes | One of: `Yes`, `No`, `Not sure` |

**Row Level Security:** RLS is enabled. Two policies are in place: anonymous `INSERT` (allow all) and anonymous `SELECT` (allow all). Without these policies, all Supabase JS client requests will be rejected.

**No migrations are managed by this project.** The table was created manually in the Supabase dashboard. There is no Drizzle schema or migration file for the survey table.

---

## Conventions

### Naming Conventions

- **Files:** PascalCase for React components (`Survey.tsx`, `Footer.tsx`); camelCase for utilities (`supabaseClient.ts`, `utils.ts`)
- **Components:** PascalCase named exports (`export default function Survey()`)
- **Variables/functions:** camelCase (`formData`, `handleSubmit`, `countOccurrences`)
- **Database columns:** snake_case to match Supabase (`year_in_college`, `stress_sources_other`)
- **TypeScript interfaces:** PascalCase (`FormData`, `FormErrors`, `SurveyResponse`)
- **CSS/Tailwind:** arbitrary values use hex (`text-[#8A3BDB]`, `ring-[#8A3BDB]`); no custom Tailwind config extensions for the accent color

### Code Style

- No semicolons are not enforced; the project uses semicolons (TypeScript default)
- Tailwind classes are written inline in JSX — no `@apply` usage
- ARIA attributes are written in JSX camelCase: `aria-invalid`, `aria-describedby`, `aria-required`, `aria-live`
- Error `<p>` elements always have `role="alert"` and `id="error-{fieldName}"` for `aria-describedby` linkage
- Form inputs always have explicit `<label htmlFor="...">` — never implicit label wrapping for inputs

### Framework Patterns

- **Routing:** `<WouterRouter base={...}>` at the App level; `<Switch>` + `<Route>` for page declarations; `<Link href="...">` for navigation (never `<a href>` for internal links)
- **Supabase:** import `{ supabase }` from `@/lib/supabaseClient`; all DB calls are `async`/`await` with destructured `{ data, error }`
- **State:** `useState` for all form/page state; `useRef` for DOM references (auto-focus) and previous-value tracking
- **Side effects:** `useEffect` for data fetching (Results page) and auto-focus behavior (Survey page)
- **No global state / context / Redux** — the app is simple enough that prop drilling does not occur

### Git Commit Style

Conventional commits: `type: short description`

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — tooling, config, dependency changes
- `docs:` — documentation only
- `style:` — formatting, no logic change

---

## Decisions and Tradeoffs

- **No backend / no Express server.** The Supabase JS client handles all data operations directly from the browser using the anon key and RLS policies. This keeps the deployment simple (static files only) but means there is no server-side validation. RLS is the enforcement layer. Do not suggest adding an Express server — it would change the deployment model entirely.
- **wouter instead of react-router-dom.** The scaffold included wouter. It was kept because it is already installed and works correctly. react-router-dom was not added to avoid a redundant dependency. Do not suggest migrating to react-router-dom.
- **Client-side chart aggregation.** All data transformation for charts happens in `Results.tsx` at fetch time. A Supabase RPC or database view was not used because the expected response count is small and the query is a simple `SELECT *`. Do not suggest a database-level aggregation unless response volumes become a problem.
- **Plain HTML form elements.** Radix UI form primitives were not used despite being in devDependencies. Plain `<select>`, `<input>`, `<fieldset>`, `<legend>`, and `<label>` elements give full control over ARIA attributes without fighting component abstractions.
- **No form library.** React Hook Form is in devDependencies (scaffold). It was not used because the form is simple and the custom validation function is easy to read and maintain.
- **Accent color as Tailwind arbitrary values.** `#8A3BDB` appears as `text-[#8A3BDB]`, `ring-[#8A3BDB]`, `border-[#8A3BDB]`, and the `ACCENT` constant in Results.tsx. A Tailwind config extension was not added to avoid modifying the scaffold config. This is acceptable for a single-color accent.
- **`stress_sources_other` and `coping_other` stored as `null` when not applicable.** When the user does not check "Other," these fields are explicitly sent as `null` (not an empty string) to keep the data clean.

---

## What Was Tried and Rejected

- **`react-router-dom` for routing.** The scaffold used `wouter`. Using both routers in one app would be redundant and confusing. `react-router-dom` was not installed.
- **Radix UI / Shadcn `<Form>` component for the survey form.** The Radix form primitives abstract ARIA wiring in a way that made it harder to audit accessibility manually. Plain HTML elements with explicit ARIA attributes were used instead and must not be replaced without a strong reason.
- **Aggregating chart data with a Supabase RPC.** Unnecessary at current scale. Do not suggest this unless the Results page becomes slow.
- **Using a CSS variable for the accent color (`--color-accent`).** Explored but skipped to avoid modifying the Tailwind config. Arbitrary values work and are grep-able.
- **`improvement_suggestion` free-text question.** Was in an early draft of the survey. Removed from the final design — the table has no such column. Do not add it back.

---

## Known Issues and Workarounds

**Issue 1: `vite.config.ts` throws if `PORT` or `BASE_PATH` are not set**
- **Problem:** Both variables are required with hard throws. Azure's build pipeline does not provide them, so `vite build` will fail on Azure without modification.
- **Workaround:** Not yet applied. The fix is to make `PORT` optional (only used by the dev server) and to default `BASE_PATH` to `"/"`.
- **Do not remove:** The `PORT` validation is intentional in the Replit environment — do not remove it entirely, just make it conditional on whether a dev server is being started vs. a production build being run.

**Issue 2: "Other" write-in answers are not deduplicated in charts**
- **Problem:** If two respondents write "Relationship stress" and "relationship stress", they appear as two separate bars in the Stress Sources chart.
- **Workaround:** None. The data is rendered as-is from the database.
- **Do not remove:** The client-side normalization that replaces `"Other"` with `"Other: <text>"` must stay — it ensures write-in answers are surfaced in charts rather than collapsed into a single "Other" bar.

**Issue 3: Results page fetches all rows on every load**
- **Problem:** `SELECT *` with no pagination. Fine for hundreds of rows; will slow down at thousands.
- **Workaround:** None needed at current scale.
- **Do not remove:** The full fetch is required for all chart computations. Do not add a `LIMIT` clause without also adding a Supabase RPC to do server-side aggregation.

---

## Browser / Environment Compatibility

### Front-End

- **Tested in:** Chrome (latest), Firefox (latest), via Replit's built-in preview pane (Chromium-based)
- **Expected support:** All modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Known incompatibilities:** `accent-color` CSS property (used for radio/checkbox accent) is not supported in IE11 or very old Safari — this is acceptable since the audience is undergraduate students using modern devices
- **Not tested:** Mobile Safari, Samsung Internet — responsive layout is implemented but not verified on physical devices

### Back-End / Build Environment

- **OS:** Linux (NixOS in Replit; Ubuntu on Azure build agents)
- **Node.js:** 20+ required (pnpm-workspace.yaml and Replit scaffold use Node 24 in Replit)
- **Package manager:** pnpm 9+
- **Environment variables at build time:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `BASE_PATH`
- **Environment variables at dev time only:** `PORT`, `REPL_ID` (Replit-specific; gates dev-only plugins)
- **No server process at runtime** — the output is 100% static HTML/JS/CSS

---

## Open Questions

- [ ] **Who should have access to the Results page?** Currently public and unauthenticated. Should it be password-protected before the survey goes live so only the instructor can see it?
- [ ] **What is the expected response volume?** If more than ~5,000 responses are anticipated, client-side aggregation should be moved to a Supabase database function before launch.
- [ ] **Should the major field have a predefined list?** Free text makes chart grouping on the Results page meaningless for that field. A searchable dropdown of common UI majors was discussed but not implemented.
- [ ] **Is the survey meant to be open indefinitely, or closed after the semester?** If it should be closed, a mechanism to disable the form (without deleting data) needs to be designed.
- [ ] **Azure deployment region?** No preference has been stated. The Supabase project region should be considered when choosing the Azure region to minimize latency.

---

## Session Log

### 2026-03-24

**Accomplished:**
- Built the complete three-page SPA from scratch: Home, Survey (7 questions, validation, confirmation), Results (5 Recharts charts)
- Integrated Supabase JS client for anonymous insert and full `SELECT`
- Implemented WCAG 2.1 AA accessibility across all form elements
- Added conditional "Other" text inputs with auto-focus behavior using `useRef` and `useEffect`
- Created `Footer.tsx` with exact attribution string
- Created `public/staticwebapp.config.json` for Azure SWA SPA routing
- Wrote `README.md` at project root
- Wrote `WORKING_NOTES.md` at project root (this file)

**Left Incomplete:**
- `vite.config.ts` still throws for missing `PORT`/`BASE_PATH` — needs update before Azure build will succeed

**Decisions Made:**
- Used `wouter` (already in scaffold) instead of `react-router-dom`
- Used plain HTML form elements instead of Radix form primitives
- Kept all chart aggregation client-side

**Next Step:**
Update `vite.config.ts` to make `PORT` optional and default `BASE_PATH` to `"/"`, then verify `vite build` succeeds, then deploy to Azure Static Web Apps.

---

## Useful References

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Recharts API Reference](https://recharts.org/en-US/api)
- [Recharts `<ResponsiveContainer>`](https://recharts.org/en-US/api/ResponsiveContainer) — required wrapper for all charts; sets `width="100%"`
- [wouter v3 API](https://github.com/molefrog/wouter) — note: `<Link>` renders its own `<a>` tag; do not nest `<a>` inside `<Link>`
- [Tailwind CSS Arbitrary Values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
- [WCAG 2.1 Success Criterion 1.3.1 — Info and Relationships](https://www.w3.org/TR/WCAG21/#info-and-relationships)
- [WCAG 2.1 Success Criterion 4.1.3 — Status Messages](https://www.w3.org/TR/WCAG21/#status-messages) — basis for `role="alert"` and `aria-live="polite"` usage
- [Azure Static Web Apps — Configure routing](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [Azure Static Web Apps — Build configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- **Claude (Anthropic)** — AI assistant used to scaffold, implement, and document this entire project in Replit. All code was reviewed for correctness and accessibility before finalizing.
