import { CUtilisateurProfil, Utilisateur, Profil, IFonctionRH } from '@aleaac/shared';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
     Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { RhFonctionService } from './rh-fonction.service';
import { RhFonction } from './rh-fonction.entity';



@ApiUseTags('rh-fonction')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'rh-fonction'))
export class RhFonctionController {
    constructor(
        private readonly rhFonctionService: RhFonctionService,
    ) { }

    @ApiOperation({ title: 'Nouveau Fonction de Ressource Humaine' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau fonction de ressource humaine.',
        type: RhFonction
    })
    @ApiResponse({ status: 400, description: 'La fonction de ressource humaine existe déjà.' })
    @Post()
    async create(@Body() requestBody: IFonctionRH) {
        console.log('eeeeeeeeeeeeeeeeeeeeeeeeee');
        console.log(requestBody);
        try {
            return await this.rhFonctionService.create(requestBody);
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
    async getAllFormateur() :Promise<RhFonction[]>{
        try {
            return await this.rhFonctionService.getAllFormateur();
        } catch (e) {
            console.error(e);
        }
    }

    @ApiOperation({title: 'Récupération de toute Formateur by id TypeFormation'})
    @Get('getFormateurByIdTypeFormation/:id')
    @Authorized()
    async getFormateurByIdTypeFormation( @Param('id', new ParseIntPipe()) id: number) :Promise<RhFonction[]>{
        try {
            return await this.rhFonctionService.getFormateurByIdTypeFormation(id);
        } catch (e) {
            console.error(e);
        }
    }

    
    @ApiOperation({title: ''})
    @Get('getFormateurByIdTypeFormationParFranchise/:idTypeForma/:idFranchise')
    @Authorized()
    async getFormateurByIdTypeFormationParFranchise( @Param() params) :Promise<RhFonction[]>{
        console.log('id type forma');
        console.log(params.idTypeForma);
        console.log('idFranchise');
        console.log(params.idFranchise);
        try {
            return await this.rhFonctionService.getFormateurByIdTypeFormationParFranchise(params.idTypeForma,params.idFranchise);
        } catch (e) {
            console.error(e);
        }
    }

    // @Get('exists/:idUser/:idFranchise/:idProfil')
    // @Authorized()
    // async exists(@Param('idUser', new ParseIntPipe()) userId: number,
    //             @Param('idFranchise', new ParseIntPipe()) franchiseId: number,
    //             @Param('idProfil', new ParseIntPipe()) profilId: number): Promise<boolean> {
    //     return await this.profilService.exists(userId, franchiseId, profilId);
    // }

    // @Get('by-user/:idUser')
    // @Authorized()
    // async findByUtilisateur(@Param('idUser', new ParseIntPipe()) userId: number): Promise<UtilisateurProfil[]> {
    //     const result = await this.profilService.findByUtilisateur(userId);

    //      // console.log(result);
    //     return result;
    // }

    // @Get('by-profile/:idProfil')
    // @Authorized()
    // async findByProfile(@Param('idProfil', new ParseIntPipe()) profilId: number): Promise<UtilisateurProfil[]> {
    //     return await this.profilService.findByProfil(profilId);
    // }

    // @Delete()
    // @Authorized()
    // async remove(
    //     @Body() profilUtilisateur: UtilisateurProfil
    // ) {
    //      // console.log(profilUtilisateur);
    //     return this.profilService.remove(profilUtilisateur);
    // }

    @Delete('deleteByIdRh/:id')
    @Authorized()
    async deleteByIdRh(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.rhFonctionService.deleteByIdRh(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }
}