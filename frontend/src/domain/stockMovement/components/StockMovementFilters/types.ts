import type { StockMovementListParams } from '../../types';

export interface StockMovementFiltersProps {
  filters: StockMovementListParams;
  onFilterChange: (filters: StockMovementListParams) => void;
}
