import express from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/all', protect, authorize('admin'), getAllUsers);

export default router;

