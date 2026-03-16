import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {t('common.error_title', 'Oops! Something went wrong')}
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          {t('common.error_subtitle', 'A localized error occurred that we couldn\'t handle automatically. Please try refreshing the page.')}
        </p>

        {import.meta.env.DEV && error && (
          <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-left overflow-auto max-h-40">
            <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
              {error.toString()}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full flex items-center justify-center gap-2 h-12"
          >
            <RefreshCw className="w-4 h-4" />
            {t('common.refresh_page', 'Refresh Page')}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="w-full h-12 text-slate-500 hover:text-primary"
          >
            {t('nav.home', 'Back to Home')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
