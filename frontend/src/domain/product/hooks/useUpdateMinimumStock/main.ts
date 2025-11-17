import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { UseUpdateMinimumStockReturn } from './types';

/**
 * @hook useUpdateMinimumStock
 * @summary Updates minimum stock level for a product
 * @domain product
 * @type domain-hook
 * @category mutation
 */
export const useUpdateMinimumStock = (): UseUpdateMinimumStockReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      productService.updateMinimumStock(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'critical'] });
    },
  });

  return {
    updateMinimumStock: (id, data) => mutateAsync({ id, data }),
    isUpdating: isPending,
  };
};
