import { useNavigate, useParams } from 'react-router-dom';
import { useProductDetail } from '@/domain/product/hooks/useProductDetail';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { formatDate, formatDateTime } from '@/core/utils';

/**
 * @page ProductDetailPage
 * @summary Page displaying detailed product information
 * @domain product
 * @type detail-page
 * @category management
 */
export const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { product, isLoading } = useProductDetail({ id: productId });

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

  const isLowStock =
    product.currentStock !== undefined && product.currentStock <= product.minimumStock;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes do Produto</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/products/${productId}/edit`)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Editar
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Voltar
          </button>
        </div>
      </div>

      {isLowStock && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-800">Alerta de Estoque Crítico</p>
              <p className="text-sm text-red-700">
                Este produto está com estoque abaixo ou igual ao mínimo configurado
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Código</h3>
            <p className="text-lg font-semibold text-gray-900">{product.code}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                product.active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {product.active === 1 ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição</h3>
            <p className="text-lg text-gray-900">{product.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Categoria</h3>
            <p className="text-lg text-gray-900">{product.categoryName || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Unidade de Medida</h3>
            <p className="text-lg text-gray-900">{product.unitOfMeasureName || '-'}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Estoque Mínimo</h3>
            <div className="flex items-center gap-2">
              <p className="text-lg text-gray-900">{product.minimumStock}</p>
              <button
                onClick={() => navigate(`/products/${productId}/minimum-stock`)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Configurar
              </button>
            </div>
          </div>

          {product.currentStock !== undefined && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estoque Atual</h3>
              <p
                className={`text-lg font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}
              >
                {product.currentStock}
                {isLowStock && (
                  <span className="ml-2 text-sm font-normal text-red-600">(Estoque Baixo!)</span>
                )}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Data de Cadastro</h3>
            <p className="text-lg text-gray-900">{formatDateTime(product.dateCreated)}</p>
          </div>

          {product.dateUpdated && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última Atualização</h3>
              <p className="text-lg text-gray-900">{formatDateTime(product.dateUpdated)}</p>
            </div>
          )}

          {product.lastMovement && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última Movimentação</h3>
              <p className="text-lg text-gray-900">{formatDateTime(product.lastMovement)}</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate(`/products/${productId}/critical-history`)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Ver Histórico de Estoque Crítico
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
