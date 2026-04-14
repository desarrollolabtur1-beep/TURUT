import { Request, Response } from 'express';
import { User } from '../models/User.model';
import jwt from 'jsonwebtoken';
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
