import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 mx-auto mb-6 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Something went wrong
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            We're sorry, but an unexpected error occurred. Please try reloading the page.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#5D41E6] hover:bg-[#4b33c2] text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reload Page
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-semibold rounded-xl transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go to Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left">
                                <details className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-auto max-h-64 text-xs font-mono text-gray-700 dark:text-gray-300">
                                    <summary className="cursor-pointer font-bold mb-2 text-gray-900 dark:text-gray-100">
                                        Error Details
                                    </summary>
                                    <pre className="whitespace-pre-wrap">
                                        {this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
