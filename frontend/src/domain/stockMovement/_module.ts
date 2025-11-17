/**
 * @module stockMovement
 * @summary Stock movement management domain with entry/exit registration and history
 * @domain functional
 * @version 1.0.0
 */

export * from './types';
export * from './services/stockMovementService';
export * from './hooks/useStockMovementList';
export * from './hooks/useStockMovementDetail';
export * from './hooks/useStockMovementCreate';
export * from './components/StockMovementForm';
export * from './components/StockMovementList';
export * from './components/StockMovementFilters';

export const moduleMetadata = {
  name: 'stockMovement',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['StockMovementForm', 'StockMovementList', 'StockMovementFilters'],
  publicHooks: ['useStockMovementList', 'useStockMovementDetail', 'useStockMovementCreate'],
  publicServices: ['stockMovementService'],
  dependencies: {
    internal: ['@/core/lib/api', '@/core/utils'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query'],
  },
} as const;
