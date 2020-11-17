import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller, Delete, FilesInterceptor,
    Get,
    Param,
    Post, Put, Res, UploadedFiles,
    UseInterceptors,
    ParseIntPipe,
    Req
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {DomaineCompetenceService} from './domaine-competence.service';
import {Authorized} from '../common/decorators/authorized.decorator';
import { CDomaineCompetence } from './domaine-competence.entity';
import {readFile, readFileSync} from 'fs'

@ApiUseTags('domaine-competence')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'domaine-competence'))
export class DomaineCompetenceController {

    constructor(private domaineCompetenceService: DomaineCompetenceService) {}

    @ApiOperation({title: 'Creation d\'une competence'})
    @Post()
    @Authorized()
    async create( @Body() requestBody: CDomaineCompetence) {
        return await this.domaineCompetenceService.create(requestBody);
    }

    @ApiOperation({title: 'Update d\'un typeFormation'})
    @Put()
    @Authorized()
    async update( @Body() requestBody: CDomaineCompetence) {
        return await this.domaineCompetenceService.update(requestBody);
    }

    @ApiOperation({title: 'Récupération type formation'})
    @Get('affectable-by-groupe/:id')
    @Authorized()
    async getAffectableParGroupe(@Param('id') id) {
        return await this.domaineCompetenceService.getAllAffectable(id);
    }

    @ApiOperation({title: 'Récupération competences'})
    @Get()
    @Authorized()
    async getAll(@Req() req) {
        return await this.domaineCompetenceService.getAll(req.query);
    }

    @ApiOperation({title: 'Récupération type formation par nom'})
    @Get(':id')
    @Authorized()
    async get(@Param() params) {
        return await this.domaineCompetenceService.get(params.id);
    }

    @Delete(':id')
    @Authorized()
    async supprimer(
        @Param('id', new ParseIntPipe())
        id: number,
        @Req() request
    ) {
        return this.domaineCompetenceService.supprimer(id);
    }
    
}