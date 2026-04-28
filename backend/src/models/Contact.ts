import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IContact extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  repliedBy?: mongoose.Types.ObjectId;
  reply?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'replied'],
      default: 'pending',
    },
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reply: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContact>('Contact', contactSchema);

