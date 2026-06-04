import React from 'react';
import { AlertCircle, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4'>
                    <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
                        <div className='flex justify-center mb-4'>
                            <div className='bg-red-100 rounded-full p-4'>
                                <AlertCircle className='h-8 w-8 text-red-600' />
                            </div>
                        </div>
                        
                        <h1 className='text-2xl font-bold text-gray-900 text-center mb-2'>
                            Something Went Wrong
                        </h1>
                        
                        <p className='text-gray-600 text-center mb-6'>
                            We encountered an unexpected error. Please try refreshing the page or go back.
                        </p>

                        {import.meta.env.DEV && (
                            <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                                <p className='text-xs font-mono text-red-700 break-words'>
                                    {this.state.error?.message}
                                </p>
                            </div>
                        )}

                        <div className='space-y-3'>
                            <button
                                onClick={() => window.location.reload()}
                                className='w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
                            >
                                Refresh Page
                            </button>
                            
                            <a
                                href='/'
                                className='w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors'
                            >
                                <Home size={16} />
                                Go Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
