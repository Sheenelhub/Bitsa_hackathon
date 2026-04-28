import { Request, Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { published, upcoming, page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (published !== undefined) query.published = published === 'true';

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email avatar')
      .populate('registeredUsers', 'name email')
      .sort({ date: 1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      data: events,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar')
      .populate('registeredUsers', 'name email');

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user?._id,
    });

    await event.populate('organizer', 'name email avatar');

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to update this event' });
      return;
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('organizer', 'name email avatar');

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
      return;
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (!event.registrationRequired) {
      res.status(400).json({ success: false, message: 'Event does not require registration' });
      return;
    }

    const currentUserId = req.user!._id.toString();

    if (event.registeredUsers.some((registeredUserId) => registeredUserId.toString() === currentUserId)) {
      res.status(400).json({ success: false, message: 'Already registered for this event' });
      return;
    }

    if (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants) {
      res.status(400).json({ success: false, message: 'Event is full' });
      return;
    }

    event.registeredUsers.push(req.user!._id);
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Registered for event successfully',
      data: event,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

