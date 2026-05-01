'use client'

import React from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  title?: string
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-500/5 border border-red-500/10 rounded-2xl text-center min-h-[200px]">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">{this.props.title || 'Component Failure'}</h3>
          <p className="text-xs text-muted-foreground mb-6 max-w-[240px]">
            Something went wrong while loading this section of the dashboard.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-4 rounded-xl border-white/10 hover:bg-white/5 text-white gap-2"
            onClick={() => this.setState({ hasError: false })}
          >
            <RefreshCcw size={14} /> Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
