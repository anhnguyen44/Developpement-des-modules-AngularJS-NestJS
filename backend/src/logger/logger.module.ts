import {Module} from '@nestjs/common';

import {Log} from './logger';

@Module({
  providers: [Log],
  exports: [Log]
})
export class LoggerModule {}
