import {Module} from '@nestjs/common';

import {TypeOrmModule} from '@nestjs/typeorm';
import {CodePostal} from './code-postal.entity';
import {CodePostalController} from './code-postal.controller';
import {CodePostalService} from './code-postal.service';
import {Adresse} from '../adresse/adresse.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CodePostal, Adresse])
    ],
    controllers: [CodePostalController],
    providers: [CodePostalService],
    exports: [CodePostalService]
})
export class CodePostalModule {}
