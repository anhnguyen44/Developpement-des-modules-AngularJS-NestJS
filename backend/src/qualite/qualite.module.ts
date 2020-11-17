import {Module} from '@nestjs/common';
import {QualiteController} from './qualite.controller';
import {QualiteService} from './qualite.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Qualite} from './qualite.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Qualite])
    ],
    controllers: [QualiteController],
    providers: [QualiteService],
    exports: [QualiteService],
})
export class QualiteModule {}
