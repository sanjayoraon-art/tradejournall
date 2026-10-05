import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in TradeJournall:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-lg shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 text-2xl font-black">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">TradeJournall Temporary Refresh Required</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                The session experienced a temporary loading issue. Click below to refresh and load the latest trading terminal state.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-rose-400 overflow-x-auto max-h-32 text-left">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {}
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Reload Home Terminal
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl text-sm transition cursor-pointer"
              >
                Quick Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
