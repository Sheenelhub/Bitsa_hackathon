import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBlogPost extends Document {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: 'article' | 'announcement' | 'update';
  featuredImage?: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['article', 'announcement', 'update'],
      required: true,
    },
    featuredImage: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

