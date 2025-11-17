import { useState } from 'react';
import type { ProductFiltersProps } from './types';

/**
 * @component ProductFilters
 * @summary Filter controls for product list
 * @domain product
 * @type domain-component
 * @category form
 */
export const ProductFilters = (props: ProductFiltersProps) => {
  const { filters, onFilterChange } = props;
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      sortBy: 'code' as const,
      sortDirection: 'asc' as const,
      pageNumber: 1,
      pageSize: 25,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filterCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código
          </label>
          <input
            id="filterCode"
            type="text"
            value={localFilters.filterCode || ''}
            onChange={(e) => setLocalFilters({ ...localFilters, filterCode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filtrar por código"
          />
        </div>

        <div>
          <label
            htmlFor="filterDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição
          </label>
          <input
            id="filterDescription"
            type="text"
            value={localFilters.filterDescription || ''}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, filterDescription: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Filtrar por descrição"
          />
        </div>

        <div>
          <label
            htmlFor="filterIdCategory"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Categoria
          </label>
          <select
            id="filterIdCategory"
            value={localFilters.filterIdCategory || ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                filterIdCategory: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="1">Eletrônicos</option>
            <option value="2">Alimentos</option>
            <option value="3">Vestuário</option>
          </select>
        </div>

        <div>
          <label htmlFor="filterActive" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="filterActive"
            value={localFilters.filterActive !== undefined ? localFilters.filterActive : ''}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                filterActive: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
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
