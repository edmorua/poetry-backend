import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('No Firebase token provided');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
