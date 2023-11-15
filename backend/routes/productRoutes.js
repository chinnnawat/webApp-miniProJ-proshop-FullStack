import express from 'express'
import asyncHandler from '../middleware/asyncHandle.js'
import Product from '../models/productModel.js'
import { createProduct, getProducts, getProductsById } from '../controllers/productController.js';
import {protect,admin} from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductsById)


export default router