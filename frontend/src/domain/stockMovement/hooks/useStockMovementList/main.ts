import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseStockMovementListOptions, UseStockMovementListReturn } from './types';

/**
 * @hook useStockMovementList
 * @summary Fetches list of stock movements with caching
 * @domain stockMovement
 * @type domain-hook
 * @category data
 */
export const useStockMovementList = (
  options: UseStockMovementListOptions = {}
): UseStockMovementListReturn => {
  const { filters = {}, enabled = true } = options;
  const queryKey = ['stock-movements', filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => stockMovementService.list(filters),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    data: data?.data || [],
    metadata: data?.metadata || {},
    isLoading,
    error,
    refetch,
  };
};
