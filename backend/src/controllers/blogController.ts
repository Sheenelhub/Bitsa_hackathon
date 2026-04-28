import { Request, Response } from 'express';
import BlogPost from '../models/BlogPost';
import { AuthRequest } from '../middleware/auth';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, published, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (published !== undefined) query.published = published === 'true';

    const posts = await BlogPost.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      data: posts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name email avatar');
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, content, category, tags, featuredImage, published } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      category,
      tags: tags || [],
      featuredImage,
      published: published || false,
      author: req.user?._id,
    });

    await post.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to update this post' });
      return;
    }

    post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name email avatar');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    // Check if user is author or admin
    if (post.author.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
      return;
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

