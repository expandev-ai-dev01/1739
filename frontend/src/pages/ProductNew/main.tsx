import { useNavigate } from 'react-router-dom';
import { useProductList } from '@/domain/product/hooks/useProductList';
import { ProductForm } from '@/domain/product/components/ProductForm';
import type { CreateProductDto, UpdateProductDto } from '@/domain/product/types';

/**
 * @page ProductNewPage
 * @summary Page for creating new products
 * @domain product
 * @type form-page
 * @category management
 */
export const ProductNewPage = () => {
  const navigate = useNavigate();
  const { create, isCreating } = useProductList();

  const handleSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    try {
      await create(data as CreateProductDto);
      alert('Produto cadastrado com sucesso!');
      navigate('/products');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao cadastrar produto: ${error.message}`);
      } else {
        alert('Erro ao cadastrar produto');
      }
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Novo Produto</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
      </div>
    </div>
  );
};

export default ProductNewPage;
