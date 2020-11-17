import { CUtilisateurProfil, Utilisateur, Profil, IFonctionRH, TypeFormationDCompetence } from '@aleaac/shared';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
     Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TFormationDCompetence } from './tFormation-dCompetence.entity';
import { TFormationDCompetenceService } from './tFormation-dCompetence.service';




@ApiUseTags('tFormation-dCompetence')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'tFormation-dCompetence'))
export class TFormationDCompetenceController {
    constructor(
        private readonly tFormationDCompetenceService: TFormationDCompetenceService,
    ) { }

    @ApiOperation({ title: 'Nouvelle domaine competence de type formation' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau fonction de ressource humaine.',
        type: TFormationDCompetence
    })
    @ApiResponse({ status: 400, description: 'La fonction de ressource humaine existe déjà.' })
    @Post()
    async create(@Body() requestBody: TFormationDCompetence) {
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeee');
        console.log(requestBody);
        try {
            return await this.tFormationDCompetenceService.create(requestBody);
        } catch (err) {
            if (err.message === 'La fonction de ressource humaine existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({title: 'Récupération de toute Formateur'})
    @Get('getAllFormateur')
    @Authorized()
    async getAllFormateur() :Promise<TFormationDCompetence[]>{
        try {
            return await this.tFormationDCompetenceService.getAllFormateur();
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({title: 'Récupération de toute Formateur'})
    @Get('getByIdTypeFormation/:id')
    @Authorized()
    async getByIdTypeFormation(@Param('id', new ParseIntPipe()) id: number,@Req() request) :Promise<TFormationDCompetence[]>{
        try {
            return await this.tFormationDCompetenceService.getByIdTypeFormation(id);
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({title: 'Récupération de toute Formateur'})
    @Get('getByIdCompetence/:id')
    @Authorized()
    async getByIdCompetence(@Param('id', new ParseIntPipe()) id: number,@Req() request) :Promise<TFormationDCompetence[]>{
        try {
            return await this.tFormationDCompetenceService.getByIdCompetence(id);
        } catch (e) {
            console.error(e);
        }
    }

    @Delete('deleteByIdForma/:id')
    @Authorized()
    async deleteByIdFormation(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.tFormationDCompetenceService.deleteByIdFormation(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    @Delete('deleteByIdCompetence/:id')
    @Authorized()
    async deleteByIdCompetence(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.tFormationDCompetenceService.deleteByIdCompetence(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    @Delete(':id')
    @Authorized()
    async delete(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ):Promise<TFormationDCompetence> {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.tFormationDCompetenceService.delete(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }
}