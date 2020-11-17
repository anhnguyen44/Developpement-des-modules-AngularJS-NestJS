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
import {SalleService} from './salle.service';
import {Filtre} from '../filtre/filtre.entity';
import {Salle} from './salle.entity';


@ApiUseTags('salle')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'salle'))
export class SalleController {
    constructor(private salleService: SalleService) {}

    @ApiOperation({title: 'Recupération de toute les consommables d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.salleService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les consommables d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.salleService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Get 1 salle en fonction de son id'})
    @Get(':idSalle')
    @Authorized()
    async get(@Param() params) {
        return await this.salleService.get(params.idSalle)
    }

    @ApiOperation({title: 'Création salle'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: Salle) {
        return await this.salleService.update(requestBody)
    }

    @ApiOperation({title: 'Update salle'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Salle) {
        return await this.salleService.create(requestBody)
    }

    // rendezVousPompe

    @ApiOperation({title: 'create rdvSalle'})
    @Post('rendezVousSalle')
    @Authorized()
    async addRendezVousSalle(@Body() requestBody) {
        return await this.salleService.addRendezVousSalle(requestBody)
    }

    @ApiOperation({title: 'delete rdvSalle'})
    @Delete('rendezVousSalle/:idRendezVousSalle')
    @Authorized()
    async removeRendezVousSalle(@Param() params) {
        return await this.salleService.removeRendezVousSalle(params.idRendezVousSalle)
    }
}
