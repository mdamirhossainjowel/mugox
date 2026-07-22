# Mugox — Free Online Tools Platform

A premium, privacy-first online tools platform. Everything runs in the browser. No backend. No database. No login.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npx vercel deploy
```

Or connect your GitHub repo in the Vercel dashboard — zero config needed.

## Environment Variables

Copy `.env.local` and fill in optional values:

```
NEXT_PUBLIC_SITE_URL=https://mymugox.com
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX   # Google AdSense publisher ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX              # Google Analytics 4 measurement ID
```

## Stack

- **Next.js 15** — App Router, Static Generation
- **React 19** — Server + Client Components
- **TypeScript** — Strict mode
- **Tailwind CSS v3** — Design tokens via CSS custom properties

## Adding a New Tool

```bash
# 1. Create the folder
mkdir -p tools/category/tool-name

# 2. Create meta.ts (SEO + registry metadata)
# 3. Create index.tsx (the tool UI)
# 4. Register in lib/tools/registry.ts
# 5. Add dynamic import in app/(tools)/[category]/[tool]/page.tsx
```

## Project Structure

```
app/                    Next.js App Router pages
components/             Shared UI components
  home/                 Homepage sections
  layout/               Header, Footer, Nav
  tools/                Tool shell, cards, FAQ
  ui/                   Design system primitives
config/                 Site config, categories, ads
lib/                    Business logic
  tools/registry.ts     Tool auto-discovery + queries
  seo/                  Metadata + JSON-LD generators
  utils/                Download, copy, format helpers
tools/                  Tool implementations
  pdf/                  PDF tools
  image/                Image tools
  text/                 Text tools
  developer/            Developer tools
  calculator/           Calculator tools
types/                  Global TypeScript types
styles/                 globals.css + design tokens
```
