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
import {TypeFormationService} from './type-formation.service';
import {Authorized} from '../common/decorators/authorized.decorator';
import { TypeFormation } from './type-formation.entity';
import {readFile, readFileSync} from 'fs'

@ApiUseTags('type-formation')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-formation'))
export class TypeFormationController {

    constructor(private typeFormationService: TypeFormationService) {}

    @ApiOperation({title: 'Creation d\'un typeFormation'})
    @Post()
    @Authorized()
    async create( @Body() requestBody: TypeFormation) {
        return await this.typeFormationService.create(requestBody);
    }

    @ApiOperation({title: 'Update d\'un typeFormation'})
    @Put()
    @Authorized()
    async update( @Body() requestBody: TypeFormation) {
        return await this.typeFormationService.update(requestBody);
    }

    @ApiOperation({title: 'Récupération type formation'})
    @Get('getAllQueryBuild')
    @Authorized()
    async getAllQueryBuild(@Req() req) {
        return await this.typeFormationService.getAllQueryBuild(req.query);
    }

    @ApiOperation({title: 'Récupération type formation'})
    @Get('affectable-by-groupe/:id')
    @Authorized()
    async getAffectableParGroupe(@Param('id') id) {
        return await this.typeFormationService.getAllAffectable(id);
    }

    @ApiOperation({title: 'Récupération type formation'})
    @Get('get-pratique')
    @Authorized()
    async getAllPratique(@Req() req) {
        return await this.typeFormationService.getAllPratique(req.query);
    }
    @ApiOperation({title: 'Récupération type formation'})
    @Get()
    @Authorized()
    async getAll(@Req() req) {
        return await this.typeFormationService.getAll(req.query);
    }

    @ApiOperation({title: 'Récupération type formation par id'})
    @Get(':id')
    @Authorized()
    async get(@Param() params) {
        console.log(params.id);
        return await this.typeFormationService.get(params.id);
    }

    @Delete(':id')
    @Authorized()
    async supprimer(
        @Param('id', new ParseIntPipe())
        id: number,
        @Req() request
    ) {
        return this.typeFormationService.supprimer(id);
    }
    
}