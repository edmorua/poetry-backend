import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase-login')
  async loginWithFirebase(@Body() body: { idToken: string }) {
    return this.authService.validateFirebaseUser(body.idToken);
  }

  @Post('firebase-register')
  async registerWithGoogle(
    @Body() body: { idToken: string; name: string; nickname?: string },
  ) {
    return this.authService.registerWithGoogle(
      body.idToken,
      body.name,
      body.nickname,
    );
  }

  @Post('register')
  async registerLocal(@Body() body: RegisterDto) {
    return this.authService.registerLocalUser(body);
  }

  @Post('login')
  async loginLocal(@Body() body: LoginDto) {
    const user = await this.authService.validateLocalUser(body);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
}
