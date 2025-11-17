import { useState } from 'react';
import type { StockMovementFiltersProps } from './types';

/**
 * @component StockMovementFilters
 * @summary Filter controls for stock movement list
 * @domain stockMovement
 * @type domain-component
 * @category form
 */
export const StockMovementFilters = (props: StockMovementFiltersProps) => {
  const { filters, onFilterChange } = props;
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      sortBy: 'movementDate' as const,
      sortDirection: 'desc' as const,
      pageNumber: 1,
      pageSize: 50,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filterIdProduct" className="block text-sm font-medium text-gray-700 mb-1">
            Produto
          </label>
          <select
            id="filterIdProduct"
            value={localFilters.filterIdProduct || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                filterIdProduct: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="1">Produto Exemplo 1</option>
            <option value="2">Produto Exemplo 2</option>
            <option value="3">Produto Exemplo 3</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filterMovementType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo
          </label>
          <select
            id="filterMovementType"
            value={localFilters.filterMovementType || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                filterMovementType: e.target.value
                  ? (e.target.value as 'ENTRY' | 'EXIT')
                  : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="ENTRY">Entrada</option>
            <option value="EXIT">Saída</option>
          </select>
        </div>

        <div>
          <label htmlFor="filterDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <input
            id="filterDateFrom"
            type="date"
            value={localFilters.filterDateFrom || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, filterDateFrom: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="filterDateTo" className="block text-sm font-medium text-gray-700 mb-1">
            Data Final
          </label>
          <input
            id="filterDateTo"
            type="date"
            value={localFilters.filterDateTo || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, filterDateTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sortBy"
            value={localFilters.sortBy || 'movementDate'}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sortBy: e.target.value as 'movementDate' | 'product' | 'quantity' | 'type',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="movementDate">Data</option>
            <option value="product">Produto</option>
            <option value="quantity">Quantidade</option>
            <option value="type">Tipo</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-1">
            Direção
          </label>
          <select
            id="sortDirection"
            value={localFilters.sortDirection || 'desc'}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sortDirection: e.target.value as 'asc' | 'desc',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
};
