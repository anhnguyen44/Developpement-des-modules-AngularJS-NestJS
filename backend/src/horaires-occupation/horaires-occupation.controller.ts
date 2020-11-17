import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HorairesOccupationLocaux } from './horaires-occupation.entity';
import { HorairesOccupationLocauxService } from './horaires-occupation.service';
import { FichierService } from '../fichier/fichier.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { BatimentService } from '../batiment/batiment.service';
import { Batiment } from '../batiment/batiment.entity';


@ApiUseTags('HorairesOccupationLocaux')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'horaires-occupation'))
export class HorairesOccupationLocauxController {
    constructor(
        private horairesOccupationLocauxService: HorairesOccupationLocauxService,
        private batimentService: BatimentService,
        private fichierService: FichierService,
    ) { }

    @ApiOperation({ title: 'Nouvelle horairesOccupationLocaux' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle horairesOccupationLocaux.',
        type: HorairesOccupationLocaux
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post()
    async create(@Body() requestBody: HorairesOccupationLocaux) {
        // console.log(requestBody);

        try {
            return await this.horairesOccupationLocauxService.create(requestBody);
        } catch (err) {
            if (err.message === 'La horairesOccupationLocaux existe déjà.') {
                console.error(err);
                throw new ForbiddenException(err.message);
            } else {
                console.error(err);
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('all/:idZoneIntervention')
    @Authorized()
    async findAllChantier(@Param('idZoneIntervention') idZoneIntervention, @Req() req): Promise<HorairesOccupationLocaux[]> {

        const foundHorairesOccupationLocaux = await this.horairesOccupationLocauxService.findByChantier(idZoneIntervention, req.query);

        return foundHorairesOccupationLocaux;
    }

    @Get('countAll/:idZoneIntervention')
    @Authorized()
    async countAllChantier(@Param('idZoneIntervention') idZoneIntervention, @Req() req): Promise<number> {
        const foundHorairesOccupationLocaux = await this.horairesOccupationLocauxService.findByChantier(idZoneIntervention, req.query);

        return foundHorairesOccupationLocaux.length;
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<HorairesOccupationLocaux>): Promise<HorairesOccupationLocaux[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.horairesOccupationLocauxService.find(options);
    }

    isNumber(value: string | number): boolean {
        return !isNaN(Number(value.toString()));
    }

    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<HorairesOccupationLocaux> {
        const foundHorairesOccupationLocaux = this.horairesOccupationLocauxService.findOneById(parseInt(idOrName, 10));

        if (!foundHorairesOccupationLocaux) {
            throw new NotFoundException(`HorairesOccupationLocaux '${idOrName}' introuvable`);
        }

        return foundHorairesOccupationLocaux;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() horairesOccupationLocaux: HorairesOccupationLocaux) {
        // TODO : check droits
        return this.horairesOccupationLocauxService.update(horairesOccupationLocaux.id, horairesOccupationLocaux);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        horairesOccupationLocauxId: number,
        @Body() partialEntry: DeepPartial<HorairesOccupationLocaux>
    ) {
        // TODO : check droits
        return this.horairesOccupationLocauxService.update(horairesOccupationLocauxId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
        @Param('id', new ParseIntPipe())
        horairesOccupationLocauxId: number,
        @CurrentUtilisateur() user
    ) {
        const old = await this.horairesOccupationLocauxService.findOneById(horairesOccupationLocauxId);

        // TODO : check droits
        // Delete pieces jointes
        // const fichiersLies = await this.fichierService.getAll('horaires-occupation', horairesOccupationLocauxId);
        // for (const fichier of fichiersLies) {
        //     this.fichierService.delete(fichier.id, user);
        // }

        return this.horairesOccupationLocauxService.remove(horairesOccupationLocauxId);
    }
}
