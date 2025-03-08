import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Get user by email (for testing)
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  // 🔹 Update user privacy settings
  @Put(':firebaseUid/privacy')
  async updatePrivacy(
    @Param('firebaseUid') firebaseUid: string,
    @Body() body: { shareRealName: boolean },
  ) {
    return this.usersService.updateUserPrivacy(firebaseUid, body.shareRealName);
  }
}
