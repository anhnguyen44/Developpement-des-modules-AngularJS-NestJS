import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Req,
    UseInterceptors,
    Put, Delete
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {ProcessusService} from './processus.service';
import {Processus} from './processus.entity';
import {HistoriqueService} from '../historique/historique.service';
import { ProcessusZoneService } from '../processus-zone/processus-zone.service';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';


@ApiUseTags('processus')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'processus'))
export class ProcessusController {
    constructor(
        private processusService: ProcessusService,
        private processusZoneService: ProcessusZoneService,
        private historiqueService: HistoriqueService
    ) {}

    @ApiOperation({title: 'liste des processus'})
    @Get('getAll/:idCompte')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        return await this.processusService.getAll(params.idCompte, req.query)
    }

    @ApiOperation({title: 'Récupération d\'un processus'})
    @Get(':idProcessus')
    @Authorized()
    async get(@Param() params, @Req() req) {
        return await this.processusService.get(params.idProcessus)
    }

    @ApiOperation({title: 'Création d\'un processus'})
    @Post('')
    @Authorized()
    async create(@Body() requestBody: Processus, @Req() req) {
        const newProcessus =  await this.processusService.create(requestBody);
        this.historiqueService.add(req.user.id, 'compte', requestBody.idCompte, 'Ajout d\'un processus');
        return newProcessus
    }

    @ApiOperation({title: 'Création d\'un processus'})
    @Delete(':idProcessus')
    @Authorized()
    async delete(@Req() req, @Param() params) {
        const processToDelete = await this.processusService.get(params.idProcessus);

        const liensProcessus: ProcessusZone[] = await this.processusZoneService.getAllByProcessus(params.idProcessus, null);
        if (liensProcessus && liensProcessus.length > 0) {
            for (const processZone of liensProcessus) {
                try {
                    await this.processusZoneService.delete(processZone);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        this.historiqueService.add(req.user.id, 'compte', processToDelete.idCompte, 'Supression du processus ' + processToDelete.libelle);
        return await this.processusService.delete(processToDelete)
    }

    @ApiOperation({title: 'Update d\'un processus'})
    @Put('')
    @Authorized()
    async update(@Body() requestBody: Processus, @Req() req) {
        const oldProcessus = await this.processusService.get(requestBody.id);
        const newProcessus = await this.processusService.update(requestBody);

        let historique = '';

        if (oldProcessus.libelle !== newProcessus.libelle) {
            historique += 'Modification du libellé ' + oldProcessus.libelle + ' => ' + newProcessus.libelle + '\n';
        }
        if (oldProcessus.idTypeBatiment !== newProcessus.idTypeBatiment) {
            historique += 'Modification du type de batiment ' + oldProcessus.idTypeBatiment + ' => ' + newProcessus.idTypeBatiment + '\n';
        }
        if (oldProcessus.idMpca !== newProcessus.idMpca) {
            historique += 'Modification du mpca ' + oldProcessus.idMpca + ' => ' + newProcessus.idMpca + '\n';
        }
        if (oldProcessus.idOutilTechnique !== newProcessus.idOutilTechnique) {
            historique += 'Modification de la technique de retrait ' + oldProcessus.idOutilTechnique
            + ' => ' + newProcessus.idOutilTechnique + '\n';
        }
        if (oldProcessus.isProcessusCyclique !== newProcessus.isProcessusCyclique) {
            historique += 'Modification du processus cyclique ' + oldProcessus.isProcessusCyclique
            + ' => ' + newProcessus.isProcessusCyclique + '\n';
        }
        if (oldProcessus.description !== newProcessus.description) {
            historique += 'Modification de la description ' + oldProcessus.description + ' => ' + newProcessus.description + '\n';
        }

        if (oldProcessus.tachesInstallation !== newProcessus.tachesInstallation) {
            historique += 'Modification des taches principales ' + oldProcessus.tachesInstallation
            + ' => ' + newProcessus.tachesInstallation + '\n';
        }
        if (oldProcessus.tachesRetrait !== newProcessus.tachesRetrait) {
            historique += 'Modification des taches secondaires ' + oldProcessus.tachesRetrait
            + ' => ' + newProcessus.tachesRetrait + '\n';
        }
        if (oldProcessus.niveauAttenduFibresAmiante !== newProcessus.niveauAttenduFibresAmiante) {
            historique += 'Modification du niveau attendu de fibres d\'amiante ' + oldProcessus.niveauAttenduFibresAmiante
            + ' => ' + newProcessus.niveauAttenduFibresAmiante + '\n';
        }
        if (oldProcessus.tmin !== newProcessus.tmin) {
            historique += 'Modification de tmin ' + oldProcessus.tmin + ' => ' + newProcessus.tmin + '\n';
        }
        if (oldProcessus.tsatA !== newProcessus.tsatA) {
            historique += 'Modification de tsat ' + oldProcessus.tsatA + ' => ' + newProcessus.tsatA + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'processus', requestBody.id, historique);
            this.historiqueService.add(req.user.id, 'compte', requestBody.idCompte, 'Modification processus id: ' + requestBody.libelle)
        }

        return newProcessus
    }
}