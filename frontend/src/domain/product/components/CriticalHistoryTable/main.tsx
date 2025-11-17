import { formatDateTime } from '@/core/utils';
import type { CriticalHistoryTableProps } from './types';

/**
 * @component CriticalHistoryTable
 * @summary Displays critical stock history for a product
 * @domain product
 * @type domain-component
 * @category display
 */
export const CriticalHistoryTable = (props: CriticalHistoryTableProps) => {
  const { history, isLoading = false } = props;

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Carregando histórico...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum histórico de estoque crítico encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Entrada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data Saída
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade Mínima
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duração (dias)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {history.map((entry) => {
            const isActive = !entry.dateExited;

            return (
              <tr key={entry.idHistory} className={isActive ? 'bg-red-50' : 'hover:bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(entry.dateEntered)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.dateExited ? formatDateTime(entry.dateExited) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                  {entry.minimumQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.durationDays !== undefined ? entry.durationDays : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isActive ? 'Em Crítico' : 'Resolvido'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
