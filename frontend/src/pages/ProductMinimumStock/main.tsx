import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '@/domain/product/hooks/useProductDetail';
import { useUpdateMinimumStock } from '@/domain/product/hooks/useUpdateMinimumStock';
import { MinimumStockForm } from '@/domain/product/components/MinimumStockForm';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

/**
 * @page ProductMinimumStockPage
 * @summary Page for updating product minimum stock level
 * @domain product
 * @type form-page
 * @category management
 */
export const ProductMinimumStockPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { product, isLoading } = useProductDetail({ id: productId });
  const { updateMinimumStock, isUpdating } = useUpdateMinimumStock();

  const handleSubmit = async (minimumStock: number) => {
    try {
      const result = await updateMinimumStock(productId, { minimumStock });

      let message = `Estoque mínimo atualizado de ${result.previousMinimumStock} para ${result.minimumStock}`;

      if (result.wasRevaluated) {
        if (result.isCritical) {
          message += '\n\n⚠️ ATENÇÃO: Produto agora está em estoque crítico!';
        } else {
          message += '\n\n✓ Produto não está mais em estoque crítico.';
        }
      }

      alert(message);
      navigate(`/products/${productId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao atualizar estoque mínimo: ${error.message}`);
      } else {
        alert('Erro ao atualizar estoque mínimo');
      }
    }
  };

  const handleCancel = () => {
    navigate(`/products/${productId}`);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurar Estoque Mínimo</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Código</h3>
            <p className="text-lg font-semibold text-gray-900">{product.code}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Categoria</h3>
            <p className="text-lg text-gray-900">{product.categoryName || '-'}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
            <p className="text-lg text-gray-900">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Atualizar Limite de Estoque Crítico
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> Ao alterar o estoque mínimo, o sistema irá reavaliar
            automaticamente se o produto está em estado crítico. Se a quantidade atual estiver
            abaixo ou igual ao novo limite, o produto será marcado como crítico.
          </p>
        </div>
        <MinimumStockForm
          currentMinimumStock={product.minimumStock}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isUpdating}
        />
      </div>
    </div>
  );
};

export default ProductMinimumStockPage;
