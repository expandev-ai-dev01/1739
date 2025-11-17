import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductList } from '@/domain/product/hooks/useProductList';
import { ProductList } from '@/domain/product/components/ProductList';
import { ProductFilters } from '@/domain/product/components/ProductFilters';
import type { ProductListParams } from '@/domain/product/types';

/**
 * @page ProductsPage
 * @summary Product management page with list and filters
 * @domain product
 * @type list-page
 * @category management
 */
export const ProductsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductListParams>({
    sortBy: 'code',
    sortDirection: 'asc',
    pageNumber: 1,
    pageSize: 25,
  });

  const { data, isLoading, remove } = useProductList({ filters });

  const handleView = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await remove(id);
        alert('Produto excluído com sucesso!');
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(`Erro ao excluir produto: ${error.message}`);
        } else {
          alert('Erro ao excluir produto');
        }
      }
    }
  };

  const handleFilterChange = (newFilters: ProductListParams) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={() => navigate('/products/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Novo Produto
        </button>
      </div>

      <ProductFilters filters={filters} onFilterChange={handleFilterChange} />

      <ProductList
        products={data}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductsPage;
