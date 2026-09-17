import { Request, Response } from 'express';
import { signUploadParams } from '../config/cloudinary';

// @desc    Obtener firma para subida directa a Cloudinary
// @route   POST /api/uploads/signature
// @access  Private
export const getUploadSignature = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const folder = (req.body.folder as string) || 'turut';
    const signature = signUploadParams(folder);

    res.status(200).json({
      success: true,
      data: signature,
    });
  } catch (error) {
    console.error('getUploadSignature error:', error);
    res.status(500).json({ success: false, message: 'Error al generar firma' });
  }
};
