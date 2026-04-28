import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  image?: string;
  category: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  registeredUsers: mongoose.Types.ObjectId[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an event date'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    registrationRequired: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
    },
    registeredUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEvent>('Event', eventSchema);

