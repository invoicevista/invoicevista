# Environment Configuration Guide

This guide explains how to set up environment variables for the InvoiceVista monorepo.

## Overview

InvoiceVista uses environment files to manage configuration across different environments. We follow the best practice of never committing sensitive data to version control.

## Environment File Structure

```
.env                    # Shared environment variables (if needed)
.env.local              # Local overrides (never committed)
.env.production         # Production variables (never committed)
.env.*.example          # Example files with dummy values (committed)
```

## Setting Up Environment Variables

### 1. Dashboard App (`/apps/app`)

The dashboard app requires Clerk authentication keys:

```bash
cd apps/app
cp .env.local.example .env.local
# Edit .env.local with your actual Clerk keys
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from Clerk dashboard
- `CLERK_SECRET_KEY` - Get from Clerk dashboard

### 2. API App (`/apps/api`)

The API app currently doesn't require environment variables for basic operation, but you can configure:

```bash
cd apps/api
cp .env.local.example .env.local
# Edit as needed
```

Optional variables:
- `DATABASE_URL` - PostgreSQL connection string (future)
- `REDIS_URL` - Redis connection for rate limiting (future)
- `SMTP_*` - Email service configuration (future)

### 3. Landing Page (`/apps/web`)

The landing page doesn't require any environment variables.

## Best Practices

1. **Never commit `.env` files** containing real credentials
2. **Always use `.env.*.example` files** to document required variables
3. **Use descriptive variable names** with prefixes (e.g., `NEXT_PUBLIC_` for client-side vars)
4. **Validate environment variables** at application startup
5. **Use different credentials** for development, staging, and production

## Loading Priority

Next.js loads environment variables in this order (highest to lowest priority):

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (not loaded when `NODE_ENV=test`)
4. `.env.$(NODE_ENV)`
5. `.env`

## Security Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- All other variables are server-side only
- Use secret management services (AWS Secrets Manager, Vercel, etc.) in production
- Rotate credentials regularly
- Use least-privilege principle for API keys

## Troubleshooting

### Missing Environment Variable Error

If you see an error about missing environment variables:

1. Check that you've created the `.env.local` file
2. Verify the variable names match exactly (case-sensitive)
3. Restart the development server after changing env files
4. Check that the variable is properly prefixed if needed client-side

### Build Failures

For CI/CD pipelines, ensure all required environment variables are set in your build environment (GitHub Actions, Vercel, etc.).