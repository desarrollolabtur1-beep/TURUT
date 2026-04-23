import { Request, Response } from 'express';
import { User, IUser } from '../models/User.model';
import { Experience } from '../models/Experience.model';

// ── Helper: construir respuesta de usuario consistente ───────────────────────
const buildUserResponse = (user: IUser) => ({
  _id: user._id.toString(),
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  isActive: user.isActive,
  profileImage: user.profileImage,
  bio: user.bio,
  visitedDestinations: user.visitedDestinations,
  // Datos demográficos
  city: user.city,
  phone: user.phone,
  birthDate: user.birthDate,
  gender: user.gender,
  // Preferencias de exploración
  preferences: user.preferences,
  // Necesidades especiales
  specialNeeds: user.specialNeeds,
  // Canal de adquisición
  acquisitionSource: user.acquisitionSource,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @desc    Get authenticated user's profile (with visited destinations)
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('visitedDestinations.destination', 'title location images category');

    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Update authenticated user's profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      bio,
      profileImage,
      // Nuevos campos demográficos
      city,
      phone,
      birthDate,
      gender,
      // Preferencias de exploración
      preferences,
      // Necesidades especiales
      specialNeeds,
      // Canal de adquisición
      acquisitionSource,
    } = req.body;

    // Build update object — only include provided fields
    const updateData: Record<string, any> = {};

    // ── Bio ──
    if (bio !== undefined) {
      const sanitized = String(bio).trim();
      if (sanitized.length > 300) {
        res.status(400).json({
          success: false,
          message: 'La bio no puede superar 300 caracteres',
        });
        return;
      }
      updateData.bio = sanitized;
    }

    // ── Profile Image ──
    if (profileImage !== undefined) {
      updateData.profileImage = String(profileImage).trim();
    }

    // ── Datos demográficos ──
    if (city !== undefined) {
      updateData.city = String(city).trim();
    }
    if (phone !== undefined) {
      updateData.phone = String(phone).trim();
    }
    if (birthDate !== undefined) {
      updateData.birthDate = birthDate ? new Date(birthDate) : null;
    }
    if (gender !== undefined) {
      updateData.gender = String(gender);
    }

    // ── Preferencias (objeto anidado — merge con las existentes) ──
    if (preferences !== undefined && typeof preferences === 'object') {
      const prefFields = [
        'experienceTypes', 'travelCompany', 'availableTime',
        'coffeeExperience', 'coffeeInterests', 'naturePreferences',
        'lodgingStyle', 'connectivityPreference', 'escapeTime',
      ];
      for (const field of prefFields) {
        if (preferences[field] !== undefined) {
          updateData[`preferences.${field}`] = preferences[field];
        }
      }
    }

    // ── Necesidades especiales ──
    if (specialNeeds !== undefined) {
      updateData.specialNeeds = specialNeeds;
    }

    // ── Canal de adquisición ──
    if (acquisitionSource !== undefined) {
      updateData.acquisitionSource = String(acquisitionSource);
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'Debes enviar al menos un campo para actualizar',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .populate('visitedDestinations.destination', 'title location images category');

    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      data: buildUserResponse(user),
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Mark a destination/experience as visited by the authenticated user
// @route   POST /api/experiences/:id/visit
// @access  Private
export const markDestinationVisited = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const experienceId = req.params.id;

    // Validate the experience exists and is active
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      res.status(404).json({
        success: false,
        message: 'Experiencia no encontrada',
      });
      return;
    }

    // Check for duplicates — prevent marking the same destination twice
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    const alreadyVisited = user.visitedDestinations.some(
      (v) => v.destination.toString() === experienceId
    );

    if (alreadyVisited) {
      res.status(400).json({
        success: false,
        message: 'Ya marcaste este destino como visitado',
      });
      return;
    }

    // Push the visited destination
    user.visitedDestinations.push({
      destination: experience._id as any,
      visitedAt: new Date(),
    });

    await user.save();

    // Re-fetch with populated data
    const updatedUser = await User.findById(req.userId)
      .select('-password')
      .populate('visitedDestinations.destination', 'title location images category');

    res.status(200).json({
      success: true,
      message: 'Destino marcado como visitado',
      data: updatedUser?.visitedDestinations ?? [],
    });
  } catch (error) {
    console.error('markDestinationVisited error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    TEMPORARY: Volver admin a un correo específico
// @route   GET /api/user/make-me-admin?email=tu-correo@ejemplo.com
// @access  Public
export const makeMeAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.query.email;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Falta el parámetro email en la URL' });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const userModel = require('../models/User.model').User;
    const user = await userModel.findOneAndUpdate({ email: email.trim().toLowerCase() }, { role: 'admin' }, { new: true });
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `¡Listo! El usuario ${user.email} ahora es administrador. Cierra sesión e inicia de nuevo en la app para ver el Panel.`,
      role: user.role
    });
  } catch (error) {
    console.error('makeMeAdmin error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};
