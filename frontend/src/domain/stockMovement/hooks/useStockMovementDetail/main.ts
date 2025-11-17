import { useQuery } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseStockMovementDetailOptions, UseStockMovementDetailReturn } from './types';

/**
 * @hook useStockMovementDetail
 * @summary Fetches single stock movement details
 * @domain stockMovement
 * @type domain-hook
 * @category data
 */
export const useStockMovementDetail = (
  options: UseStockMovementDetailOptions
): UseStockMovementDetailReturn => {
  const { id, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['stock-movement', id],
    queryFn: () => stockMovementService.getById(id),
    enabled: enabled && !!id,
  });

  return {
    movement: data || null,
    isLoading,
    error,
    refetch,
  };
};
