import { CUtilisateurProfil, Utilisateur, Profil, IFonctionRH, IFormationValideRH } from '@aleaac/shared';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
     Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { RhFormationValide } from './rh-formationValide.entity';
import { RhFormationValideService } from './rh-formationValide.service';



@ApiUseTags('RhFormationValide')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'rh-formationValide'))
export class RhFormationValideController {
    constructor(
        private readonly rhFormationValideService: RhFormationValideService,
    ) { }

    @ApiOperation({ title: 'Nouveau formation de ressource humaine' })
    @ApiResponse({
        status: 200,
        description: 'Retourne la formation de ressource humaine.',
        type: RhFormationValide
    })
    @ApiResponse({ status: 400, description: 'La formation de ressource humaine existe déjà.' })
    @Post()
    async create(@Body() requestBody: IFormationValideRH) {
        try {
            return await this.rhFormationValideService.create(requestBody);
        } catch (err) {
            if (err.message === 'La formation de ressource humaine existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    // @Get()
    // @Authorized()
    // async find(@Query() findOptions?: FindManyOptions<UtilisateurProfil>): Promise<UtilisateurProfil[]> {
    //     const options = {
    //         take: 100,
    //         skip: 0,
    //         ...findOptions // overwrite default ones
    //     };
    //     return this.profilService.find(options);
    // }


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

    @Delete('deleteByIdRh/:id')
    @Authorized()
    async deleteByIdRh(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.rhFormationValideService.deleteByIdRh(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    @Delete('deleteByIdForma/:id')
    @Authorized()
    async deleteByIdFormation(
        @Param('id', new ParseIntPipe()) id: number,@Req() request
    ) {
        console.log(id);
         // console.log(profilUtilisateur);
        return await this.rhFormationValideService.deleteByIdFormation(id);
        // return await this.formationRhRepository.delete({idRh:id});
    }

    
}