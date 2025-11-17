import { useNavigate } from 'react-router-dom';
import { useStockMovementCreate } from '@/domain/stockMovement/hooks/useStockMovementCreate';
import { StockMovementForm } from '@/domain/stockMovement/components/StockMovementForm';
import type { CreateStockMovementDto } from '@/domain/stockMovement/types';

/**
 * @page StockMovementNewPage
 * @summary Page for creating new stock movements
 * @domain stockMovement
 * @type form-page
 * @category management
 */
export const StockMovementNewPage = () => {
  const navigate = useNavigate();
  const { create, isCreating } = useStockMovementCreate();

  const handleSubmit = async (data: CreateStockMovementDto) => {
    try {
      const result = await create(data);
      const movementType = data.movementType === 'ENTRY' ? 'entrada' : 'saída';
      alert(
        `Movimentação de ${movementType} registrada com sucesso!\n\nNovo estoque: ${result.newQuantity}`
      );
      navigate('/stock-movements');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Erro ao registrar movimentação: ${error.message}`);
      } else {
        alert('Erro ao registrar movimentação');
      }
    }
  };

  const handleCancel = () => {
    navigate('/stock-movements');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nova Movimentação de Estoque</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <StockMovementForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isCreating}
        />
      </div>
    </div>
  );
};

export default StockMovementNewPage;
