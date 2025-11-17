import { useState } from 'react';
import type { CriticalProductFiltersProps } from './types';

/**
 * @component CriticalProductFilters
 * @summary Filter controls for critical product list
 * @domain product
 * @type domain-component
 * @category form
 */
export const CriticalProductFilters = (props: CriticalProductFiltersProps) => {
  const { filters, onFilterChange } = props;
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      sortBy: 'quantity' as const,
      sortDirection: 'asc' as const,
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todas</option>
            <option value="1">Eletrônicos</option>
            <option value="2">Alimentos</option>
            <option value="3">Vestuário</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sortBy"
            value={localFilters.sortBy || 'quantity'}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sortBy: e.target.value as 'quantity' | 'code' | 'description' | 'category',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="quantity">Quantidade</option>
            <option value="code">Código</option>
            <option value="description">Descrição</option>
            <option value="category">Categoria</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-1">
            Direção
          </label>
          <select
            id="sortDirection"
            value={localFilters.sortDirection || 'asc'}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                sortDirection: e.target.value as 'asc' | 'desc',
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
