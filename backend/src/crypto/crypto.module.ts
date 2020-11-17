import {Module} from '@nestjs/common';

import {CryptoService} from './crypto';

@Module({
  providers: [CryptoService],
  exports: [CryptoService]
})
export class CryptoModule {}
