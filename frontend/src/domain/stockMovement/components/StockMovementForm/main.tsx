import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { StockMovementFormProps } from './types';
import type { CreateStockMovementDto } from '../../types';

const stockMovementSchema = z.object({
  idProduct: z.number().int().positive('Produto é obrigatório'),
  movementType: z.enum(['ENTRY', 'EXIT']),
  quantity: z.number().int().positive('Quantidade deve ser maior que zero'),
  movementDate: z.string().optional(),
});

type StockMovementFormData = z.infer<typeof stockMovementSchema>;

/**
 * @component StockMovementForm
 * @summary Form for creating stock movements (entry or exit)
 * @domain stockMovement
 * @type domain-component
 * @category form
 */
export const StockMovementForm = (props: StockMovementFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false } = props;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      idProduct: 0,
      movementType: 'ENTRY',
      quantity: 1,
      movementDate: '',
    },
  });

  const movementType = watch('movementType');

  const handleFormSubmit = async (data: StockMovementFormData) => {
    const submitData: CreateStockMovementDto = {
      idProduct: data.idProduct,
      movementType: data.movementType,
      quantity: data.quantity,
    };

    if (data.movementDate) {
      submitData.movementDate = data.movementDate;
    }

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="idProduct" className="block text-sm font-medium text-gray-700 mb-1">
          Produto *
        </label>
        <select
          id="idProduct"
          {...register('idProduct', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Selecione um produto</option>
          <option value="1">Produto Exemplo 1</option>
          <option value="2">Produto Exemplo 2</option>
          <option value="3">Produto Exemplo 3</option>
        </select>
        {errors.idProduct && (
          <p className="mt-1 text-sm text-red-600">{errors.idProduct.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="movementType" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Movimentação *
        </label>
        <select
          id="movementType"
          {...register('movementType')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ENTRY">Entrada</option>
          <option value="EXIT">Saída</option>
        </select>
        {errors.movementType && (
          <p className="mt-1 text-sm text-red-600">{errors.movementType.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade *
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          {...register('quantity', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Digite a quantidade"
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>

      <div>
        <label htmlFor="movementDate" className="block text-sm font-medium text-gray-700 mb-1">
          Data da Movimentação (opcional)
        </label>
        <input
          id="movementDate"
          type="datetime-local"
          {...register('movementDate')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Se não informada, será usada a data e hora atual
        </p>
        {errors.movementDate && (
          <p className="mt-1 text-sm text-red-600">{errors.movementDate.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <p className="text-sm text-blue-800">
          <strong>Atenção:</strong> Esta movimentação de{' '}
          <strong>{movementType === 'ENTRY' ? 'ENTRADA' : 'SAÍDA'}</strong> irá{' '}
          {movementType === 'ENTRY' ? 'incrementar' : 'decrementar'} o estoque do produto
          selecionado.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Movimentação'}
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
