import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeFacturationController } from './type-facturation.controller';
import { TypeFacturation } from './type-facturation.entity';
import { TypeFacturationService } from './type-facturation.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TypeFacturation])
    ],
    controllers: [TypeFacturationController],
    providers: [TypeFacturationService],
    exports: [TypeFacturationService],
})
export class TypeFacturationModule { }
