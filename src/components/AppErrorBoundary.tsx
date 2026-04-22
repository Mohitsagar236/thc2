import { Component, ErrorInfo, ReactNode } from "react";

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

interface AppErrorBoundaryProps {
  children: ReactNode;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Application error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-slate-950 text-white">
          <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-start justify-center gap-4 px-4 py-16 sm:px-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Unexpected error
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Something went wrong.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              The dashboard encountered an issue while rendering. Refresh the
              page or contact the engineering team if the problem persists.
            </p>
            {this.state.errorMessage ? (
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
                <strong>Runtime detail:</strong> {this.state.errorMessage}
              </div>
            ) : null}
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
