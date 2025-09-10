'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class NotionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Notion Integration Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Notion Integration Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">
                Something went wrong with the Notion integration.
              </p>
              <p className="text-red-700 text-sm">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Troubleshooting steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Check if your NOTION_API_KEY environment variable is set correctly</li>
                <li>Verify that your Notion integration has access to the databases</li>
                <li>Ensure your database IDs are valid and accessible</li>
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
                className="flex items-center gap-1 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="flex items-center gap-1 px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </button>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Show technical details
              </summary>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <pre className="text-xs whitespace-pre-wrap break-all">
                  {this.state.error?.stack || this.state.error?.message || 'No additional details available'}
                </pre>
              </div>
            </details>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}