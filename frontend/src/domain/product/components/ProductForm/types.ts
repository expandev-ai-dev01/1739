import type { CreateProductDto, UpdateProductDto, Product } from '../../types';

export interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductDto | UpdateProductDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
