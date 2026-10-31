import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary capturó un error no controlado:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  private handleClearStorageAndReload = (): void => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-800">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Error en la interfaz</h1>
                <p className="text-xs text-slate-500">Se detectó un fallo al renderizar la aplicación.</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-100 p-3 text-xs font-mono text-slate-700 overflow-x-auto mb-4 border border-slate-200">
              {this.state.error?.message || 'Error desconocido'}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reintentar</span>
              </button>
              <button
                type="button"
                onClick={this.handleClearStorageAndReload}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Trash2 className="h-4 w-4 text-rose-500" />
                <span>Limpiar datos locales</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
