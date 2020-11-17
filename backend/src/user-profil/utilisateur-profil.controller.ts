import { CUtilisateurProfil, Utilisateur, Profil } from '@aleaac/shared';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
     Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { UtilisateurProfil } from './utilisateur-profil.entity';
import { UtilisateurProfilService } from './utilisateur-profil.service';


@ApiUseTags('UtilisateurProfils')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'utilisateur-profil'))
export class UtilisateurProfilController {
    constructor(
        private readonly profilService: UtilisateurProfilService,
    ) { }

    @ApiOperation({ title: 'Nouveau profil' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau profil.',
        type: UtilisateurProfil
    })
    @ApiResponse({ status: 400, description: 'Le profil existe déjà.' })
    @Post()
    async create(@Body() requestBody: CUtilisateurProfil) {
        try {
            return await this.profilService.create(requestBody);
        } catch (err) {
            if (err.message === 'Le profil existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<UtilisateurProfil>): Promise<UtilisateurProfil[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.profilService.find(options);
    }


    @Get('exists/:idUser/:idFranchise/:idProfil')
    @Authorized()
    async exists(@Param('idUser', new ParseIntPipe()) userId: number,
                @Param('idFranchise', new ParseIntPipe()) franchiseId: number,
                @Param('idProfil', new ParseIntPipe()) profilId: number): Promise<boolean> {
        return await this.profilService.exists(userId, franchiseId, profilId);
    }

    @Get('by-user/:idUser')
    @Authorized()
    async findByUtilisateur(@Param('idUser', new ParseIntPipe()) userId: number): Promise<UtilisateurProfil[]> {
        const result = await this.profilService.findByUtilisateur(userId);

         // console.log(result);
        return result;
    }

    @Get('by-profile/:idProfil')
    @Authorized()
    async findByProfile(@Param('idProfil', new ParseIntPipe()) profilId: number): Promise<UtilisateurProfil[]> {
        return await this.profilService.findByProfil(profilId);
    }

    @Delete()
    @Authorized()
    async remove(
        @Body() profilUtilisateur: UtilisateurProfil
    ) {
         // console.log(profilUtilisateur);
        return this.profilService.remove(profilUtilisateur);
    }
}