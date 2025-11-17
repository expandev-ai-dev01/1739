import type { Product, ProductListParams } from '../../types';

export interface UseProductListOptions {
  filters?: ProductListParams;
  enabled?: boolean;
}

export interface UseProductListReturn {
  data: Product[];
  metadata: any;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  create: (data: any) => Promise<Product>;
  update: (params: { id: number; data: any }) => Promise<Product>;
  remove: (id: number) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
}
