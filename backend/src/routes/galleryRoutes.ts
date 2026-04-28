import express from 'express';
import {
  getGalleries,
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from '../controllers/galleryController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getGalleries);
router.get('/:id', getGallery);
router.post('/', protect, createGallery);
router.put('/:id', protect, updateGallery);
router.delete('/:id', protect, deleteGallery);

export default router;

