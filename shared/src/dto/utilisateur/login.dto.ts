import {IsString, IsEmail} from 'class-validator';

export class LoginDto {
  @IsEmail()
  login: string;

  @IsString()
  motDePasse: string;
}
