import { ExampleForm } from './components/ExampleForm'
import { ExampleQuery } from './components/ExampleQuery'
import { ExampleI18n } from './components/ExampleI18n'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Venn Take Home
          </h1>
          <p className="text-muted-foreground">
            React 19 + TypeScript 5.7 + Vite 6 + React Compiler + Tailwind CSS v4 + shadcn/ui
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">React Hook Form + Zod</h2>
            <ExampleForm />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">TanStack Query</h2>
            <ExampleQuery />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">i18next</h2>
            <ExampleI18n />
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
