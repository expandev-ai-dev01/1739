import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStockMovementList } from '@/domain/stockMovement/hooks/useStockMovementList';
import { StockMovementList } from '@/domain/stockMovement/components/StockMovementList';
import { StockMovementFilters } from '@/domain/stockMovement/components/StockMovementFilters';
import type { StockMovementListParams } from '@/domain/stockMovement/types';

/**
 * @page StockMovementsPage
 * @summary Stock movements history page with list and filters
 * @domain stockMovement
 * @type list-page
 * @category management
 */
export const StockMovementsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<StockMovementListParams>({
    sortBy: 'movementDate',
    sortDirection: 'desc',
    pageNumber: 1,
    pageSize: 50,
  });

  const { data, metadata, isLoading } = useStockMovementList({ filters });

  const handleView = (id: number) => {
    navigate(`/stock-movements/${id}`);
  };

  const handleFilterChange = (newFilters: StockMovementListParams) => {
    setFilters(newFilters);
  };

  const totalCount = metadata?.total || 0;
  const entryCount = data.filter((m) => m.movementType === 'ENTRY').length;
  const exitCount = data.filter((m) => m.movementType === 'EXIT').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Movimentações</h1>
          <div className="flex gap-4">
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-700">{totalCount}</p>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Entradas</p>
              <p className="text-2xl font-bold text-green-700">{entryCount}</p>
            </div>
            <div className="bg-red-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Saídas</p>
              <p className="text-2xl font-bold text-red-700">{exitCount}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/stock-movements/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nova Movimentação
        </button>
      </div>

      <StockMovementFilters filters={filters} onFilterChange={handleFilterChange} />

      <StockMovementList movements={data} onView={handleView} isLoading={isLoading} />

      {metadata?.total > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Mostrando {data.length} de {metadata.total} movimentações
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, pageNumber: (filters.pageNumber || 1) - 1 })}
              disabled={!metadata.hasPrevious}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setFilters({ ...filters, pageNumber: (filters.pageNumber || 1) + 1 })}
              disabled={!metadata.hasNext}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMovementsPage;
