import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CaptageAspirationSource} from './captage-aspiration-source.entity';
import {CaptageAspirationSourceController} from './captage-aspiration-source.controller';
import {CaptageAspirationSourceService} from './captage-aspiration-source.service';


@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([CaptageAspirationSource])
    ],
    controllers: [CaptageAspirationSourceController],
    providers: [CaptageAspirationSourceService],
    exports: [CaptageAspirationSourceService]
})
export class CaptageAspirationSourceModule {}
