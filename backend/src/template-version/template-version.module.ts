import { Module } from '@nestjs/common';
import { TemplateVersionController } from './template-version.controller';
import { TemplateVersionService } from './template-version.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateVersion } from './template-version.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TemplateVersion])
    ],
    controllers: [TemplateVersionController],
    providers: [TemplateVersionService],
    exports: [TemplateVersionService]
})
export class TemplateVersionModule { }
