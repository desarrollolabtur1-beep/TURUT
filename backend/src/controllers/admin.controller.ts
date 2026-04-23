import { Request, Response } from 'express';
import { User } from '../models/User.model';

// @desc    Get all users with their profile analytics data
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('visitedDestinations.destination', 'title location category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map((user) => ({
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        // Datos demográficos
        city: user.city,
        birthDate: user.birthDate,
        gender: user.gender,
        // Preferencias
        preferences: user.preferences,
        // Necesidades especiales
        specialNeeds: user.specialNeeds,
        // Canal de adquisición
        acquisitionSource: user.acquisitionSource,
        // Actividad
        visitedDestinations: user.visitedDestinations,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// @desc    Get aggregated analytics summary
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalyticsSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    const totalUsers = users.length;

    // Contar distribución de cada campo
    const countField = (values: string[]) => {
      const counts: Record<string, number> = {};
      for (const v of values) {
        if (v && v.length > 0) {
          counts[v] = (counts[v] || 0) + 1;
        }
      }
      return counts;
    };

    const countArrayField = (arrays: string[][]) => {
      const counts: Record<string, number> = {};
      for (const arr of arrays) {
        for (const v of arr) {
          if (v && v.length > 0) {
            counts[v] = (counts[v] || 0) + 1;
          }
        }
      }
      return counts;
    };

    // Perfiles completados (al menos city, 1 preference, y acquisitionSource)
    const completedProfiles = users.filter(
      (u) =>
        u.city &&
        u.preferences?.experienceTypes?.length > 0 &&
        u.acquisitionSource
    ).length;

    const analytics = {
      totalUsers,
      completedProfiles,
      completionRate: totalUsers > 0 ? Math.round((completedProfiles / totalUsers) * 100) : 0,

      // Demografía
      cities: countField(users.map((u) => u.city)),
      genders: countField(users.map((u) => u.gender)),

      // Preferencias
      experienceTypes: countArrayField(users.map((u) => u.preferences?.experienceTypes ?? [])),
      travelCompany: countField(users.map((u) => u.preferences?.travelCompany ?? '')),
      availableTime: countField(users.map((u) => u.preferences?.availableTime ?? '')),
      coffeeExperience: countField(users.map((u) => u.preferences?.coffeeExperience ?? '')),
      coffeeInterests: countArrayField(users.map((u) => u.preferences?.coffeeInterests ?? [])),
      naturePreferences: countArrayField(users.map((u) => u.preferences?.naturePreferences ?? [])),
      lodgingStyle: countField(users.map((u) => u.preferences?.lodgingStyle ?? '')),
      connectivityPreference: countField(users.map((u) => u.preferences?.connectivityPreference ?? '')),
      escapeTime: countField(users.map((u) => u.preferences?.escapeTime ?? '')),

      // Necesidades especiales
      specialNeeds: countArrayField(users.map((u) => u.specialNeeds ?? [])),

      // Adquisición
      acquisitionSources: countField(users.map((u) => u.acquisitionSource ?? '')),
    };

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('getAnalyticsSummary error:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};
