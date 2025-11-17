import type { CriticalProductListParams } from '../../types';

export interface CriticalProductFiltersProps {
  filters: CriticalProductListParams;
  onFilterChange: (filters: CriticalProductListParams) => void;
}
