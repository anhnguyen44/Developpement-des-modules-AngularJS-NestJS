import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller, Delete, FilesInterceptor,
    Get,
    Param,
    Post, Put, Res, UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { TypeFichierGroupeService } from './type-fichier-groupe.service';
import { Authorized } from '../common/decorators/authorized.decorator';
import { TypeFichierGroupe } from './type-fichier-groupe.entity';
import { readFile, readFileSync } from 'fs'

@ApiUseTags('type-fichier-groupe')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-fichier-groupe'))
export class TypeFichierGroupeController {

    constructor(private fichierService: TypeFichierGroupeService) { }

    @ApiOperation({ title: 'Creation d\'un typeFichier' })
    @Post()
    @Authorized()
    async create(@Body() requestBody: TypeFichierGroupe) {
        return await this.fichierService.create(requestBody);
    }

    @ApiOperation({ title: 'Update d\'un typeFichier' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: TypeFichierGroupe) {
        return await this.fichierService.update(requestBody);
    }

    @ApiOperation({ title: 'Récupération type fichier' })
    @Get()
    @Authorized()
    async getAll(@Body() requestBody: TypeFichierGroupe) {
        return await this.fichierService.getAll();
    }
}