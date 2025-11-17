import type { Product } from '../../types';

export interface ProductListProps {
  products: Product[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}
