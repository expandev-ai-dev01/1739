import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCriticalProducts } from '@/domain/product/hooks/useCriticalProducts';
import { CriticalProductList } from '@/domain/product/components/CriticalProductList';
import { CriticalProductFilters } from '@/domain/product/components/CriticalProductFilters';
import type { CriticalProductListParams } from '@/domain/product/types';

/**
 * @page CriticalProductsPage
 * @summary Page displaying products in critical stock status
 * @domain product
 * @type list-page
 * @category management
 */
export const CriticalProductsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<CriticalProductListParams>({
    sortBy: 'quantity',
    sortDirection: 'asc',
  });

  const { data, isLoading } = useCriticalProducts({ filters });

  const handleView = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleFilterChange = (newFilters: CriticalProductListParams) => {
    setFilters(newFilters);
  };

  const criticalCount = data.length;
  const zeroStockCount = data.filter((p) => p.currentStock === 0).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-700 mb-2">Produtos em Estoque Crítico</h1>
        <div className="flex gap-4">
          <div className="bg-red-100 px-4 py-2 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Total em Crítico</p>
            <p className="text-2xl font-bold text-red-700">{criticalCount}</p>
          </div>
          {zeroStockCount > 0 && (
            <div className="bg-red-600 px-4 py-2 rounded-lg">
              <p className="text-sm text-white font-medium">Estoque Zerado</p>
              <p className="text-2xl font-bold text-white">{zeroStockCount}</p>
            </div>
          )}
        </div>
      </div>

      <CriticalProductFilters filters={filters} onFilterChange={handleFilterChange} />

      <CriticalProductList products={data} onView={handleView} isLoading={isLoading} />
    </div>
  );
};

export default CriticalProductsPage;
