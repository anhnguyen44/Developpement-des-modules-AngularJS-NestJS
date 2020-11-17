import {Module} from '@nestjs/common';
import {TarifDetailController} from './tarif-detail.controller';
import {TarifDetailService} from './tarif-detail.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TarifDetail} from './tarif-detail.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TarifDetail])
    ],
    controllers: [TarifDetailController],
    providers: [TarifDetailService],
    exports: [TarifDetailService],
})
export class TarifDetailModule {}
