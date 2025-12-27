# Venn Take Home

A modern React project built with:

- **React 19** - Latest React with new features
- **TypeScript 5.7** - Type-safe development
- **Vite 6** - Fast build tool and dev server
- **React Compiler** - Automatic optimization
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Hook Form + Zod** - Form handling and validation
- **TanStack Query v5** - Powerful data synchronization
- **react-i18next** - Internationalization
- **Vitest + RTL + MSW + jest-axe** - Testing stack
- **Storybook 8** - Component development and documentation
- **Sentry** - Error tracking and monitoring

## Getting Started

### Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### Development

Start the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### Build

Build for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

### Preview

Preview the production build:

```bash
npm run preview
# or
pnpm preview
# or
yarn preview
```

### Testing

Run tests:

```bash
npm run test
# or
pnpm test
```

Run tests with UI:

```bash
npm run test:ui
# or
pnpm test:ui
```

Run tests with coverage:

```bash
npm run test:coverage
# or
pnpm test:coverage
```

### Storybook

Start Storybook:

```bash
npm run storybook
# or
pnpm storybook
```

Build Storybook:

```bash
npm run build-storybook
# or
pnpm build-storybook
```

### Formatting

Format code with Prettier:

```bash
npm run format
# or
pnpm format
```

Check formatting without making changes:

```bash
npm run format:check
# or
pnpm format:check
```

**Note:** Prettier automatically runs on commit via Husky and lint-staged. Only
staged files will be formatted.

## Project Structure

```
├── src/
│   ├── components/     # React components
│   │   └── ui/         # shadcn/ui components
│   ├── lib/            # Utility functions and configs
│   │   ├── i18n.ts     # i18next configuration
│   │   ├── query-client.ts  # TanStack Query client
│   │   ├── sentry.ts   # Sentry configuration
│   │   └── utils.ts    # Utility functions
│   ├── locales/        # Translation files
│   ├── test/           # Test utilities and mocks
│   │   ├── mocks/      # MSW handlers and server
│   │   └── utils/      # Test utilities
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── .storybook/         # Storybook configuration
├── .husky/             # Git hooks (pre-commit)
├── .prettierrc         # Prettier configuration
├── .prettierignore     # Prettier ignore patterns
├── components.json     # shadcn/ui configuration
├── vitest.config.ts    # Vitest configuration
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## Adding shadcn/ui Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Features

- ⚡️ **Vite 6** - Lightning fast HMR
- ⚛️ **React 19** - Latest React features
- 🔧 **React Compiler** - Automatic memoization and optimization
- 🎨 **Tailwind CSS v4** - Modern utility-first CSS
- 🧩 **shadcn/ui** - Copy-paste component library
- 📦 **TypeScript 5.7** - Full type safety
- 🛣️ **Path Aliases** - Clean imports with `@/` prefix
- 📝 **React Hook Form + Zod** - Type-safe form validation
- 🔄 **TanStack Query v5** - Powerful server state management
- 🌍 **react-i18next** - Internationalization support
- 🧪 **Vitest + RTL + MSW + jest-axe** - Complete testing stack
- 📚 **Storybook 8** - Component development environment
- 🐛 **Sentry** - Error tracking and monitoring
- 💅 **Prettier** - Code formatting with pre-commit hooks

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of
import { Button } from '../../components/ui/button'

// Use
import { Button } from '@/components/ui/button'
```

## Usage Examples

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
})
```

### TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

### i18next

```typescript
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()
// Use: t('common.welcome')
// Change language: i18n.changeLanguage('es')
```

### Testing with MSW

```typescript
import { render, screen } from '@/test/utils/test-utils'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

// Mock API in tests
server.use(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: 1, name: 'John' }])
  })
)
```

### Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

const { container } = render(<Component />)
const results = await axe(container)
expect(results).toHaveNoViolations()
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_SENTRY_DSN=your_sentry_dsn_here
```

## Sentry Setup

Sentry is configured to only run in production. Set your DSN in the environment
variables. The configuration includes:

- Browser tracing integration
- Session replay
- Error tracking

## Code Formatting

This project uses Prettier for code formatting with automatic formatting on
commit.

### Pre-commit Hook

Husky is configured to run Prettier on staged files before each commit. This
ensures consistent code formatting across the project.

The pre-commit hook:

- Runs `lint-staged` which formats only staged files
- Formats: `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`, `.md`, `.mdx`,
  `.html`, `.yml`, `.yaml`
- Prevents commits if formatting fails (you can bypass with `--no-verify` if
  needed)

### Manual Formatting

You can format all files manually:

```bash
pnpm format
```

Or check formatting without making changes:

```bash
pnpm format:check
```
