import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Prelevement} from './prelevement.entity';
import {PrelevementController} from './prelevement.controller';
import {PrelevementService} from './prelevement.service';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Prelevement])
    ],
    controllers: [PrelevementController],
    providers: [PrelevementService],
    exports: [PrelevementService]
})
export class PrelevementModule {}
