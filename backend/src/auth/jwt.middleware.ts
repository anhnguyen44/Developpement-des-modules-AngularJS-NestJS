import {MiddlewareFunction, Injectable, NestMiddleware} from '@nestjs/common';
import * as passport from 'passport';

interface Route {
  excludedPath: string;
  method: string;
}

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  async resolve(): Promise<MiddlewareFunction > {
    return async (req, res, next) => {
      passport.authenticate('jwt', {session: false}, (err, utilisateur, info) => {
        if (err) {
          return next(err);
        }
        if (utilisateur) {
          req.user = utilisateur;
        }
        return next();
      })(req, res, next);
    };
  }
}
