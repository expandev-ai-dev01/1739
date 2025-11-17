import { useMutation, useQueryClient } from '@tanstack/react-query';
import { stockMovementService } from '../../services/stockMovementService';
import type { UseStockMovementCreateReturn } from './types';

/**
 * @hook useStockMovementCreate
 * @summary Creates new stock movement (entry or exit)
 * @domain stockMovement
 * @type domain-hook
 * @category mutation
 */
export const useStockMovementCreate = (): UseStockMovementCreateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: stockMovementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'critical'] });
    },
  });

  return {
    create: mutateAsync,
    isCreating: isPending,
  };
};
