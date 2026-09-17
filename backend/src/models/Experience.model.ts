import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';
import { CloudinaryAsset } from '../config/cloudinary';

export interface ImageAsset extends CloudinaryAsset {}

export interface IExperience extends Document {
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number; // in hours
  category: string;
  images: ImageAsset[];
  availableDates: Date[];
  maxParticipants: number;
  isActive: boolean;
  isFeatured: boolean; // "Destinos Destacados" — top 5
  createdBy: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const ImageAssetSchema = new Schema({
  public_id: { type: String, required: true },
  secure_url: { type: String, required: true },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  blurhash: { type: String },
});

const ExperienceSchema = new Schema<IExperience>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 hour'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    images: {
      type: [ImageAssetSchema],
      validate: {
        validator: (arr: unknown[]) => arr.length > 0,
        message: 'At least one image is required',
      },
    },
    availableDates: {
      type: [Date],
      required: [true, 'Available dates are required'],
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: [1, 'Max participants must be at least 1'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Experience = model<IExperience>('Experience', ExperienceSchema);
