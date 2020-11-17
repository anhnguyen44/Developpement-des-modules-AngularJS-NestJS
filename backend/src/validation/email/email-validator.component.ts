import {EmailValidator} from '@aleaac/shared';
import {Injectable} from '@nestjs/common';

@Injectable()
export class EmailValidatorImpl extends EmailValidator {
  constructor() {
    super();
  }
}
