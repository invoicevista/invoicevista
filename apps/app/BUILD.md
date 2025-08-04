# Building the Dashboard App

## Prerequisites

The dashboard app requires Clerk authentication to be properly configured for a successful build.

## Quick Start (Development)

For local development without Clerk:

```bash
# Copy the example env file
cp .env.local.example .env.local

# Run development server
pnpm dev
```

## Production Build

### Option 1: With Clerk Configuration (Recommended)

1. Set up Clerk:
   - Sign up at [Clerk.com](https://clerk.com)
   - Create a new application
   - Get your API keys from the dashboard

2. Configure environment:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual Clerk keys
   ```

3. Build the app:
   ```bash
   pnpm build
   ```

### Option 2: Build for Demo/Testing (Without Auth)

If you need to build without Clerk configuration (not recommended for production):

```bash
# This will skip some validations
pnpm build:skip-validation
```

⚠️ **Warning**: Building without proper Clerk configuration will result in authentication features not working.

## Build Output

A successful build will create:
- `.next/` directory with optimized production files
- Static assets optimized for performance
- Server-side rendered pages where needed

## Troubleshooting

### "Missing publishableKey" Error

This means Clerk is not configured. Either:
1. Set up Clerk as described above, or
2. Use `pnpm build:skip-validation` for testing purposes only

### "Invalid publishableKey" Error

The key format is incorrect. Clerk keys should:
- Publishable key: starts with `pk_test_` or `pk_live_`
- Secret key: starts with `sk_test_` or `sk_live_`

## Environment Variables

See `.env.local.example` for all available configuration options.