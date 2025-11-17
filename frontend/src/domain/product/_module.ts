/**
 * @module product
 * @summary Product management domain with CRUD operations and critical stock alerts
 * @domain functional
 * @version 1.0.0
 */

export * from './types';
export * from './services/productService';
export * from './hooks/useProductList';
export * from './hooks/useProductDetail';
export * from './hooks/useCriticalProducts';
export * from './hooks/useCriticalHistory';
export * from './hooks/useUpdateMinimumStock';
export * from './components/ProductForm';
export * from './components/ProductList';
export * from './components/ProductFilters';
export * from './components/CriticalProductList';
export * from './components/CriticalProductFilters';
export * from './components/CriticalHistoryTable';
export * from './components/MinimumStockForm';

export const moduleMetadata = {
  name: 'product',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: [
    'ProductForm',
    'ProductList',
    'ProductFilters',
    'CriticalProductList',
    'CriticalProductFilters',
    'CriticalHistoryTable',
    'MinimumStockForm',
  ],
  publicHooks: [
    'useProductList',
    'useProductDetail',
    'useCriticalProducts',
    'useCriticalHistory',
    'useUpdateMinimumStock',
  ],
  publicServices: ['productService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/utils'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query'],
  },
} as const;
