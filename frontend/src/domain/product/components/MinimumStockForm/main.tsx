import { useState } from 'react';
import type { MinimumStockFormProps } from './types';

/**
 * @component MinimumStockForm
 * @summary Form for updating product minimum stock level
 * @domain product
 * @type domain-component
 * @category form
 */
export const MinimumStockForm = (props: MinimumStockFormProps) => {
  const { currentMinimumStock, onSubmit, onCancel, isSubmitting = false } = props;
  const [minimumStock, setMinimumStock] = useState(currentMinimumStock);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (minimumStock < 0) {
      setError('Estoque mínimo deve ser maior ou igual a zero');
      return;
    }

    if (minimumStock === currentMinimumStock) {
      setError('O valor informado é igual ao atual');
      return;
    }

    try {
      await onSubmit(minimumStock);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao atualizar estoque mínimo');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700 mb-1">
          Novo Estoque Mínimo
        </label>
        <input
          id="minimumStock"
          type="number"
          min="0"
          value={minimumStock}
          onChange={(e) => setMinimumStock(Number(e.target.value))}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Digite o novo estoque mínimo"
        />
        <p className="mt-1 text-sm text-gray-500">Estoque mínimo atual: {currentMinimumStock}</p>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Atualizando...' : 'Atualizar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
