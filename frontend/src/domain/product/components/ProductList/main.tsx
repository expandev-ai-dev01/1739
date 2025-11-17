import { formatDate } from '@/core/utils';
import type { ProductListProps } from './types';

/**
 * @component ProductList
 * @summary Displays list of products in a table
 * @domain product
 * @type domain-component
 * @category display
 */
export const ProductList = (props: ProductListProps) => {
  const { products, onView, onEdit, onDelete, isLoading = false } = props;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Carregando produtos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estoque Mínimo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Cadastro
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.idProduct} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.code}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{product.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {product.categoryName || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {product.minimumStock}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    product.active === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.active === 1 ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(product.dateCreated)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onView(product.idProduct)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Ver
                </button>
                <button
                  onClick={() => onEdit(product.idProduct)}
                  className="text-yellow-600 hover:text-yellow-900 mr-3"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(product.idProduct)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
