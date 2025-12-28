# Venn Take Home

A modern, production-ready React onboarding form application with comprehensive
accessibility, internationalization, and performance optimizations.

**Live Site:**
[https://take-home-task-vca.vercel.app/](https://take-home-task-vca.vercel.app/)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Start Storybook
pnpm storybook
```

## 🛠️ Technologies & Tools

- **React 19** - Latest React with concurrent features
- **TypeScript 5.7** - Full type safety
- **Vite 6** - Lightning-fast build tool and HMR
- **React Compiler** - Automatic memoization and optimization (no manual
  `useMemo`/`useCallback` needed)
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library built on Radix UI
- **React Hook Form + Zod** - Type-safe form handling and validation
- **TanStack Query v5** - Server state management with caching
- **react-i18next** - Internationalization (English/French)
- **Vitest + RTL + MSW + jest-axe** - Complete testing stack with accessibility
  testing
- **Storybook 8** - Component development and documentation
- **Sentry** - Error tracking with PII scrubbing (PIPEDA compliant)

## ✨ Features

- **Configurable Form System** - Declarative form configuration with multi-step
  support
- **Async Field Validation** - Real-time validation with visual indicators
- **Internationalization** - Full i18n support (EN/FR) with language switcher
- **Accessibility (AODA Compliant)** - WCAG 2.1 AA compliant with automated a11y
  testing
- **Error Boundaries** - Graceful error handling with user-friendly fallbacks
- **Input Sanitization** - XSS protection via DOMPurify
- **Phone Number Masking** - Canadian phone number formatting
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🏗️ Architecture Decisions

### Feature-Based Structure

- Organized by features (`onboarding/`) with co-located components, configs,
  schemas, and services
- Clear separation of concerns with reusable form system

### Configurable Form System

- Declarative form configuration enables easy field addition/modification
- Type-safe with TypeScript generics
- Supports text, phone, and number field types with extensibility

### React Compiler

- Automatic optimization eliminates need for manual `React.memo`, `useMemo`, or
  `useCallback`
- Codebase is cleaner and more maintainable without manual performance hooks

### Lazy Loading Strategy

- Sentry is dynamically imported to reduce initial bundle size
- Code splitting with manual chunks for optimal loading

### Security First

- Input sanitization on all form submissions
- PII scrubbing in error reports (PIPEDA compliance)
- Security headers via Vercel configuration (CSP, HSTS, XSS protection)

## ♿ Accessibility Support

- **Automated Testing** - jest-axe integration ensures WCAG 2.1 AA compliance
- **Semantic HTML** - Proper use of form elements, labels, and ARIA attributes
- **ARIA Roles** - `role="alert"` for errors, `role="progressbar"` for stepper
- **Keyboard Navigation** - Full keyboard support throughout
- **Screen Reader Support** - All interactive elements properly labeled
- **Focus Management** - Logical tab order and visible focus indicators

## ⚡ Performance Features

### Build Optimizations

- **Code Splitting** - Manual chunks for vendor libraries (React, forms, query,
  i18n)
- **Compression** - Gzip and Brotli compression for all assets
- **Source Maps** - Hidden source maps in production (reduced bundle size)
- **Bundle Analysis** - `pnpm build:analyze` for bundle size analysis

### Runtime Optimizations

- **React Compiler** - Automatic memoization and re-render optimization
- **TanStack Query** - Intelligent caching with 5-minute stale time
- **Lazy Loading** - Sentry loaded asynchronously
- **Asset Caching** - Long-term caching for static assets (1 year),
  stale-while-revalidate for locales

### Lighthouse Targets

- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥90
- SEO: ≥90
- Script size: <300KB
- Total size: <600KB

## 🔒 Production Optimizations

### Security Headers (via Vercel)

- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Referrer Policy and Permissions Policy

### Error Monitoring

- Sentry integration with browser tracing and session replay
- PII scrubbing for PIPEDA compliance
- Environment-based sampling rates

### Caching Strategy

- Static assets: 1 year cache with immutable flag
- Locales: 1 day cache with 7-day stale-while-revalidate
- API responses: Managed by TanStack Query

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── form/           # Configurable form system
│   └── ui/             # shadcn/ui components
├── features/           # Feature-based modules
│   └── onboarding/     # Onboarding feature
├── lib/                # Utilities and configs
├── test/               # Test utilities and mocks
└── config/             # App configuration
```

## 🧪 Testing

- **Unit Tests** - Component and utility testing with Vitest
- **Integration Tests** - Form flow and API integration
- **Accessibility Tests** - Automated a11y testing with jest-axe
- **MSW** - API mocking for reliable tests
- **Coverage** - Run `pnpm test:coverage` for coverage reports

## 🌍 Internationalization

- English and French translations
- Browser language detection
- Language switcher in header
- All user-facing text externalized to translation files

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm build:analyze` - Build with bundle analysis
- `pnpm test` - Run tests
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage
- `pnpm storybook` - Start Storybook
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier

## 🔧 Environment Variables

```bash
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_ENVIRONMENT=production
```

## 📚 Additional Resources

- [Storybook](http://localhost:6006) - Component documentation (run
  `pnpm storybook`)
- [Vite Docs](https://vite.dev) - Build tool documentation
- [React Compiler](https://react.dev/learn/react-compiler) - Automatic
  optimization
- [shadcn/ui](https://ui.shadcn.com) - Component library
