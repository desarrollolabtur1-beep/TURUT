import { Request, Response } from 'express';
import { User } from '../models/User.model';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
      });
      return;
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta con este email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios',
      });
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
};

// Generate JWT
const generateToken = (id: string): string => {
  const expiresInSeconds = 7 * 24 * 60 * 60; // 7 days
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: expiresInSeconds,
  });
};

// @desc    Request password reset (generates 6-digit code)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'El email es obligatorio',
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      // No revelar si el email existe o no (seguridad)
      res.status(200).json({
        success: true,
        message: 'Si el email está registrado, recibirás un código de recuperación.',
      });
      return;
    }

    // Generar código de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash del código antes de almacenarlo
    const hashedCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    user.resetPasswordToken = hashedCode;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    await user.save({ validateBeforeSave: false });

    // TODO: En producción, enviar el código por email.
    // Por ahora, lo devolvemos en la respuesta para desarrollo.
    console.log(`🔑 Reset code for ${email}: ${resetCode}`);

    res.status(200).json({
      success: true,
      message: 'Si el email está registrado, recibirás un código de recuperación.',
      // ⚠️ Solo para desarrollo — remover en producción
      ...(env.NODE_ENV === 'development' && { devCode: resetCode }),
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
};

// @desc    Reset password with code
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Email, código y nueva contraseña son obligatorios',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
      return;
    }

    // Hash del código recibido para comparar
    const hashedCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordToken: hashedCode,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Código inválido o expirado',
      });
      return;
    }

    // Actualizar contraseña y limpiar token
    user.password = newPassword;
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
      data: {
        _id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
    });
  }
};
