import type { ProductListParams } from '../../types';

export interface ProductFiltersProps {
  filters: ProductListParams;
  onFilterChange: (filters: ProductListParams) => void;
}
