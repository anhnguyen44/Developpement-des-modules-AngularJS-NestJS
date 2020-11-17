import {createParamDecorator} from '@nestjs/common';
import {plainToClass} from 'class-transformer';

import {CUtilisateur} from './utilisateur.entity';

export const CurrentUtilisateur = createParamDecorator((data, req) => {
  const result =  plainToClass(CUtilisateur, req.user);
  return result;
});
