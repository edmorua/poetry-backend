import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

// ✅ Custom Request Type with `user` property
interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('No Firebase token provided');
    }

    try {
      // ✅ Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // ✅ TypeScript now recognizes `req.user`
      next();
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
