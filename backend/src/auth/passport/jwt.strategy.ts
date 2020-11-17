import * as passport from 'passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable, Inject, UnauthorizedException} from '@nestjs/common';

import {AuthService} from '../auth.service';
import {AppProperties} from '../../config/app-properties.model';
import {CONFIG_TOKEN} from '../../config/constants';

@Injectable()
export class JwtStrategy extends Strategy {
  constructor(private readonly authService: AuthService, @Inject(CONFIG_TOKEN) config: AppProperties) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: config.token.secret,
      },
      async (req, payload, next) => await this.verify(req, payload, next)
    );
    passport.use(this);
  }

  async verify(req, payload, done) {
    const isValid = await this.authService.validateUtilisateur(payload);
    if (!isValid) {
      return done('Unauthorized', false);
    }

    done(null, payload);
  }
}
