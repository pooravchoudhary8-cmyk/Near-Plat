import express from 'express';
import { getProducts, getProductById, deleteProduct, getRelatedProducts } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct);
router.route('/:id/related').get(getRelatedProducts);

export default router;
