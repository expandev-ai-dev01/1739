import type { CriticalProductListProps } from './types';

/**
 * @component CriticalProductList
 * @summary Displays list of products in critical stock status
 * @domain product
 * @type domain-component
 * @category display
 */
export const CriticalProductList = (props: CriticalProductListProps) => {
  const { products, onView, isLoading = false } = props;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Carregando produtos críticos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum produto em estoque crítico
        </p>
        <p className="text-gray-600">Todos os produtos estão com estoque adequado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-red-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
              Código
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
              Estoque Atual
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
              Estoque Mínimo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">
              Unidade
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-red-900 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => {
            const isZeroStock = product.currentStock === 0;
            const rowClass = isZeroStock ? 'bg-red-50' : 'hover:bg-gray-50';

            return (
              <tr key={product.idProduct} className={rowClass}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.categoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`text-sm font-semibold ${
                      isZeroStock ? 'text-red-700' : 'text-red-600'
                    }`}
                  >
                    {product.currentStock}
                    {isZeroStock && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                        ZERADO
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.minimumStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.unitOfMeasureName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(product.idProduct)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
