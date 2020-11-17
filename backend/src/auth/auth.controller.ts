import { BadRequestException, Body, Controller, Inject, Post, UseInterceptors, HttpService, Req, UnauthorizedException, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';

import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { AuthService } from './auth.service';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from './constants';
import { PasswordCryptographerService } from './password-cryptographer/password-cryptographer.interface';
import { EmailValidatorImpl } from '../validation/email/email-validator.component';
import { PasswordValidatorImpl } from '../validation/password/password-validator.component';
import { LoginDto, profils } from '@aleaac/shared';
import { Authorized } from '../common/decorators/authorized.decorator';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';
import { MailService } from '../mail/mail.service';
import { Mail } from '../mail/mail.entity';
import { AppProperties } from '../config/app-properties.model';
import { CONFIG_TOKEN } from '../config/constants';
import { CryptoService } from '../crypto/crypto';

@ApiUseTags('Utilisateurs')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'auth'))
export class AuthController {
    constructor(
        @Inject(CONFIG_TOKEN) private readonly config: AppProperties,
        private readonly userService: UtilisateurService,
        private readonly authService: AuthService,
        @Inject(PASSWORD_CRYPTOGRAPHER_TOKEN) private readonly passwordCryptographerService: PasswordCryptographerService,
        private readonly emailValidator: EmailValidatorImpl,
        private readonly passwordValidator: PasswordValidatorImpl,
        private readonly http: HttpService,
        private readonly mailService: MailService,
        private readonly cryptoService: CryptoService,
    ) {
    }

    @ApiOperation({ title: 'Reset mdp' })
    @ApiResponse({
        status: 200,
        description: 'Demande le reset du mdp.',
    })
    @Post('askReset')
    async askReset(@Body() requestBody: any, @Req() req) {
        let result: boolean;
        await this.http.post('https://www.google.com/recaptcha/api/siteverify?secret=6LcShykUAAAAAJZxH-Q4K3LEEKNRX3MYlfdzZdf5&response='
            + requestBody.captcha)
            .pipe(
                map(response => response.data)
            ).subscribe(data => {
                // console.log('Reset1');
                if (data.success) {
                    // console.log('Reset2');
                    this.userService.findOneByEmail(requestBody.email).then(user => {
                        // console.log('Reset3');
                        if (user) {
                            // console.log('Reset4');
                            user.tokenResetPassword = Guid.raw();
                            user.dateDemandeResetPassword = new Date();
                            user.ipResetPassword = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '')
                                                   .split(',')[0].trim();
                            delete user.profils;
                            delete user.franchisePrincipale;
                            this.userService.update(user.id, user);
                            // console.log('Reset4');

                            const email: Mail = new Mail();
                            email.from = 'notification@aleacontroles.com'
                            email.to = [user.login];
                            email.subject = 'Réinitialisation de votre mot de passe AléaContrôles';
                            email.template = 'reset-password';
                            // console.log('Reset5');

                            const data2: Map<string, string> = new Map<string, string>();
                            data2.set('civilite', user.civilite ? user.civilite.nom : '');
                            data2.set('nom', user.nom);
                            data2.set('prenom', user.prenom);
                            data2.set('urlResetLink', this.config.site.url + '/doResetPassword/' + user.tokenResetPassword);
                            // console.log('Reset6');

                            // On convertit en objet pour le transfer par POST, sinon ça envoie vide
                            const convMap = {};
                            data2.forEach((val: string, key: string) => {
                                convMap[key] = val;
                            });
                            email.dataList = convMap;
                            // console.log('données mail reset ok');
                            // console.log('Reset7');
                            this.mailService.sendMail(email).then(tutu => {
                                // console.log(tutu);
                                result = true;
                                // console.log('Reset8');
                            }, err => {
                                // console.error(err);
                                result = false;
                                // console.log('Reset9');
                            });
                        }
                    });
                } else {
                    result = false;
                    // console.log('Reset10');
                }
            });

        // console.log('Reset11');

        return await result;
    }

    @ApiOperation({ title: 'Reset mdp' })
    @ApiResponse({
        status: 200,
        description: 'Demande le reset du mdp.',
    })
    @Post('doReset')
    async doReset(@Body() requestBody: any, @Req() req) {
        let result = false;
        await this.userService.findOneByEmail(requestBody.email).then(user => {
            if (user) {
                // TODO : check 24h token
                if (requestBody.token != user.tokenResetPassword) {
                    throw new UnauthorizedException();
                }
                user.tokenResetPassword = null;
                user.dateDemandeResetPassword = null;
                user.dateResetPassword = new Date();
                user.ipResetPassword = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
                // console.log(requestBody.password);

                user.motDePasse = requestBody.password;
                this.userService.update(user.id, user);
                result = true;
            }
        });

        return await result;
    }

    @ApiOperation({ title: 'Reset mdp' })
    @ApiResponse({
        status: 200,
        description: 'Demande le reset du mdp.',
    })
    @Get('getHash')
    @Authorized([profils.DEV])
    getHash() {
        return this.cryptoService.set(this.toUTF8Array('3bb9ebfb-c70d-4b2c-be2d-cb7bd6b84997'),
        this.toUTF8Array('-----BEGIN RSA PRIVATE KEY-----\nMIICWwIBAAKBgQCuj5zXQaGtCgcCGl16Q8/t4ZaFzPkG2D61RRvWjOc+IMjdgStu\nyZGemOplLRZkomlrQ2mYIL31UrZM4srRLuRgfgWw6Xf9bfYXFeamz/SmIqVYaC7N\nn7CfvEgpTKQqVBgnRflClr9BvE4OtzZV5qlDV+jZZkG1uEgV/Fz+SNZv/QIDAQAB\nAoGAL3mfjmurLQStI0VIZxhKVMglx/4XPGVTqLlC+PcZbSw9dQDMbzUjBZ9RIHNC\nw9voD+Qls9ozz6TPL9n+jyXRtnmAwT0Zm2jXVEbBVBA/QDqFXiDPf49LUfrimz+A\nc/iv6AoFvXuHj4LluPOokfo0ZbNwZFkiCBa4bMmFOMyD5AECQQDbABO3R5AxX9hQ\neSYOZ5/c/ais7VBVoy6v86KYDNrSXF6fp/mk4owcJHD1tv7Xf9OO2I/QDhqHuHvP\nXbb1Fh6VAkEAzA2Auzm59J6POsa9oY+LpaHRMaNhRUzZShTIZg9yiQgRWr6QKlI1\ntIoxYlZasjrnK4+3S6dovLusiDMuQPR5yQJAOLo8YS1YXHHHRpEbGoAdGNFb7+9I\n7+XlIg6p/1jVFch3ekO4ls1YHbIS0JMmUAv8cPQHzIzasm1HJN/RlIq2QQJAI8S6\nLBeSYS7qLINp+kgPUplq8iiRhHRUIohCGKHckei4IhAFdWWzxFH1FifM/jEVFK28\nk6Zk1bCQLc/K69fvAQJAN0/ZMt/9b/hwX9d43zPsDwds5qoDS/9ytCf4yEgwt6Ib\nOHE/FsPrvC3feH23AcAlZyls4Gs4hXw8LgmPmLT51g==\n-----END RSA PRIVATE KEY-----'));
    }

    toUTF8Array(str) {
        let utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) { utf8.push(charcode); }
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                          0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                          0x80 | ((charcode >> 6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            } else {
                i++;
                charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
                utf8.push(0xf0 | (charcode >> 18),
                          0x80 | ((charcode >> 12) & 0x3f),
                          0x80 | ((charcode >> 6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    @ApiOperation({ title: 'Impersonate' })
    @ApiResponse({
        status: 200,
        description: 'Credentials are ok, returning JWT.'
    })
    @ApiResponse({ status: 400, description: 'Email ou mot de passe invalide.' })
    @Authorized([profils.ADMIN, profils.SUPER_ADMIN])
    @Post('impersonate')
    async impersonate(@Body() req: LoginDto) {
        // console.log(req);
        const emailValidation = await this.emailValidator.validateEmail(req.login);
        if (!emailValidation.isValid) {
            throw new BadRequestException('Email invalide.');
        }

        const user = await this.userService.findOneByEmail(req.login, true);
        // console.log(user);

        const token = this.authService.createToken(classToPlain(user));
        return {
            user,
            token
        };
    }

    @ApiOperation({ title: 'Authorize' })
    @ApiResponse({
        status: 200,
        description: 'Credentials are ok, returning JWT.'
    })
    @ApiResponse({ status: 400, description: 'Email ou mot de passe invalide.' })
    @Post()
    async login(@Body() req: LoginDto) {
        const emailValidation = await this.emailValidator.validateEmail(req.login);
        if (!emailValidation.isValid) {
            throw new BadRequestException('Email invalide.');
        }
        const passwordValidation = await this.passwordValidator.validatePassword(req.motDePasse);
        if (!passwordValidation.isValid) {
            throw new BadRequestException('Mot de passe invalide.');
        }

        const user = await this.userService.findOneByEmail(req.login, true);

        // if (!user || !await this.passwordCryptographerService.doCompare(req.motDePasse, user.motDePasse)) {
        if (!user || !await this.passwordCryptographerService.doCompare(req.motDePasse, user.motDePasse)) {
            throw new BadRequestException('Email ou mot de passe invalide.');
        }

        if (user.isSuspendu) {
            // console.log('suspendu');
            throw new BadRequestException('Utilisateur désactivé.');
        }

        const token = this.authService.createToken(classToPlain(user));
        // console.log(token);
        return {
            user,
            token
        };
    }
}
