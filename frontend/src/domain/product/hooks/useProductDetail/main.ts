import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import type { UseProductDetailOptions, UseProductDetailReturn } from './types';

/**
 * @hook useProductDetail
 * @summary Fetches single product details
 * @domain product
 * @type domain-hook
 * @category data
 */
export const useProductDetail = (options: UseProductDetailOptions): UseProductDetailReturn => {
  const { id, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    enabled: enabled && !!id,
  });

  return {
    product: data || null,
    isLoading,
    error,
    refetch,
  };
};
