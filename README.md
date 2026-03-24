# Stress & Mental Health Survey

## Description

A full-stack survey web application built for BAIS:3300 (Spring 2026) that collects and visualizes data on stress and mental health among undergraduate college students. Participants answer seven questions covering their year in college, major, stress frequency, stress sources, coping methods, self-rated mental health, and perceived school support. Responses are stored anonymously in a Supabase PostgreSQL database and visualized in real time with interactive charts on the Results page.

---

## Badges

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Features

- **Three-page SPA** — a welcoming Home page, a 7-question Survey form, and an aggregated Results dashboard, all without full-page reloads.
- **Anonymous submissions** — no account or personal identification required; responses go straight to Supabase with no user tracking.
- **Real-time results** — the Results page fetches all responses from Supabase on load and renders them as live charts (bar, horizontal bar, and pie).
- **"Other" write-in support** — selecting "Other" for stress sources or coping methods reveals a text input that auto-focuses, and write-in answers appear alongside preset options in the charts.
- **Full form validation** — every field is required; inline error messages use ARIA attributes (`aria-invalid`, `aria-describedby`, `role="alert"`) to be screen-reader friendly.
- **Confirmation screen** — after submitting, participants see a summary of their answers before being offered options to submit another response or view the results.
- **WCAG 2.1 AA accessible** — color contrast ratios meet AA standards, focus rings are visible on all interactive elements, and semantic HTML is used throughout.
- **Fully responsive** — single-column layout on mobile, comfortable centered layout on tablet and desktop.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component library |
| Vite | Development server and production bundler |
| TypeScript | Static typing across all source files |
| Tailwind CSS | Utility-first styling with custom accent color `#8A3BDB` |
| Supabase JS (`@supabase/supabase-js`) | Database client — reads and writes `mental_health_survey_results` directly from the browser |
| Recharts | Bar, horizontal bar, and pie charts on the Results page |
| wouter | Lightweight client-side routing (Home / Survey / Results) |
| pnpm workspaces | Monorepo package management |

---

## Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | ≥ 20 | https://nodejs.org |
| pnpm | ≥ 9 | https://pnpm.io/installation |
| Supabase account | — | https://supabase.com |

You will also need a Supabase project with the following table:

```sql
create table mental_health_survey_results (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz default now(),
  year_in_college      text,
  major                text,
  stress_frequency     text,
  stress_sources       text[],
  stress_sources_other text,
  coping_methods       text[],
  coping_other         text,
  mental_health_rating integer,
  school_support       text
);
```

Enable Row Level Security and add policies to allow anonymous `SELECT` and `INSERT`.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/briannebonus/stress-mental-health-survey.git
   cd stress-mental-health-survey
   ```

2. Install all workspace dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file inside `artifacts/survey-app/` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Start the development server:
   ```bash
   pnpm --filter @workspace/survey-app run dev
   ```

5. Open your browser at `http://localhost:<PORT>` (the port is printed in the terminal output).

---

## Usage

| Page | URL | Description |
|---|---|---|
| Home | `/` | Landing page with links to the survey and results |
| Survey | `/survey` | 7-question form; submits an anonymous response to Supabase |
| Results | `/results` | Aggregated charts pulled live from the database |

**Environment variables:**

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase project's public anon key |
| `PORT` | Yes (auto-set by Replit) | Port the Vite dev server binds to |
| `BASE_PATH` | Yes (auto-set by Replit) | Base URL path prefix for the app |

To build for production:
```bash
pnpm --filter @workspace/survey-app run build
```
The compiled output is written to `artifacts/survey-app/dist/public/`.

---

## Project Structure

```text
artifacts/survey-app/
├── public/
│   └── staticwebapp.config.json  # Azure Static Web Apps SPA routing fallback
├── src/
│   ├── components/
│   │   ├── Footer.tsx            # Footer with author and course attribution
│   │   └── ui/                   # Shadcn/Radix UI primitive components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/
│   │   ├── supabaseClient.ts     # Supabase client instance + SurveyResponse type
│   │   └── utils.ts              # Tailwind class-merge utility (cn)
│   ├── pages/
│   │   ├── Home.tsx              # Landing page with hero text and nav buttons
│   │   ├── Survey.tsx            # 7-question form with validation + confirmation
│   │   ├── Results.tsx           # Aggregated charts from Supabase data
│   │   └── not-found.tsx         # 404 fallback page
│   ├── App.tsx                   # wouter Router + route declarations
│   ├── index.css                 # Global styles, HSL theme tokens, accent color
│   └── main.tsx                  # React DOM entry point
├── index.html                    # HTML shell with SEO meta tags
├── vite.config.ts                # Vite config (port, base path, plugins)
├── tsconfig.json                 # TypeScript config for the app
└── package.json                  # App-level dependencies and scripts
```

---

## Changelog

### v1.0.0 — 2026-03-24

- Initial release of the Stress & Mental Health Survey application.
- Three-page SPA: Home, Survey form, Results dashboard.
- Seven survey questions covering year, major, stress frequency, stress sources, coping methods, mental health self-rating, and school support perception.
- Supabase integration for anonymous response storage and retrieval.
- Five Recharts visualizations: stress frequency bar chart, mental health rating bar chart, stress sources horizontal bar chart, coping methods horizontal bar chart, school support pie chart.
- Conditional "Other" text inputs with auto-focus behavior.
- Full ARIA-compliant form validation and confirmation screen.
- WCAG 2.1 AA color contrast throughout; fully responsive layout.

---

## Known Issues / To-Do

- [ ] The Results page fetches all rows on every load — add pagination or aggregation at the database level for large response sets.
- [ ] The "Other" write-in answers are normalized client-side; duplicate or near-duplicate strings (e.g., "exercise" vs. "Exercise") are not deduplicated.
- [ ] There is no rate-limiting or spam prevention on survey submissions; a single user could submit many responses.
- [ ] The major field is a free-text input — consider a searchable dropdown of common majors to improve chart groupings on the Results page.
- [ ] No admin view exists to download raw response data as CSV.

---

## Roadmap

- **CSV / JSON export** — allow the course instructor to download all responses from the Results page.
- **Major groupings chart** — cluster free-text major entries into broader fields (STEM, Business, Humanities, etc.) for a more readable distribution chart.
- **Trend over time** — add a line chart showing average mental health ratings grouped by week to visualize changes throughout the semester.
- **Shareable result links** — generate a unique URL for a snapshot of the results at a given point in time.
- **Admin password protection** — gate the Results page behind a simple password so raw data is not publicly accessible.

---

## Contributing

This project was created for a specific academic course and is not actively seeking external contributions. That said, pull requests fixing bugs or improving accessibility are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository on GitHub.
2. Create a feature branch: `git checkout -b fix/your-fix-name`
3. Commit your changes with a descriptive message: `git commit -m "fix: describe the change"`
4. Push to your fork: `git push origin fix/your-fix-name`
5. Open a Pull Request against the `main` branch and describe what problem it solves.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Brianne Bonus**  
University of Iowa — Tippie College of Business  
Course: BAIS:3300 — Spring 2026

---

## Contact

GitHub: [github.com/briannebonus](https://github.com/briannebonus)

---

## Acknowledgements

- [Supabase Documentation](https://supabase.com/docs) — for clear guides on Row Level Security and the JavaScript client.
- [Recharts Documentation](https://recharts.org/en-US/) — for the composable chart API used on the Results page.
- [Shields.io](https://shields.io) — for the badges in this README.
- [Tailwind CSS](https://tailwindcss.com/docs) — for the utility-first styling system.
- [Radix UI](https://www.radix-ui.com/) — for accessible primitive components.
- [wouter](https://github.com/molefrog/wouter) — for the lightweight SPA routing library.
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/) — referenced throughout development to ensure accessibility compliance.
- Claude (Anthropic) — AI assistant used to scaffold, build, and document this project.
