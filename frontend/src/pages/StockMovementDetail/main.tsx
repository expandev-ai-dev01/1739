import { useNavigate, useParams } from 'react-router-dom';
import { useStockMovementDetail } from '@/domain/stockMovement/hooks/useStockMovementDetail';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { formatDateTime } from '@/core/utils';

/**
 * @page StockMovementDetailPage
 * @summary Page displaying detailed stock movement information
 * @domain stockMovement
 * @type detail-page
 * @category management
 */
export const StockMovementDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const movementId = Number(id);

  const { movement, isLoading } = useStockMovementDetail({ id: movementId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!movement) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Movimentação não encontrada</p>
        <button
          onClick={() => navigate('/stock-movements')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  const isEntry = movement.movementType === 'ENTRY';
  const stockChange = isEntry ? movement.quantity : -movement.quantity;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Detalhes da Movimentação</h1>
        <button
          onClick={() => navigate('/stock-movements')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Voltar
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <div className={`px-4 py-2 rounded-lg ${isEntry ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className={`text-sm font-medium ${isEntry ? 'text-green-600' : 'text-red-600'}`}>
              Tipo de Movimentação
            </p>
            <p className={`text-2xl font-bold ${isEntry ? 'text-green-700' : 'text-red-700'}`}>
              {isEntry ? 'ENTRADA' : 'SAÍDA'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-lg bg-blue-100">
            <p className="text-sm font-medium text-blue-600">Quantidade</p>
            <p className="text-2xl font-bold text-blue-700">
              {isEntry ? '+' : '-'}
              {movement.quantity}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Código do Produto</h3>
            <p className="text-lg font-semibold text-gray-900">{movement.productCode}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Categoria</h3>
            <p className="text-lg text-gray-900">{movement.categoryName}</p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descrição do Produto</h3>
            <p className="text-lg text-gray-900">{movement.productDescription}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Unidade de Medida</h3>
            <p className="text-lg text-gray-900">{movement.unitOfMeasureName}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Data da Movimentação</h3>
            <p className="text-lg text-gray-900">{formatDateTime(movement.movementDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Responsável</h3>
            <p className="text-lg text-gray-900">{movement.userResponsible}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto no Estoque</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Estoque Anterior</p>
              <p className="text-2xl font-bold text-gray-900">{movement.previousStock}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-600 mb-1">Alteração</p>
              <p className={`text-2xl font-bold ${isEntry ? 'text-green-700' : 'text-red-700'}`}>
                {stockChange > 0 ? '+' : ''}
                {stockChange}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-1">Estoque Atual</p>
              <p className="text-2xl font-bold text-gray-900">{movement.newStock}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMovementDetailPage;
