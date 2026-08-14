# Asfi Ahamed - Portfolio & CMS

![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript 6](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%7C%20Auth%20%7C%20Storage-3FCF8E?logo=supabase&logoColor=white)

A full-stack, database-driven personal portfolio with a protected content management dashboard. The public site and CMS share one Supabase backend, allowing portfolio content and engagement data to be managed without editing the frontend source.

## Demo

![Portfolio and CMS walkthrough](docs/assets/portfolio-cms-demo.gif)

## What It Includes

### Public portfolio

- Responsive single-page portfolio with animated, mobile-friendly navigation
- Supabase-powered projects, skills, education, experience, certificates, site copy, and social links
- Project cards with images, technology tags, source links, and live-demo links
- Downloadable CV, contact flow, loading states, and toast feedback
- Per-visitor appreciation toggle backed by Supabase
- Automatic hiding of portfolio sections that have no content

### Admin CMS

- Protected email/password login with admin authorization
- Dashboard with content totals and 30-day appreciation analytics
- Create, edit, search, filter, paginate, and delete portfolio content
- Manage projects, skills, education, experience, certificates, and social links
- Edit homepage copy, contact details, resume URL, and stored SEO fields
- Upload certificate images and manage stored branding assets with Supabase Storage
- Responsive admin navigation for desktop and mobile

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript 6, Vite 8 |
| Styling | Tailwind CSS 4, custom CSS |
| Routing | React Router 7 |
| Backend | Supabase Postgres, Auth, Storage, and Row Level Security |
| UI and motion | Framer Motion, Lucide React, Sonner |
| Analytics charts | Recharts |
| Deployment | Vercel-ready SPA configuration |

## Application Routes

| Route | Purpose |
| --- | --- |
| `/` | Public portfolio |
| `/login` | Admin sign-in |
| `/admin` | CMS dashboard |
| `/admin/*` | Content, site copy, social, and asset management |

## Getting Started

### Prerequisites

- Node.js `20.19+` or `22.12+`
- npm
- A configured Supabase project for the portfolio data and CMS

### Installation

```bash
git clone https://github.com/asfiahamed0404/ASFI_Portfolio_CMS.git
cd ASFI_Portfolio_CMS
npm ci
```

Create `.env.local` from `.env.example`, then add your public Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never expose a Supabase service-role key through a `VITE_` variable. Vite includes these values in the browser bundle.

Start the development server:

```bash
npm run dev
```

The site will normally be available at `http://localhost:5173`.

### Supabase requirements

The application expects:

- Portfolio tables and Row Level Security policies matching the SQL history in [`supabase/migrations`](supabase/migrations)
- A Supabase Auth user with a matching `profiles` row whose role is `admin`
- Configured `certificate-images` and `branding` Storage buckets and policies

> The migration directory records the existing project's schema evolution; it is not currently a zero-configuration bootstrap for an empty Supabase project. Review the migrations before applying them to a new project, especially the admin placeholder in `008_admin_profile.sql` and the project-managed `branding` bucket.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Project Structure

```text
src/
|-- components/          Reusable public and admin UI
|-- hooks/               Authentication and portfolio data hooks
|-- lib/supabase.ts      Supabase client, types, and data operations
|-- pages/Home.tsx       Public portfolio
|-- pages/Login.tsx      Admin authentication
`-- pages/admin/         CMS dashboard and content editors

supabase/migrations/     Database schema and RLS history
public/                  Static public assets
docs/assets/             README media, including the demo GIF
```

## Deployment

Run `npm run build` to generate the production bundle. The included `vercel.json` rewrites all application routes to `index.html`, allowing React Router routes to work on Vercel. Add both Supabase environment variables to the deployment environment before publishing.

## Ownership and Use

This is a personal portfolio, not an open-source template or starter project.

Copyright © Asfi Ahamed. All rights reserved. No permission is granted to copy, modify, redistribute, publish, deploy, or reuse the source code, visual design, written content, personal information, or branding without prior written authorization.

Please do not fork or reproduce this repository for personal or commercial use. GitHub may technically provide repository-forking functionality, but creating a fork does not grant permission to reuse or redistribute this work.

## Contact

- [GitHub](https://github.com/asfiahamed0404)
- [LinkedIn](https://www.linkedin.com/in/asfi-ahamed-baa362347)
- [Email](mailto:muasfiahamed276@gmail.com)

---

Built and maintained by Asfi Ahamed.
