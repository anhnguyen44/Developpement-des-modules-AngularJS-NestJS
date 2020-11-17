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
import { LocalUnitaire } from './local-unitaire.entity';
import { LocalUnitaireService } from './local-unitaire.service';
import { FichierService } from '../fichier/fichier.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';


@ApiUseTags('LocalUnitaire')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'local-unitaire'))
export class LocalUnitaireController {
    constructor(
        private localUnitaireService: LocalUnitaireService,
        private zoneInterventionService: ZoneInterventionService,
        private fichierService: FichierService,
    ) { }

    @ApiOperation({ title: 'Nouvelle localUnitaire' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle localUnitaire.',
        type: LocalUnitaire
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post()
    async create(@Body() requestBody: LocalUnitaire) {
        // console.log(requestBody);

        try {
            requestBody.nbPU = this.localUnitaireService.calculPUSingle(requestBody);
            const res = await this.localUnitaireService.create(requestBody);
            await this.zoneInterventionService.calculPU(res.idZILocal);
            return res;
        } catch (err) {
            if (err.message === 'La localUnitaire existe déjà.') {
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
    async findAllChantier(@Param('idZoneIntervention') idZoneIntervention, @Req() req): Promise<LocalUnitaire[]> {
        const foundLocalUnitaire = await this.localUnitaireService.findByZone(idZoneIntervention, req.query);
        return foundLocalUnitaire;
    }

    @Get('countAll/:idZoneIntervention')
    @Authorized()
    async countAllChantier(@Param('idZoneIntervention') idZoneIntervention, @Req() req): Promise<number> {
        const foundLocalUnitaire = await this.localUnitaireService.findByZone(idZoneIntervention, req.query);
        return foundLocalUnitaire.length;
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<LocalUnitaire>): Promise<LocalUnitaire[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.localUnitaireService.find(options);
    }

    isNumber(value: string | number): boolean {
        return !isNaN(Number(value.toString()));
    }

    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<LocalUnitaire> {
        const foundLocalUnitaire = this.localUnitaireService.findOneById(parseInt(idOrName, 10));

        if (!foundLocalUnitaire) {
            throw new NotFoundException(`LocalUnitaire '${idOrName}' introuvable`);
        }

        return foundLocalUnitaire;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() localUnitaire: LocalUnitaire) {
        // TODO : check droits.
        localUnitaire.nbPU = this.localUnitaireService.calculPUSingle(localUnitaire);
        const res = await this.localUnitaireService.update(localUnitaire.id, localUnitaire);
        await this.zoneInterventionService.calculPU(localUnitaire.idZILocal);
        return res;
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        localUnitaireId: number,
        @Body() partialEntry: DeepPartial<LocalUnitaire>
    ) {
        // TODO : check droits
        partialEntry.nbPU = this.localUnitaireService.calculPUSingle(partialEntry);
        const res = await this.localUnitaireService.update(localUnitaireId, partialEntry);
        await this.zoneInterventionService.calculPU(partialEntry.idZILocal);
        return res;
    }

    @Delete(':id')
    @Authorized()
    async remove(
        @Param('id', new ParseIntPipe())
        localUnitaireId: number,
        @CurrentUtilisateur() user
    ) {
        const old = await this.localUnitaireService.findOneById(localUnitaireId);

        // TODO : check droits
        // Delete enfants
        const locauxEnfants = await this.localUnitaireService.find(
            {
                where: {
                    idParent: localUnitaireId
                }
            }
        );
        if (locauxEnfants && locauxEnfants.length) {
            for (const local of locauxEnfants) {
                this.localUnitaireService.remove(local.id);
            }
        }

        const res = await this.localUnitaireService.remove(localUnitaireId);
        await this.zoneInterventionService.calculPU(old.idZILocal);

        return res;
    }
}
