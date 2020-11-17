import {createParamDecorator} from '@nestjs/common';
import {plainToClass} from 'class-transformer';

import {Franchise} from './franchise.entity';

export const CurrentFranchise = createParamDecorator((data, req) => {
  return plainToClass(Franchise, req.user.franchise.first());
});
