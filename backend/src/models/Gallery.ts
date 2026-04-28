import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGallery extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  images: string[];
  event: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

export default mongoose.model<IGallery>('Gallery', gallerySchema);

