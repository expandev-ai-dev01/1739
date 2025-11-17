import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { UseCriticalHistoryOptions, UseCriticalHistoryReturn } from './types';

/**
 * @hook useCriticalHistory
 * @summary Fetches critical stock history for a product
 * @domain product
 * @type domain-hook
 * @category data
 */
export const useCriticalHistory = (
  options: UseCriticalHistoryOptions
): UseCriticalHistoryReturn => {
  const { id, enabled = true } = options;
  const queryKey = ['product', id, 'critical-history'];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => productService.getCriticalHistory(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: data || null,
    isLoading,
    error,
    refetch,
  };
};
