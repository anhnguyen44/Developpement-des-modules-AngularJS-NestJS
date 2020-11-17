import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req, Res
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { ListeService } from './liste.service';
import { Liste } from './liste.entity';
import { profils, ListeVerifExistenceDto } from '@aleaac/shared';
import { GenerationService } from '../generation/generation.service';


@ApiUseTags('liste')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'liste'))
export class ListeController {
    constructor(
        private listeService: ListeService,
        private generationService: GenerationService,
    ) { }


    @ApiOperation({ title: 'Génération de l\'export' })
    @Get('generateXlsx')
    @Authorized([profils.SUPER_ADMIN])
    async generateXlsx(@Param() params, @Res() res) {
        const data: Liste[] = await this.listeService.getAll(null);
        const header = [
            'Type de partage de la liste', 'Nom de la liste', 'Résumé', 'Valeur', 'Ordre', 'Livré par défaut',
            'Nom de la sous-liste'
        ];
        const datas = [];

        data.forEach((row: Liste) => {
            const rowToPush = [];
            rowToPush.push(row.typePartage);
            rowToPush.push(row.nomListe);
            rowToPush.push(row.resume);
            rowToPush.push(row.valeur);
            rowToPush.push(row.ordre);
            rowToPush.push(row.isLivreParDefaut);
            rowToPush.push(row.sousListe);
            datas.push(rowToPush);
        });

        res.end(await this.generationService.generateXlsx(header, datas))
    }

    @ApiOperation({ title: 'Recupération de toute les valeurs d\'une liste' })
    @Get('getAll/:nomListe')
    @Authorized()
    async getListe(@Param() params, @Req() req) {
        return await this.listeService.getListe(params.nomListe, req)
    }

    @ApiOperation({ title: 'Count de toute les valeurs d\'une liste' })
    @Get('countAll/:nomListe')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        return await this.listeService.countAll(params.nomListe, req)
    }

    @ApiOperation({ title: 'Get 1 valeur liste en fonction de son id' })
    @Get(':idListe')
    @Authorized()
    async get(@Param() params) {
        return await this.listeService.get(params.idListe)
    }

    @ApiOperation({ title: 'Recupération de toute les valeurs' })
    @Get('/')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        return await this.listeService.getAll(req)
    }


    @ApiOperation({ title: 'Vérifier si un item existe dans la liste' })
    @Post('verif-existence')
    @Authorized()
    async verifExistante(@Body() requestBody: ListeVerifExistenceDto, @Req() req) {
        return await this.listeService.verifExistence(requestBody, req);
    }

    @ApiOperation({ title: 'Création liste' })
    @Post('truncate')
    @Authorized()
    async truncate(@Body() requestBody: Liste) {
        // On enlève que ceux liés par défaut
        return await this.listeService.truncateDefault();
    }


    @ApiOperation({ title: 'Création liste' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: Liste) {
        const tmpItem = await this.listeService.create(requestBody);
        return await this.listeService.create(tmpItem);
    }

    @ApiOperation({ title: 'Update liste' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: Liste) {
        return await this.listeService.update(requestBody)
    }
}
