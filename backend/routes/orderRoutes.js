import express from 'express';
import { addOrderItems, getMyOrders, getOrders, getOrderStats } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/myorders').get(protect, getMyOrders);

export default router;
