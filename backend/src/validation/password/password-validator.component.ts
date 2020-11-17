import {PasswordValidator} from '@aleaac/shared';
import {Injectable} from '@nestjs/common';

@Injectable()
export class PasswordValidatorImpl extends PasswordValidator {
  constructor() {
    super();
  }
}
