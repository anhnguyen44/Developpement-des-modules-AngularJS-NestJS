import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req, Patch
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { EchantillonnageService } from './echantillonnage.service';
import { Echantillonnage } from './echantillonnage.entity';
import { HistoriqueService } from '../historique/historique.service';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';


@ApiUseTags('echantillonnage')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'echantillonnage'))
export class EchantillonnageController {
    constructor(
        private echantillonnageService: EchantillonnageService,
        private zoneInterventionService: ZoneInterventionService,
        private historiqueService: HistoriqueService
    ) { }

    @ApiOperation({ title: 'Recupération de toute les echantillonnages d\'une zoneIntervention' })
    @Get('getAll/:idZoneIntervention')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.echantillonnageService.getAll(params.idZoneIntervention, res.query)
    }

    @ApiOperation({ title: 'Count de toute les echantillonnages d\'une zoneIntervention' })
    @Get('countAll/:idZoneIntervention')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.echantillonnageService.countAll(params.idZoneIntervention, res.query)
    }

    @ApiOperation({ title: 'Get 1 echantillonnage en fonction de son id' })
    @Get(':idEchantillonnage')
    @Authorized()
    async get(@Param() params) {
        return await this.echantillonnageService.get(params.idEchantillonnage)
    }

    @ApiOperation({ title: 'Création echantillonnage' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: Echantillonnage) {
        return await this.echantillonnageService.update(requestBody)
    }

    @ApiOperation({ title: 'Update Echantillonnage' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: Echantillonnage) {
        return await this.echantillonnageService.create(requestBody)
    }

    @ApiOperation({ title: 'Update Echantillonnage' })
    @Patch(':id')
    @Authorized()
    async updatePartial(@Body() requestBody: Echantillonnage) {
        delete requestBody.zoneIntervention;
        delete requestBody.idZIEch;
        return await this.echantillonnageService.create(requestBody)
    }

    @ApiOperation({ title: 'Delete Echantillonnage' })
    @Delete(':idEchantillonnage')
    @Authorized()
    async delete(@Param() params, @Req() req) {
        const oldEchantillonnage = await this.echantillonnageService.get(params.idEchantillonnage);
        if (oldEchantillonnage.isRealise) {
            const zone = await this.zoneInterventionService.findOneById(oldEchantillonnage.idZIEch);
            zone.nbPrelevementsARealiser -= oldEchantillonnage.nbMesuresARealiser;
            zone.nbPrelevementsCalcul -= oldEchantillonnage.nbMesures;
        }
        this.historiqueService.add(req.user.id, 'echantillonnage', oldEchantillonnage.id, 'Suppression echantillonnage ' + oldEchantillonnage.id);
        return await this.echantillonnageService.delete(oldEchantillonnage);
    }
}
