import type { CreateStockMovementDto } from '../../types';

export interface StockMovementFormProps {
  onSubmit: (data: CreateStockMovementDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
