import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductsById,
    updateProduct,

} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductsById).put(protect,admin,updateProduct);

export default router;
