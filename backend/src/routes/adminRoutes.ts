import express from 'express';
import { getDashboardStats, updateUserRole, deleteUser } from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getDashboardStats);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;

