import { authenticatedClient } from '@/core/lib/api';
import type {
  StockMovement,
  StockMovementListParams,
  CreateStockMovementDto,
  StockMovementDetail,
} from '../types';

/**
 * @service stockMovementService
 * @summary Stock movement management service for authenticated endpoints
 * @domain stockMovement
 * @type rest-service
 * @apiContext internal
 */
export const stockMovementService = {
  /**
   * @endpoint GET /api/v1/internal/stock-movement
   * @summary Fetches list of stock movements with filters
   */
  async list(params?: StockMovementListParams): Promise<{ data: StockMovement[]; metadata: any }> {
    const response = await authenticatedClient.get('/stock-movement', { params });
    return {
      data: response.data.data,
      metadata: response.data.metadata,
    };
  },

  /**
   * @endpoint GET /api/v1/internal/stock-movement/:id
   * @summary Fetches single stock movement by ID
   */
  async getById(id: number): Promise<StockMovementDetail> {
    const response = await authenticatedClient.get(`/stock-movement/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/stock-movement
   * @summary Creates new stock movement (entry or exit)
   */
  async create(
    data: CreateStockMovementDto
  ): Promise<{ idStockMovement: number; newQuantity: number }> {
    const response = await authenticatedClient.post('/stock-movement', data);
    return response.data.data;
  },
};
