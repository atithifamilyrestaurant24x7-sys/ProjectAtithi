'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-destructive/5 rounded-lg border border-destructive/20">
                    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
                        We encountered an error while loading this section. Please try refreshing the page.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined });
                            window.location.reload();
                        }}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for easier use with hooks
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: React.ReactNode
) {
    return function WrappedComponent(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}
