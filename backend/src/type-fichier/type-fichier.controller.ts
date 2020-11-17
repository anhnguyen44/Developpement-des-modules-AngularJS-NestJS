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
import { TypeFichierService } from './type-fichier.service';
import { Authorized } from '../common/decorators/authorized.decorator';
import { TypeFichier } from './type-fichier.entity';
import { readFile, readFileSync } from 'fs'

@ApiUseTags('type-fichier')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-fichier'))
export class TypeFichierController {

    constructor(private fichierService: TypeFichierService) { }

    @ApiOperation({ title: 'Creation d\'un typeFichier' })
    @Post()
    @Authorized()
    async create(@Body() requestBody: TypeFichier) {
        return await this.fichierService.create(requestBody);
    }

    @ApiOperation({ title: 'Update d\'un typeFichier' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: TypeFichier) {
        return await this.fichierService.update(requestBody);
    }

    @ApiOperation({ title: 'Récupération type fichier' })
    @Get('affectable-by-groupe/:id')
    @Authorized()
    async getAffectableParGroupe(@Param('id') id) {
        return await this.fichierService.getAllAffectable(id);
    }
    @ApiOperation({ title: 'Récupération type fichier par nom' })
    @Get(':id')
    @Authorized()
    async get(@Param() params): Promise<TypeFichier> {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log(params);
        const res = await this.fichierService.get(Number.parseInt(params.id));
        console.log(res);
        return res;
    }

    @ApiOperation({ title: 'Récupération type fichier' })
    @Get()
    @Authorized()
    async getAll() {
        return await this.fichierService.getAll();
    }

    /* Old méthod
    @ApiOperation({title: 'Récupération type fichier par nom'})
    @Get(':id')
    @Authorized()
    async get(@Param() params) {
        return await this.fichierService.get(params.id);
    }
    */

}