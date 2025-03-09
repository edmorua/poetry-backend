import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  constructor(private readonly userService: UsersService) {
    this.jwtSecret = process.env.JWT_SECRET!;
  }

  // firebase authentication
  async validateFirebaseUser(idToken: string) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      let user = await this.userService.findByFirebaseUid(decodedToken.uid);
      if (!user) {
        user = await this.userService.createFirebaseUser(
          decodedToken.uid,
          decodedToken.email!,
          decodedToken.name || 'unknown',
          decodedToken.nickname || 'Default NickName',
        );
      }
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Firebase Auth Error: ${error.message}`);
      } else {
        Logger.error('Unknown error in Firebase authentication');
      }
    }
  }

  async registerLocalUser(newUser: RegisterDto) {
    const existingUser = await this.userService.findByEmail(newUser.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    return this.userService.createLocalUser(
      newUser.email,
      newUser.password,
      newUser.nickname,
      newUser.realName,
    );
  }

  async validateLocalUser(userToValidate: LoginDto) {
    const user = await this.userService.findByEmail(userToValidate.email);
    if (!user) return null;
    const token = jwt.sign({ id: user.id, email: user.email }, this.jwtSecret, {
      expiresIn: '1h',
    });
    return { token, user };
  }

  async registerWithGoogle(idToken: string, name: string, nickname?: string) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      let user = await this.userService.findByFirebaseUid(decodedToken.uid);
      if (!user) {
        user = await this.userService.createFirebaseUser(
          decodedToken.uid,
          decodedToken.email!,
          name,
          nickname || 'Anonymous Writer',
        );
      }
      return user;
    } catch (error: unknown) {
      if (error instanceof Error) {
        Logger.error(`Firebase Auth Error: ${error.message}`);
      } else {
        Logger.error('Unknown error in Firebase authentication');
      }
    }
  }
}
