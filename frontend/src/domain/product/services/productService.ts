import { authenticatedClient } from '@/core/lib/api';
import type {
  Product,
  ProductListParams,
  CreateProductDto,
  UpdateProductDto,
  CriticalProduct,
  CriticalProductListParams,
  ProductCriticalHistory,
  UpdateMinimumStockDto,
  UpdateMinimumStockResponse,
} from '../types';

/**
 * @service productService
 * @summary Product management service for authenticated endpoints
 * @domain product
 * @type rest-service
 * @apiContext internal
 */
export const productService = {
  /**
   * @endpoint GET /api/v1/internal/product
   * @summary Fetches list of products with filters
   */
  async list(params?: ProductListParams): Promise<{ data: Product[]; metadata: any }> {
    const response = await authenticatedClient.get('/product', { params });
    return {
      data: response.data.data,
      metadata: response.data.metadata,
    };
  },

  /**
   * @endpoint GET /api/v1/internal/product/:id
   * @summary Fetches single product by ID
   */
  async getById(id: number): Promise<Product> {
    const response = await authenticatedClient.get(`/product/${id}`);
    return response.data.data;
  },

  /**
   * @endpoint POST /api/v1/internal/product
   * @summary Creates new product
   */
  async create(data: CreateProductDto): Promise<Product> {
    const response = await authenticatedClient.post('/product', data);
    return response.data.data;
  },

  /**
   * @endpoint PUT /api/v1/internal/product/:id
   * @summary Updates existing product
   */
  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await authenticatedClient.put(`/product/${id}`, data);
    return response.data.data;
  },

  /**
   * @endpoint DELETE /api/v1/internal/product/:id
   * @summary Deletes product
   */
  async delete(id: number): Promise<void> {
    await authenticatedClient.delete(`/product/${id}`);
  },

  /**
   * @endpoint GET /api/v1/internal/product/critical
   * @summary Fetches list of products in critical stock status
   */
  async listCritical(params?: CriticalProductListParams): Promise<CriticalProduct[]> {
    const response = await authenticatedClient.get('/product/critical', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/product/:id/critical-history
   * @summary Fetches critical stock history for a product
   */
  async getCriticalHistory(id: number): Promise<ProductCriticalHistory> {
    const response = await authenticatedClient.get(`/product/${id}/critical-history`);
    return response.data.data;
  },

  /**
   * @endpoint PATCH /api/v1/internal/product/:id/minimum-stock
   * @summary Updates minimum stock level and re-evaluates critical status
   */
  async updateMinimumStock(
    id: number,
    data: UpdateMinimumStockDto
  ): Promise<UpdateMinimumStockResponse> {
    const response = await authenticatedClient.patch(`/product/${id}/minimum-stock`, data);
    return response.data.data;
  },
};
