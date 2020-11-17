import { Module, HttpService, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { UtilisateurModule } from '../utilisateur/utilisateur.module';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { EmailValidatorModule } from '../validation/email/email-validator.module';
import { PasswordValidatorModule } from '../validation/password/password-validator.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { Repository } from 'typeorm';
import { MailModule } from '../mail/mail.module';
import { CryptoModule } from '../crypto/crypto.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([CUtilisateur]),
    ConfigModule,
    UtilisateurModule,
    PasswordValidatorModule,
    EmailValidatorModule,
    Repository,
    HttpModule,
    MailModule,
    CryptoModule,
  ],
  providers: [AuthService, AuthGuard, JwtStrategy, UtilisateurService, Repository, ...authProviders],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard]
})
export class AuthModule { }
