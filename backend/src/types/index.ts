// Express Request type augmentation
// Adds user and userId to all Express Request objects

import { IUser } from '../models/User.model';

declare module 'express-serve-static-core' {
  interface Request {
    /** The authenticated user document (populated by auth middleware) */
    user?: IUser;
    /** The authenticated user's ID string (populated by auth middleware) */
    userId?: string;
  }
}

export {};
