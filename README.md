# InvoiceVista

A developer-first platform for sending digital invoices programmatically. Built with modern web technologies as a Turborepo monorepo.

## 🚀 Overview

InvoiceVista helps developers integrate invoicing capabilities into their applications with simple, powerful APIs. The platform offers:

- **Simple APIs**: Clean REST and GraphQL APIs with comprehensive SDKs
- **Multi-channel Delivery**: Send invoices via email, SMS, or shareable links
- **Global Support**: 135+ currencies with automatic tax calculations
- **Payment Integration**: Built-in support for Stripe, PayPal, and other processors
- **Enterprise Security**: SOC 2 Type II certified with end-to-end encryption

## 🏗️ What's inside?

This monorepo includes the following packages and apps:

### Apps

- **`web`**: Main marketing/landing page built with Next.js, Tailwind CSS, and shadcn/ui patterns
  - Modern, responsive design with dark/light mode support
  - Developer-focused content with code examples
  - Runs on port 3000
- **`docs`**: Documentation site built with Next.js
  - Comprehensive API documentation and guides
  - Runs on port 3001

### Packages

- **`@repo/ui`**: Shared React component library used by all apps
- **`@repo/eslint-config`**: Shared ESLint configurations for consistent code style
- **`@repo/typescript-config`**: Shared TypeScript configurations with strict type checking

### Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.4 with React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **Package Manager**: [pnpm](https://pnpm.io/) for efficient dependency management
- **Build System**: [Turborepo](https://turborepo.com/) for fast, cached builds
- **Deployment**: Optimized for [Vercel](https://vercel.com/) deployment

## 🛠️ Development

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0

### Getting Started

```bash
# Clone the repository
git clone https://github.com/invoicevista/invoicevista.git
cd invoicevista

# Install dependencies
pnpm install

# Start development servers for all apps
pnpm dev

# Or start a specific app
pnpm dev --filter=web
pnpm dev --filter=docs
```

### Available Scripts

```bash
# Build all apps and packages
pnpm build

# Run linting across all packages
pnpm lint

# Type check all packages
pnpm check-types

# Format code with Prettier
pnpm format
```

### Development URLs

- Web App: http://localhost:3000
- Documentation: http://localhost:3001

## 📦 Building

To build all apps and packages:

```bash
pnpm build
```

To build a specific app:

```bash
pnpm build --filter=web
pnpm build --filter=docs
```

## 🚀 Deployment

The monorepo is configured for automatic deployment on Vercel. Each push to the main branch triggers a new deployment.

### Environment Variables

The build script for the web app includes `NODE_ENV=production` to ensure consistent production builds.

## 🏛️ Architecture

### Monorepo Structure

```
invoicevista/
├── apps/
│   ├── web/          # Main marketing site
│   └── docs/         # Documentation site
├── packages/
│   ├── ui/           # Shared components
│   ├── eslint-config/# ESLint configurations
│   └── typescript-config/# TypeScript configurations
├── turbo.json        # Turborepo configuration
├── pnpm-workspace.yaml
└── package.json
```

### Design System

The web app implements a comprehensive design system with:
- CSS custom properties for theming
- Dark/light mode support via `next-themes`
- Consistent spacing and typography scales
- Responsive design patterns

## 🤝 Contributing

This is a private repository for the InvoiceVista platform. For questions or support, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ using [Turborepo](https://turborepo.com/)