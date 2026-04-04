import { Request, Response } from 'express';
import { Booking } from '../models/Booking.model';
import { Experience } from '../models/Experience.model';

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find({ user: req.userId! })
      .populate('experience', 'title location price duration images')
      .populate('user', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('getMyBookings error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('experience', 'title location price duration images')
      .populate('user', 'firstName lastName email');

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Reserva no encontrada',
      });
      return;
    }

    // Only the booking owner or an admin can view it
    if (booking.user._id.toString() !== req.userId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta reserva',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('getBookingById error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      experience,
      bookingDate,
      participants,
      totalPrice,
      specialRequests,
      paymentId,
    } = req.body;

    // Validate required fields
    if (!experience || !bookingDate || !participants || totalPrice == null) {
      res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben proporcionarse',
      });
      return;
    }

    // Verify experience exists and is active
    const exp = await Experience.findById(experience);
    if (!exp) {
      res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
      });
      return;
    }

    if (!exp.isActive) {
      res.status(400).json({
        success: false,
        message: 'Esta experiencia no está disponible',
      });
      return;
    }

    // Check date availability
    const bookingDateObj = new Date(bookingDate);
    const isAvailable = exp.availableDates.some(
      (date) => new Date(date).toDateString() === bookingDateObj.toDateString()
    );

    if (!isAvailable) {
      res.status(400).json({
        success: false,
        message: 'La fecha seleccionada no está disponible para esta experiencia',
      });
      return;
    }

    // Check capacity
    const existingBookings = await Booking.countDocuments({
      experience,
      bookingDate: bookingDateObj,
      status: { $in: ['confirmed', 'pending'] },
    });

    if (existingBookings + participants > exp.maxParticipants) {
      res.status(400).json({
        success: false,
        message: 'No hay suficiente capacidad para la fecha seleccionada',
      });
      return;
    }

    // Create booking
    const booking = await Booking.create({
      user: req.userId!,
      experience,
      bookingDate: bookingDateObj,
      participants,
      totalPrice,
      specialRequests,
      paymentId,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Update booking (status & special requests only)
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('experience', 'title location price');

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Reserva no encontrada',
      });
      return;
    }

    // Only the booking owner can update
    if (booking.user._id.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta reserva',
      });
      return;
    }

    // Only allow updating certain fields
    const allowedUpdates = ['status', 'specialRequests'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((u) => allowedUpdates.includes(u));

    if (!isValidOperation) {
      res.status(400).json({
        success: false,
        message: 'Solo puedes actualizar el estado y las notas especiales',
      });
      return;
    }

    updates.forEach((update) => {
      (booking as any)[update] = req.body[update];
    });

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('updateBooking error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Cancel booking (soft delete)
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Reserva no encontrada',
      });
      return;
    }

    // Only the booking owner can cancel
    if (booking.user.toString() !== req.userId) {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para cancelar esta reserva',
      });
      return;
    }

    if (booking.status === 'completed') {
      res.status(400).json({
        success: false,
        message: 'No puedes cancelar una reserva completada',
      });
      return;
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Reserva cancelada',
    });
  } catch (error) {
    console.error('deleteBooking error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};