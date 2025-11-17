import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { UseCriticalProductsOptions, UseCriticalProductsReturn } from './types';

/**
 * @hook useCriticalProducts
 * @summary Fetches list of products in critical stock status
 * @domain product
 * @type domain-hook
 * @category data
 */
export const useCriticalProducts = (
  options: UseCriticalProductsOptions = {}
): UseCriticalProductsReturn => {
  const { filters = {}, enabled = true } = options;
  const queryKey = ['products', 'critical', filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => productService.listCritical(filters),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
  };
};
