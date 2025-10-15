import mongoose, { Document, Schema } from 'mongoose';

// Podcast interface
export interface IPodcast extends Document {
  title: string;
  description: string;
  author: string;
  category?: string;
  imageFileId?: mongoose.Types.ObjectId;
  audioFileId: mongoose.Types.ObjectId;
  duration?: number; // in seconds
  fileSize?: number; // in bytes
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Podcast schema
const PodcastSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a podcast title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    imageFileId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    audioFileId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide an audio file'],
    },
    duration: {
      type: Number,
      default: 0,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPodcast>('Podcast', PodcastSchema);
