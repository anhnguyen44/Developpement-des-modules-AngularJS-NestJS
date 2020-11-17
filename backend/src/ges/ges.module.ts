import { Module } from '@nestjs/common';
import { GESController } from './ges.controller';
import { GESService } from './ges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GES } from './ges.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([GES])
    ],
    controllers: [GESController],
    providers: [GESService],
    exports: [GESService]
})
export class GESModule { }
