import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors, Req, Res
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {LotFiltreService} from './lot-filtre.service';
import {LotFiltre} from './lot-filtre.entity';
import {HistoriqueService} from '../historique/historique.service';
import {EnumTypeFiltre} from '@aleaac/shared';
import {GenerationService} from '../generation/generation.service';


@ApiUseTags('lot-filtre')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'lot-filtre'))
export class LotFiltreController {
    enumTypeFiltre = EnumTypeFiltre;
    constructor(
        private lotFiltreService: LotFiltreService,
        private historiqueService: HistoriqueService,
        private generationService: GenerationService
    ) {}

    @ApiOperation({title: 'Recupération de toute les lot filtres d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.lotFiltreService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les lot filtres d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.lotFiltreService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Get 1 lot-filtre en fonction de son id'})
    @Get(':idFiltre')
    @Authorized()
    async get(@Param() params) {
        return await this.lotFiltreService.get(params.idFiltre)
    }

    @ApiOperation({title: 'Création filtre'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: LotFiltre, @Req() req) {
        const lotFiltre = await this.lotFiltreService.create(requestBody);
        this.historiqueService.add(req.user.id, 'lot-filtre', lotFiltre.id, 'Création du lot de filtre');
        return lotFiltre;
    }

    @ApiOperation({title: 'Update Filtre'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: LotFiltre, @Req() req) {
        const oldLotFiltre = await this.lotFiltreService.get(requestBody.id);
        if (oldLotFiltre.idTypeFiltre !== requestBody.idTypeFiltre) {
            this.historiqueService.add(req.user.id, 'lot-filtre', requestBody.id, 'Modification type de filtre '
                + this.enumTypeFiltre[oldLotFiltre.idTypeFiltre] + ' => ' + this.enumTypeFiltre[requestBody.idTypeFiltre]);
        }
        if (oldLotFiltre.dateEnvoi !== requestBody.dateEnvoi) {
            this.historiqueService.add(req.user.id, 'lot-filtre', requestBody.id, 'Blanc envoyé');
        }
        if (oldLotFiltre.dateReception !== requestBody.dateReception) {
            if (requestBody.isConforme) {
                this.historiqueService.add(req.user.id, 'lot-filtre', requestBody.id, 'Blanc reçu, les filtres sont conforme');
            } else {
                this.historiqueService.add(req.user.id, 'lot-filtre', requestBody.id, 'Blanc reçu, les filtres sont non conforme');
            }
        }

        return await this.lotFiltreService.update(requestBody)
    }

    @ApiOperation({title: 'Génération planche étiquette'})
    @Get('/generatePlanche/:idLotFiltre')
    @Authorized()
    async generatePlanche(@Param() params, @Req() req, @Res() res) {
        const filtres = await this.lotFiltreService.infoGeneratePlanche(params.idLotFiltre);
        const data = [];
        while (filtres.length > 0 ) {
            let row = [];
            const rowFiltre = {
               f1: '', f2: '', f3: '', f4: ''
            };
            row = filtres.splice(0, 4);
           for (let i = 1; i <= row.length; i++) {
               rowFiltre['f' + i] = row[i - 1]
           }
            data.push(rowFiltre)
        }
        // console.log(data);
        res.end(await this.generationService.generateDocx(data, 'plancheFiltre.docx', 'lot-filtre', params.idLotFiltre, req.user.id, 'planche', req.user, false))
    }
}
