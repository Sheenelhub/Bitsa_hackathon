import { Request, Response } from 'express';
import Gallery from '../models/Gallery';
import { AuthRequest } from '../middleware/auth';

export const getGalleries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { published, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (published !== undefined) query.published = published === 'true';

    const galleries = await Gallery.find(query)
      .populate('event', 'title date')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: galleries.length,
      total,
      data: galleries,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.findById(req.params.id)
      .populate('event', 'title date')
      .populate('uploadedBy', 'name email');

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const createGallery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.create({
      ...req.body,
      uploadedBy: req.user?._id,
    });

    await gallery.populate('event', 'title date');
    await gallery.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const updateGallery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    // Check if user is uploader or admin
    if (gallery.uploadedBy.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to update this gallery' });
      return;
    }

    gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('event', 'title date')
      .populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const deleteGallery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      res.status(404).json({ success: false, message: 'Gallery not found' });
      return;
    }

    // Check if user is uploader or admin
    if (gallery.uploadedBy.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this gallery' });
      return;
    }

    await gallery.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gallery deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

