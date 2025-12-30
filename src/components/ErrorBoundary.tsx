import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

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

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 min-h-screen bg-red-50 flex flex-col items-center justify-center text-center space-y-4">
                    <h1 className="text-2xl font-bold text-red-600">Oups, une erreur ! 😕</h1>
                    <p className="text-gray-700">L'application a rencontré un problème.</p>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 text-left w-full max-w-sm overflow-auto max-h-60">
                        <code className="text-xs text-red-500 font-mono break-all">
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                    >
                        Réinitialiser l'app (Effacer données)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
