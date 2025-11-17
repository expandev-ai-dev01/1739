import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { UseProductListOptions, UseProductListReturn } from './types';

/**
 * @hook useProductList
 * @summary Manages product list with caching and mutations
 * @domain product
 * @type domain-hook
 * @category data
 */
export const useProductList = (options: UseProductListOptions = {}): UseProductListReturn => {
  const { filters = {}, enabled = true } = options;
  const queryClient = useQueryClient();
  const queryKey = ['products', filters];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: () => productService.list(filters),
    enabled,
  });

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const { mutateAsync: remove, isPending: isRemoving } = useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    data: data?.data || [],
    metadata: data?.metadata || {},
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isRemoving,
  };
};
