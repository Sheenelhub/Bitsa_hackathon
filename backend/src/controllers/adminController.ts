import { Response } from 'express';
import User from '../models/User';
import BlogPost from '../models/BlogPost';
import Event from '../models/Event';
import Gallery from '../models/Gallery';
import Contact from '../models/Contact';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await BlogPost.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalGalleries = await Gallery.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const publishedPosts = await BlogPost.countDocuments({ published: true });
    const publishedEvents = await Event.countDocuments({ published: true });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
        },
        posts: {
          total: totalPosts,
          published: publishedPosts,
          draft: totalPosts - publishedPosts,
        },
        events: {
          total: totalEvents,
          published: publishedEvents,
          draft: totalEvents - publishedEvents,
        },
        galleries: {
          total: totalGalleries,
        },
        contacts: {
          total: totalContacts,
          pending: pendingContacts,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.role === 'admin') {
      res.status(400).json({ success: false, message: 'Cannot delete admin user' });
      return;
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

