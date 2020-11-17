import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TravailHumide} from './travail-humide.entity';
import {TravailHumideController} from './travail-humide.controller';
import {TravailHumideService} from './travail-humide.service';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([TravailHumide])
    ],
    controllers: [TravailHumideController],
    providers: [TravailHumideService],
    exports: [TravailHumideService]
})
export class TravailHumideModule {}
