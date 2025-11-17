import { Outlet, Link, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';

/**
 * @component RootLayout
 * @summary Root layout component that wraps all pages
 * @domain core
 * @type layout-component
 * @category layout
 */
export const RootLayout = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                <Link to="/">StockBox</Link>
              </h1>
              <nav className="flex gap-6">
                <Link
                  to="/"
                  className={`text-sm font-medium ${
                    location.pathname === '/'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Início
                </Link>
                <Link
                  to="/products"
                  className={`text-sm font-medium ${
                    location.pathname.startsWith('/products') &&
                    !location.pathname.includes('/critical')
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Produtos
                </Link>
                <Link
                  to="/products/critical"
                  className={`text-sm font-medium ${
                    location.pathname.includes('/critical')
                      ? 'text-red-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Estoque Crítico
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};
