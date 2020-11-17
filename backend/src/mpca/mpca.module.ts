import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {Mpca} from './mpca.entity';
import {MpcaController} from './mpca.controller';
import {MpcaService} from './mpca.service';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Mpca])
    ],
    controllers: [MpcaController],
    providers: [MpcaService],
    exports: [MpcaService]
})
export class MpcaModule {}
