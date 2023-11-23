import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductsById,
    updateProduct,
    deleteProduct,

} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductsById).put(protect,admin,updateProduct).delete(protect, admin, deleteProduct);

export default router;
