# Venn Take Home

A modern React project built with:

- **React 19** - Latest React with new features
- **TypeScript 5.7** - Type-safe development
- **Vite 6** - Fast build tool and dev server
- **React Compiler** - Automatic optimization
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library

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

## Project Structure

```
├── src/
│   ├── components/     # React components
│   │   └── ui/         # shadcn/ui components
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── components.json     # shadcn/ui configuration
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

## Path Aliases

The project uses path aliases for cleaner imports:

```typescript
// Instead of
import { Button } from "../../components/ui/button"

// Use
import { Button } from "@/components/ui/button"
```

