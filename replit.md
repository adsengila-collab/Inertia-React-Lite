# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (api-server)
- **Database**: PostgreSQL + Drizzle ORM (not used by web app)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### `artifacts/web` — WallpaperHub (React + Vite)
- Frontend-only gallery website, no database
- Migrated from PHP app with DuckDuckGo scraper
- Pages: Home (grid gallery), Single Post (lightbox + related), Contact, Privacy Policy, DMCA, Copyright
- Uses mock data with Picsum Photos for images
- Sidebar with random keyword tags, image lightbox, search navigation

### `artifacts/api-server` — API Server (Express)
- Health check endpoint only
- Database not used by web app

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/web run dev` — run web frontend locally

## Web App Structure

```
artifacts/web/src/
  App.tsx               # Router setup
  index.css             # Theme + Tailwind config
  data/
    mockData.ts         # Mock images, keywords, helpers
  components/
    Header.tsx          # Sticky nav with search
    Footer.tsx          # Footer with links
    Sidebar.tsx         # Keyword tags sidebar
    ImageCard.tsx       # Image grid card
    Lightbox.tsx        # Full-screen image viewer
  hooks/
    useNavigate.ts      # Navigation helper
  pages/
    Home.tsx            # Gallery grid homepage
    SinglePost.tsx      # Image detail + related posts
    Contact.tsx
    PrivacyPolicy.tsx
    Dmca.tsx
    Copyright.tsx
    not-found.tsx
```

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
