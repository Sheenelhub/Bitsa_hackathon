import { Request, Response } from 'express';
import Contact from '../models/Contact';
import { AuthRequest } from '../middleware/auth';

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Contact message sent successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .populate('repliedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      data: contacts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findById(req.params.id).populate('repliedBy', 'name email');

    if (!contact) {
      res.status(404).json({ success: false, message: 'Contact message not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        repliedBy: req.user?._id,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate('repliedBy', 'name email');

    if (!contact) {
      res.status(404).json({ success: false, message: 'Contact message not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getContactInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    // This would typically come from a settings/config model
    // For now, return static contact information
    const contactInfo = {
      email: 'bitsaclub@ueab.ac.ke',
      president: {
        name: 'Gael Loise',
        phone: '0705567890',
      },
      vicePresident: {
        name: 'Shereen Njuguna',
        phone: '0748876579',
      },
    };
    res.status(200).json({
      success: true,
      data: contactInfo,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

