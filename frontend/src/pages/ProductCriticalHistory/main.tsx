import { useNavigate, useParams } from 'react-router-dom';
import { useCriticalHistory } from '@/domain/product/hooks/useCriticalHistory';
import { CriticalHistoryTable } from '@/domain/product/components/CriticalHistoryTable';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

/**
 * @page ProductCriticalHistoryPage
 * @summary Page displaying critical stock history for a product
 * @domain product
 * @type detail-page
 * @category management
 */
export const ProductCriticalHistoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data, isLoading } = useCriticalHistory({ id: productId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Histórico não encontrado</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  const { product, history } = data;
  const activeEntry = history.find((entry) => !entry.dateExited);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Histórico de Estoque Crítico</h1>
        <button
          onClick={() => navigate(`/products/${productId}`)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Código</h3>
            <p className="text-lg font-semibold text-gray-900">{product.code}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Categoria</h3>
            <p className="text-lg text-gray-900">{product.categoryName}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
            <p className="text-lg text-gray-900">{product.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Estoque Mínimo</h3>
            <p className="text-lg text-gray-900">{product.minimumStock}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Estoque Atual</h3>
            <p
              className={`text-lg font-semibold ${
                product.currentStock <= product.minimumStock ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              {product.currentStock}
              {activeEntry && (
                <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                  EM CRÍTICO
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Períodos Críticos</h2>
        <CriticalHistoryTable history={history} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ProductCriticalHistoryPage;
