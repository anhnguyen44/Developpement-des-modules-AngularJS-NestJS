import { CUtilisateurProfil, Utilisateur, Profil, IFonctionRH, IFormateurFormation } from '@aleaac/shared';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
     Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { FormateurFormationService } from './formateur-formation.service';
import { FormateurFormation } from './formateur-formation.entity';



@ApiUseTags('formateur-formation')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'formateur-formation'))
export class FormateurFormationController {
    constructor(
        private readonly formateurFormationService: FormateurFormationService,
    ) { }

    @ApiOperation({ title: 'Nouveau formateur de Ressource Humaine' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau formateur de ressource humaine.',
        type: FormateurFormation
    })
    @ApiResponse({ status: 400, description: 'La formateur de ressource humaine existe déjà.' })
    @Post()
    async create(@Body() requestBody: IFormateurFormation) {
        try {
            return await this.formateurFormationService.create(requestBody);
        } catch (err) {
            if (err.message === 'La fonction de ressource humaine existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    // @ApiOperation({title: 'Récupération de toute Formateur'})
    // @Get('getAllFormateur')
    // @Authorized()
    // async getAllFormateur() :Promise<RhFonction[]>{
    //     try {
    //         return await this.rhFonctionService.getAllFormateur();
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    // @ApiOperation({title: 'Récupération de toute Formateur by id TypeFormation'})
    // @Get('getFormateurByIdTypeFormation/:id')
    // @Authorized()
    // async getFormateurByIdTypeFormation( @Param('id', new ParseIntPipe()) id: number) :Promise<RhFonction[]>{
    //     try {
    //         return await this.rhFonctionService.getFormateurByIdTypeFormation(id);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    
    // @ApiOperation({title: ''})
    // @Get('getFormateurByIdTypeFormationParFranchise/:idTypeForma/:idFranchise')
    // @Authorized()
    // async getFormateurByIdTypeFormationParFranchise( @Param() params) :Promise<RhFonction[]>{
    //     console.log('id type forma');
    //     console.log(params.idTypeForma);
    //     console.log('idFranchise');
    //     console.log(params.idFranchise);
    //     try {
    //         return await this.rhFonctionService.getFormateurByIdTypeFormationParFranchise(params.idTypeForma,params.idFranchise);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }


    @Delete('deleteByIdformateur/:id')
    @Authorized()
    async deleteByIdformateur(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
        return await this.formateurFormationService.deleteByIdformateur(id);
    }

    @ApiOperation({title: 'Suppression formateur de formation'})
    @Delete(':id')
    @Authorized()
    async  delete(@Param() params) {
        return await this.formateurFormationService.delete(params.id)
    }
}