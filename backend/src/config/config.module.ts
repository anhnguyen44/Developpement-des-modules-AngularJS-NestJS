import {Module} from '@nestjs/common';

import {configProviders} from './config.providers';
import {ConfigService} from './config.service';

@Module({
  providers: [...configProviders, ConfigService],
  exports: [...configProviders, ConfigService]
})
export class ConfigModule {}
