import {createParamDecorator} from '@nestjs/common';
import {plainToClass} from 'class-transformer';

import {Profil} from './profil.entity';

export const CurrentProfil = createParamDecorator((data, req) => {
  return plainToClass(Profil, req.user.profil.first());
});
