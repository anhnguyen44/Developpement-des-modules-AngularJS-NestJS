import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {FiltreService} from './filtre.service';
import {Filtre} from './filtre.entity';
import {HistoriqueService} from '../historique/historique.service';


@ApiUseTags('filtre')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'filtre'))
export class FiltreController {
    constructor(
        private filtreService: FiltreService,
        private historiqueService: HistoriqueService
    ) {}

    @ApiOperation({title: 'Recupération de toute les filtres d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.filtreService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les filtres d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.filtreService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Get stock'})
    @Get('getStock/:idFranchise')
    @Authorized()
    async getStock(@Param() params) {
        return await this.filtreService.getStock(params.idFranchise)
    }

    @ApiOperation({title: 'Get non affecte par bureau'})
    @Get('getNonAffecte/:idBureau')
    @Authorized()
    async findNonAffecte(@Param() params) {
        return await this.filtreService.getNonAffecte(params.idBureau)
    }

    @ApiOperation({title: 'Get 1 filtre en fonction de son id'})
    @Get(':idFiltre')
    @Authorized()
    async get(@Param() params) {
        return await this.filtreService.get(params.idFiltre)
    }

    @ApiOperation({title: 'Création filtre'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: Filtre) {
        return await this.filtreService.update(requestBody)
    }

    @ApiOperation({title: 'Update Filtre'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Filtre) {
        return await this.filtreService.create(requestBody)
    }

    @ApiOperation({title: 'Delete Filtre'})
    @Delete(':idFiltre')
    @Authorized()
    async delete(@Param() params, @Req() req) {
        const oldFiltre = await this.filtreService.get(params.idFiltre);
        this.historiqueService.add(req.user.id, 'lot-filtre', oldFiltre.idLotFiltre, 'Suppression filtre ' + oldFiltre.ref);
        return await this.filtreService.delete(oldFiltre);
    }
}
