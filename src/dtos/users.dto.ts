import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { IsPassword } from '@dtos/my-validators/password.validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsPassword()
  public password: string;

  @IsString()
  public nickname: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
