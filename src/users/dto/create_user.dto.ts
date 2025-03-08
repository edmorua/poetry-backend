import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional() // 🔹 Allows `password` to be undefined without causing validation errors
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  nickname: string;

  @IsString()
  realName: string;
}
