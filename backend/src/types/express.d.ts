// This file must be imported early to augment Express Request types.
// Import this in server.ts before anything else.

import { IUser } from '../models/User.model';

declare module 'express-serve-static-core' {
  interface Request {
    /** The authenticated user document (populated by auth middleware) */
    user?: IUser;
    /** The authenticated user's ID string (populated by auth middleware) */
    userId?: string;
  }
}
