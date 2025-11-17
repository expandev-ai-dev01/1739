import type { StockMovement } from '../../types';

export interface StockMovementListProps {
  movements: StockMovement[];
  onView: (id: number) => void;
  isLoading?: boolean;
}
