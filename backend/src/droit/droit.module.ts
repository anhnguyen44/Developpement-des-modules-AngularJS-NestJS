import {Module} from '@nestjs/common';
import {DroitController} from './droit.controller';
import {DroitService} from './droit.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Droit} from './droit.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Droit])
    ],
    controllers: [DroitController],
    providers: [DroitService],
    exports: [DroitService],
})
export class DroitModule {}
