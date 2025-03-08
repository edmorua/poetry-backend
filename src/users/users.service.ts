import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  // 🔹 Create User for Firebase Authentication
  async createFirebaseUser(
    firebaseUid: string,
    email: string,
    nickname: string,
    realName: string,
  ): Promise<User> {
    const user = this.userRepo.create({
      firebaseUid,
      email,
      nickname,
      realName,
      shareRealName: false, // Default to private
    });
    return this.userRepo.save(user);
  }

  // 🔹 Create User for Local Authentication (Email/Password)
  async createLocalUser(
    email: string,
    password: string,
    nickname: string,
    realName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      nickname,
      realName,
      shareRealName: false, // Default to private
    });
    return this.userRepo.save(user);
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { firebaseUid } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? user : null;
  }

  async updateUserPrivacy(
    firebaseUid: string,
    shareRealName: boolean,
  ): Promise<User> {
    const user = await this.findByFirebaseUid(firebaseUid);
    if (!user) throw new Error('User not found');

    user.shareRealName = shareRealName;
    return this.userRepo.save(user);
  }
}
