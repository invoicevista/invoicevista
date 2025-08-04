# InvoiceVista Dashboard App

This is the main dashboard application for InvoiceVista, where users can manage their invoices, customers, and API keys.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Clerk Authentication

1. Sign up for a free account at [Clerk](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Copy your API keys from the Clerk dashboard
4. Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

5. Update `.env.local` with your actual Clerk keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your publishable key from Clerk
   - `CLERK_SECRET_KEY`: Your secret key from Clerk

### 3. Run the Development Server

```bash
pnpm dev
```

The app will be available at http://localhost:3003

## Features

- **User Authentication**: Secure sign-up and sign-in with Clerk
- **Test/Live Mode**: Toggle between test and live environments
- **Dashboard**: View metrics and manage resources
- **Dark/Light Mode**: Theme support for better user experience
- **Responsive Design**: Works on desktop and mobile devices

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Custom sign-in page URL | No |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Custom sign-up page URL | No |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect URL after sign-in | No |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect URL after sign-up | No |

## Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/styles` - Global styles and Tailwind CSS