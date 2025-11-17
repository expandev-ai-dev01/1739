import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '@/domain/product/hooks/useProductDetail';
import { useProductList } from '@/domain/product/hooks/useProductList';
import { ProductForm } from '@/domain/product/components/ProductForm';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { UpdateProductDto, CreateProductDto } from '@/domain/product/types';

/**
 * @page ProductEditPage
 * @summary Page for editing existing products
 * @domain product
 * @type form-page
 * @category management
 */
export const ProductEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { product, isLoading } = useProductDetail({ id: productId });
  const { update, isUpdating } = useProductList();

  const handleSubmit = async (data: CreateProductDto | UpdateProductDto) => {
    try {
      await update({ id: productId, data: data as UpdateProductDto });
      alert('Produto atualizado com sucesso!');
      navigate('/products');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao atualizar produto: ${error.message}`);
      } else {
        alert('Erro ao atualizar produto');
      }
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Produto não encontrado</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Produto</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
};

export default ProductEditPage;
