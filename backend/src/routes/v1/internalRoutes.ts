import { Router } from 'express';
import * as productController from '@/api/v1/internal/product/controller';
import * as productDetailController from '@/api/v1/internal/product/detail/controller';
import * as productCriticalController from '@/api/v1/internal/product/critical/controller';
import * as productCriticalHistoryController from '@/api/v1/internal/product/detail/critical-history/controller';
import * as productMinimumStockController from '@/api/v1/internal/product/detail/minimum-stock/controller';

const router = Router();

// Product routes - /api/v1/internal/product
router.get('/product', productController.getHandler);
router.post('/product', productController.postHandler);
router.get('/product/critical', productCriticalController.getHandler);
router.get('/product/:id', productDetailController.getHandler);
router.put('/product/:id', productDetailController.putHandler);
router.delete('/product/:id', productDetailController.deleteHandler);
router.get('/product/:id/critical-history', productCriticalHistoryController.getHandler);
router.patch('/product/:id/minimum-stock', productMinimumStockController.patchHandler);

export default router;
