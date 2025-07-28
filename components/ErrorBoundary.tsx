'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureComponentError, addBreadcrumb } from '@/lib/sentry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  userId?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { componentName, userId } = this.props;

    addBreadcrumb('Error boundary caught error', 'error-boundary', {
      componentName,
      userId,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack
    });

    captureComponentError(
      `Error boundary caught error: ${error.message}`,
      {
        component: componentName || 'UnknownComponent',
        action: 'component_error',
        userId,
        additionalData: {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          errorInfo
        }
      },
      'error'
    );

    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              An error occurred while rendering this component. Our team has been notified.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                  {'\n\n'}
                  Component Stack:
                  {'\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                  addBreadcrumb('Error boundary reset', 'error-boundary', {
                    componentName: this.props.componentName,
                    userId: this.props.userId
                  });
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier error boundary usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    componentName?: string;
    fallback?: ReactNode;
    userId?: string;
  } = {}
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      componentName={options.componentName || Component.displayName || Component.name}
      fallback={options.fallback}
      userId={options.userId}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
} 