import { IProfil } from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Profil } from './profil.entity';
import { ProfilService } from './profil.service';
import { CurrentProfil } from './profil.decorator';

import { InjectRepository } from '@nestjs/typeorm';
import { Rights } from '../common/decorators/rights.decorator';
import { profils } from '@aleaac/shared/src/models/profil.model';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';


@ApiUseTags('Profils')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'profil'))
export class ProfilController {
    constructor(
        private readonly profilService: ProfilService,
        private readonly userService: UtilisateurService,
        @InjectRepository(Profil)
        private readonly repositoryProfil: Repository<Profil>,
    ) { }

    @ApiOperation({ title: 'Nouveau profil' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau profil.',
        type: Profil
    })
    @ApiResponse({ status: 400, description: 'Le profil existe déjà.' })
    @Post()
    @Rights('PROFILES_CREATE')
    async create(@Body() requestBody: Profil) {
         // console.log('Create profil');
         // console.log(requestBody);
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

    @Get('page')
    @Authorized(profils.DEV)
    async getPage(@Req() req): Promise<Profil[]> {
        return this.profilService.find(req.query);
    }

    @Get('countAll')
    @Authorized(profils.DEV)
    async countAll(@Req() req): Promise<number> {
      return this.profilService.count(req.query);
    }

    @Get()
    @Authorized()
    async find(@CurrentUtilisateur() user): Promise<Profil[]> {
        let result = await this.profilService.find();

        if (!this.userService.hasRight(user, ['PROFILES_SEE_ALL'])) {
            result = result.filter(pro => pro.isVisibleFranchise)
        }

        return result;
    }

    @ApiOperation({ title: 'Get the current user info (check JWT validity)' })
    @ApiResponse({
        status: 200,
        description: 'JWT is ok, returning user data.',
        type: Profil
    })
    @ApiResponse({ status: 401, description: 'JWT is no longer valid!' })
    @Authorized()
    @Get('current')
    async getCurrent(@CurrentProfil() currentProfil: Profil): Promise<Profil> {
        return await this.profilService.findOneById(currentProfil.id);
    }

    @Get('interne')
    @Authorized()
    async getAllProfilInterne(): Promise<Profil[]> {
      return this.profilService.getAllProfilInterne();
    }

    @Get('externe')
    @Authorized()
    async getAllProfilExterne(): Promise<Profil[]>{
        return this.profilService.getAllProfilExterne();
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<Profil> {
        const foundProfil = await this.profilService.findOneById(parseInt(id, 10));

        if (!foundProfil) {
            throw new NotFoundException(`Profil '${id}' introuvable`);
        }

        return foundProfil;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() profil: Profil) {
        return this.profilService.update(profil.id, profil);
    }

    @ApiOperation({ title: 'MàJ profil' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        profilId: number,
        @Body() partialEntry: DeepPartial<Profil>
    ) {
        return this.repositoryProfil.save(partialEntry);
    }

    @Delete(':id')
    @Authorized()
    @Rights('PROFILES_CREATE')
    async remove(
        @Param('id', new ParseIntPipe())
        profilId: number
    ) {
        return this.profilService.remove(profilId);
    }

}
