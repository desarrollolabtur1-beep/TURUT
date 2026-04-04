import { Schema, model, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IBooking extends Document {
  user: Types.ObjectId; // Reference to User
  experience: Types.ObjectId; // Reference to Experience
  bookingDate: Date;
  participants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    experience: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    participants: {
      type: Number,
      required: [true, 'Participants is required'],
      min: [1, 'Participants must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price must be positive'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    paymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
BookingSchema.index({ user: 1, experience: 1 });
BookingSchema.index({ bookingDate: 1 });
BookingSchema.index({ status: 1 });

export const Booking = model<IBooking>('Booking', BookingSchema);
