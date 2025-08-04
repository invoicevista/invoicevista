# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

InvoiceVista is a developer-first SaaS platform for sending digital invoices programmatically. This is a Turborepo monorepo using pnpm workspaces.

## Commands

### Development
```bash
# Start all apps in development mode
pnpm dev

# Start specific app
cd apps/web && pnpm dev  # Main app on port 3000
cd apps/docs && pnpm dev # Docs on port 3001
```

### Building
```bash
# Build all packages and apps
pnpm build

# Build specific app
cd apps/web && pnpm build
```

### Code Quality
```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm check-types

# Format code
pnpm format

# Run all checks before committing
pnpm lint && pnpm check-types
```

## Architecture

### Monorepo Structure
- **apps/web**: Main Next.js marketing/landing page with Tailwind CSS, shadcn/ui patterns, and dark mode
- **apps/docs**: Documentation site (Next.js)
- **apps/api**: REST API with OpenAPI/Swagger documentation, rate limiting, and Test/Live modes
- **apps/app**: Dashboard SPA with Clerk authentication and Test/Live mode toggle
- **packages/ui**: Shared React components library used by all apps
- **packages/eslint-config**: Shared ESLint configurations
- **packages/typescript-config**: Shared TypeScript configurations

### Key Technical Decisions

1. **Module System**: Apps use ES modules (`"type": "module"` in package.json). Config files need `.cjs` extension for CommonJS.

2. **Styling**: 
   - Tailwind CSS v3 with custom design tokens
   - CSS custom properties for theming
   - Dark mode via `next-themes` with class-based switching

3. **Build Configuration**:
   - Next.js apps use Turbopack for faster development
   - Production builds require `NODE_ENV=production`
   - PostCSS with Tailwind and Autoprefixer

4. **Component Architecture**:
   - UI components in `packages/ui` export from `@repo/ui/*`
   - Web app has local components in `components/ui/*` following shadcn/ui patterns
   - Components use `class-variance-authority` for variant styling

### Important Files

- `/turbo.json`: Defines task dependencies and caching
- `/apps/web/app/layout.tsx`: Root layout with theme provider setup
- `/apps/web/tailwind.config.cjs`: Theme configuration and design tokens
- `/apps/web/lib/utils.ts`: cn() utility for className merging

### Common Pitfalls

1. **Build Errors**: If you see "Html should not be imported" error, clean the `.next` directory
2. **Module Errors**: Ensure config files use `.cjs` extension due to ES modules
3. **Workspace Dependencies**: Use `workspace:*` for internal packages
4. **Port Conflicts**: 
   - Web app: port 3000
   - Docs: port 3001
   - API: port 3002
   - Dashboard app: port 3003
5. **Clerk Setup**: Dashboard app requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` env vars
6. **API Authentication**: Test with `X-API-Key: test_key_1234567890` header

## Deployment

The project is configured for Vercel deployment. Commits to main branch trigger automatic deployments.