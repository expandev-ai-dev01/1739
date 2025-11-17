import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ProductFormProps } from './types';
import type { CreateProductDto, UpdateProductDto } from '../../types';

const productSchema = z.object({
  code: z
    .string()
    .min(3, 'Código deve ter no mínimo 3 caracteres')
    .max(20, 'Código deve ter no máximo 20 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Código deve conter apenas letras maiúsculas e números'),
  description: z
    .string()
    .min(5, 'Descrição deve ter no mínimo 5 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),
  idCategory: z.number().int().positive('Categoria é obrigatória'),
  idUnitOfMeasure: z.number().int().positive('Unidade de medida é obrigatória'),
  minimumStock: z.number().int().min(0, 'Estoque mínimo deve ser maior ou igual a zero'),
  active: z.number().int().min(0).max(1),
});

const productUpdateSchema = z.object({
  description: z
    .string()
    .min(5, 'Descrição deve ter no mínimo 5 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres'),
  idCategory: z.number().int().positive('Categoria é obrigatória'),
  idUnitOfMeasure: z.number().int().positive('Unidade de medida é obrigatória'),
  minimumStock: z.number().int().min(0, 'Estoque mínimo deve ser maior ou igual a zero'),
  active: z.number().int().min(0).max(1),
});

type ProductFormData = z.infer<typeof productSchema>;
type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;

/**
 * @component ProductForm
 * @summary Form for creating and editing products
 * @domain product
 * @type domain-component
 * @category form
 */
export const ProductForm = (props: ProductFormProps) => {
  const { product, onSubmit, onCancel, isSubmitting = false } = props;
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData | ProductUpdateFormData>({
    resolver: zodResolver(isEdit ? productUpdateSchema : productSchema),
    defaultValues: product
      ? {
          description: product.description,
          idCategory: product.idCategory,
          idUnitOfMeasure: product.idUnitOfMeasure,
          minimumStock: product.minimumStock,
          active: product.active,
        }
      : {
          code: '',
          description: '',
          idCategory: 0,
          idUnitOfMeasure: 0,
          minimumStock: 5,
          active: 1,
        },
  });

  const handleFormSubmit = async (data: ProductFormData | ProductUpdateFormData) => {
    if (isEdit) {
      await onSubmit(data as UpdateProductDto);
    } else {
      await onSubmit(data as CreateProductDto);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {!isEdit && (
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Código do Produto *
          </label>
          <input
            id="code"
            type="text"
            {...register('code')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: PROD001"
          />
          {'code' in errors && errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descrição detalhada do produto"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="idCategory" className="block text-sm font-medium text-gray-700 mb-1">
          Categoria *
        </label>
        <select
          id="idCategory"
          {...register('idCategory', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Selecione uma categoria</option>
          <option value="1">Eletrônicos</option>
          <option value="2">Alimentos</option>
          <option value="3">Vestuário</option>
        </select>
        {errors.idCategory && (
          <p className="mt-1 text-sm text-red-600">{errors.idCategory.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="idUnitOfMeasure" className="block text-sm font-medium text-gray-700 mb-1">
          Unidade de Medida *
        </label>
        <select
          id="idUnitOfMeasure"
          {...register('idUnitOfMeasure', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">Selecione uma unidade</option>
          <option value="1">Unidade</option>
          <option value="2">Kg</option>
          <option value="3">Litro</option>
          <option value="4">Metro</option>
        </select>
        {errors.idUnitOfMeasure && (
          <p className="mt-1 text-sm text-red-600">{errors.idUnitOfMeasure.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="minimumStock" className="block text-sm font-medium text-gray-700 mb-1">
          Estoque Mínimo
        </label>
        <input
          id="minimumStock"
          type="number"
          {...register('minimumStock', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="5"
        />
        {errors.minimumStock && (
          <p className="mt-1 text-sm text-red-600">{errors.minimumStock.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="active"
          {...register('active', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">Ativo</option>
          <option value="0">Inativo</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
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
