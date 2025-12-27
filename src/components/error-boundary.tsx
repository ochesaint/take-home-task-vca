import { Component, type ReactNode } from 'react'
import { Sentry } from '@/lib/sentry'
import { ErrorFallback } from './error-fallback'

/**
 * Props for the ErrorBoundary component.
 */
interface Props {
  /** Child components to wrap */
  children: ReactNode
  /** Optional custom fallback UI */
  fallback?: ReactNode
}

/**
 * State for the ErrorBoundary component.
 */
interface State {
  /** Whether an error has been caught */
  hasError: boolean
  /** The caught error, if any */
  error?: Error
}

/**
 * Error Boundary component that catches JavaScript errors and displays a fallback UI.
 * Integrates with Sentry for error reporting.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
