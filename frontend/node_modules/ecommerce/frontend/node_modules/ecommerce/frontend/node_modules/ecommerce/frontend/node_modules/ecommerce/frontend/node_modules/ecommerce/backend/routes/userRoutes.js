import express from 'express'
import { getProducts, getProductsById } from '../controllers/productController.js';
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUsersByID,
    deleteUser,
    updateUser
} from "../controllers/userControler.js"
import { protect,admin } from '../middleware/authMiddleware.js';

const router = express.Router();

//  (baseURL/users/) = (/) => baseURL = http://localhost:5000/api
router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/logout',logoutUser);
router.post('/auth',authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser).get(protect, admin, getUsersByID).put(protect, admin, updateUser)

export default router