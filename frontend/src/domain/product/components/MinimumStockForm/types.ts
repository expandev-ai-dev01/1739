export interface MinimumStockFormProps {
  currentMinimumStock: number;
  onSubmit: (minimumStock: number) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
