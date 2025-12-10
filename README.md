# Shortly

A URL shortening service built with a **Turborepo monorepo** architecture.

## Project Structure

```
shortly-frontend/
├── apps/
│   ├── landing/          # Marketing site (Next.js) - port 3000
│   └── dashboard/        # User dashboard (Next.js) - port 3001
├── packages/
│   ├── ui/               # Shared UI components (@shortly/ui)
│   ├── lib/              # Shared utilities & API client (@shortly/lib)
│   └── config/           # Shared Tailwind & TypeScript configs (@shortly/config)
├── turbo.json            # Turborepo pipeline configuration
└── pnpm-workspace.yaml   # pnpm workspace definition
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Development

```bash
# Run all apps in parallel
pnpm dev

# Run specific app
pnpm dev --filter=@shortly/landing    # Landing page only
pnpm dev --filter=@shortly/dashboard  # Dashboard only
```

### Build

```bash
pnpm build
```

## Apps

| App                  | Port | Description                                    |
| -------------------- | ---- | ---------------------------------------------- |
| `@shortly/landing`   | 3000 | Public marketing site with hero, features, CTA |
| `@shortly/dashboard` | 3001 | Authenticated dashboard for managing URLs      |

## Packages

| Package           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `@shortly/ui`     | Shared React components (Button, Card, Input, etc.) |
| `@shortly/lib`    | Shared utilities (API client, helper functions)     |
| `@shortly/config` | Shared Tailwind CSS and TypeScript configurations   |

## Environment Variables

Create `.env.local` in each app:

```bash
# apps/landing/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

# apps/dashboard/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3001
```

## Tech Stack

- **Framework**: Next.js 16
- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
