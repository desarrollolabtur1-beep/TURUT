import { Request, Response } from 'express';
import { Experience } from '../models/Experience.model';

// @desc    Get all active experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experiences = await Experience.find({ isActive: true })
      .populate('createdBy', 'firstName lastName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    console.error('getExperiences error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Get featured experiences (top 5)
// @route   GET /api/experiences/featured
// @access  Public
export const getFeaturedExperiences = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const experiences = await Experience.find({ isActive: true, isFeatured: true })
      .populate('createdBy', 'firstName lastName email')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    console.error('getFeaturedExperiences error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Get experiences created by the logged-in user
// @route   GET /api/experiences/my-experiences
// @access  Private
export const getMyExperiences = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experiences = await Experience.find({ createdBy: req.userId! })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    console.error('getMyExperiences error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Get single experience by ID
// @route   GET /api/experiences/:id
// @access  Public
export const getExperienceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!experience) {
      res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error('getExperienceById error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Create experience
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      location,
      price,
      duration,
      category,
      images,
      availableDates,
      maxParticipants,
    } = req.body;

    if (!title || !description || !location || price == null || !duration || !category) {
      res.status(400).json({
        success: false,
        message: 'Por favor proporciona todos los campos obligatorios',
      });
      return;
    }

    const experience = await Experience.create({
      title,
      description,
      location,
      price,
      duration,
      category,
      images: images ?? [],
      availableDates: availableDates ?? [],
      maxParticipants: maxParticipants ?? 10,
      createdBy: req.userId!,
    });

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error('createExperience error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
export const updateExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
      });
      return;
    }

    // Only the creator or an admin can update
    if (experience.createdBy.toString() !== req.userId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta experiencia',
      });
      return;
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedExperience,
    });
  } catch (error) {
    console.error('updateExperience error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
export const deleteExperience = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
      });
      return;
    }

    // Only the creator or an admin can delete
    if (experience.createdBy.toString() !== req.userId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta experiencia',
      });
      return;
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Experiencia eliminada',
    });
  } catch (error) {
    console.error('deleteExperience error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};