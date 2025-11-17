import type { CriticalProduct } from '../../types';

export interface CriticalProductListProps {
  products: CriticalProduct[];
  onView: (id: number) => void;
  isLoading?: boolean;
}
