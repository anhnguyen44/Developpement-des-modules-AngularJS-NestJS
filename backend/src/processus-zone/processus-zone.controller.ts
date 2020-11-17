import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Req,
    UseInterceptors,
    Put, Delete, Patch
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { ProcessusZoneService } from './processus-zone.service';
import { ProcessusZone } from './processus-zone.entity';
import { HistoriqueService } from '../historique/historique.service';
import { ObjectifService } from '../objectif/objectif.service';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { EnumTypeMesure, EnumMomentObjectifs } from '@aleaac/shared';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { FindManyOptions } from 'typeorm';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';


@ApiUseTags('processus-zone')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'processus-zone'))
export class ProcessusZoneController {
    constructor(
        private processusZoneService: ProcessusZoneService,
        private historiqueService: HistoriqueService,
        private objectifService: ObjectifService,
        private echantillonnageService: EchantillonnageService,
        private zoneInterventionService: ZoneInterventionService,
    ) { }

    @ApiOperation({ title: 'liste des processusZone' })
    @Get('get-by-processus/:idProcessus')
    @Authorized()
    async getAllByIdProcessus(@Param() params, @Req() req) {
        return await this.processusZoneService.getAllByProcessus(params.idProcessus, req.query);
    }

    @ApiOperation({ title: 'liste des processusZone' })
    @Get('get-by-zone/:idZone')
    @Authorized()
    async getAllByIdZone(@Param() params, @Req() req) {
        return await this.processusZoneService.getAllByZone(params.idZone, req.query);
    }

    @ApiOperation({ title: 'Récupération d\'un processusZone' })
    @Get(':idProcessusZone')
    @Authorized()
    async get(@Param() params, @Req() req) {
        return await this.processusZoneService.get(params.idProcessusZone);
    }

    @ApiOperation({ title: 'Création d\'un processusZone' })
    @Post('')
    @Authorized()
    async create(@Body() requestBody: ProcessusZone, @Req() req) {
        const newProcessusZone = await this.processusZoneService.create(requestBody);

        const objectifs = await this.objectifService.find({
            where: {
                isMesureOperateur: true
            }
        });

        newProcessusZone.zoneIntervention = await this.zoneInterventionService.findOneById(newProcessusZone.idZoneIntervention);

        for (const obj of objectifs) {
            const optExistingEch: FindManyOptions<Echantillonnage> = {
                where: {
                    idZIEch: newProcessusZone.idZoneIntervention,
                    idObjectif: obj.id
                }
            }
            const existingEch = await this.echantillonnageService.find(optExistingEch);

            let nbGES = 1;
            if (existingEch) {
                nbGES = existingEch.length + 1;
            }

            // console.log(obj.code);
            const tmpEch: Echantillonnage = new Echantillonnage();
            tmpEch.code = newProcessusZone.zoneIntervention.reference + '-' + obj.code + '-' + nbGES;
            tmpEch.idObjectif = obj.id;
            tmpEch.idZIEch = newProcessusZone.zoneIntervention.id;
            tmpEch.typeMesure = EnumTypeMesure.SUR_OPERATEUR;
            tmpEch.duree = obj.hasTempsCalcule ? Number.parseInt(obj.duree.match(/\d+/g)[0]) : 0;
            tmpEch.dureeARealiser = tmpEch.duree;
            tmpEch.frequenceParSemaine = obj.isPeriodique
                ? 1
                : 0; // 0 = Oneshot
            tmpEch.isRealise = obj.isObligatoireCOFRAC;
            tmpEch.nbMesures = this.echantillonnageService.getNbPrelevements(obj, newProcessusZone.zoneIntervention);
            tmpEch.nbMesuresARealiser = tmpEch.nbMesures;
            tmpEch.idProcessusZone = newProcessusZone.id;

            this.echantillonnageService.create(tmpEch);
        }

        this.historiqueService.add(req.user.id, 'processus-zone', requestBody.id, 'Ajout d\'un processusZone');
        return newProcessusZone;
    }

    @ApiOperation({ title: 'Création d\'un processusZone' })
    @Delete(':idProcessusZone')
    @Authorized()
    async delete(@Req() req, @Param() params) {
        const processToDelete = await this.processusZoneService.get(params.idProcessusZone);
        this.historiqueService.add(req.user.id, 'processus-zone', processToDelete.id,
            'Supression du processusZone ' + JSON.stringify(processToDelete));
        return await this.processusZoneService.delete(processToDelete);
    }

    @ApiOperation({ title: 'Update d\'un processusZone' })
    @Put('')
    @Authorized()
    async update(@Body() requestBody: ProcessusZone, @Req() req) {
        const oldProcessusZone = await this.processusZoneService.get(requestBody.id);
        const newProcessusZone = await this.processusZoneService.update(requestBody);

        let historique = '';

        return newProcessusZone;
    }

    @ApiOperation({ title: 'Update d\'un processusZone' })
    @Patch(':id')
    @Authorized()
    async updatePartial(@Body() requestBody: ProcessusZone, @Req() req) {
        console.debug(requestBody);
        const oldProcessusZone = await this.processusZoneService.get(requestBody.id);
        const newProcessusZone = await this.processusZoneService.update(requestBody);

        let historique = '';

        return newProcessusZone;
    }
}