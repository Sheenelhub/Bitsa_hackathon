import express from 'express';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  getContactInfo,
} from '../controllers/contactController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/info', getContactInfo);
router.post('/', createContact);
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id', protect, authorize('admin'), updateContact);

export default router;

