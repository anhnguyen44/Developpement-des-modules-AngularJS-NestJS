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
import {PompeService} from './pompe.service';
import {Filtre} from '../filtre/filtre.entity';
import {Pompe} from './pompe.entity';


@ApiUseTags('pompe')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'pompe'))
export class PompeController {
    constructor(private pompeService: PompeService) {}

    @ApiOperation({title: 'Recupération de toute les pompes d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        return await this.pompeService.getAll(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'Count de toute les pompes d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        return await this.pompeService.countAll(params.idFranchise, req.query)
    }

    @ApiOperation({title: 'Recupération de toute les pompes d\'un bureau'})
    @Get('getByBureau/:idBureau')
    @Authorized()
    async getByBureau(@Param() params, @Req() req) {
        return await this.pompeService.getByBureau(params.idBureau, req.query)
    }

    @ApiOperation({title: 'Count de toute les pompes d\'un bureau'})
    @Get('countByBureau/:idBureau')
    @Authorized()
    async countByBureau(@Param() params, @Req() req) {
        return await this.pompeService.countByBureau(params.idBureau, req.query)
    }

    @ApiOperation({title: 'Get 1 pompe en fonction de son id'})
    @Get(':idPompe')
    @Authorized()
    async get(@Param() params, @Req() req) {
        return await this.pompeService.get(params.idPompe, req.query)
    }

    @ApiOperation({title: 'Création pompe'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: Pompe) {
        return await this.pompeService.update(requestBody)
    }

    @ApiOperation({title: 'Update pompe'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Pompe) {
        return await this.pompeService.create(requestBody)
    }

    @ApiOperation({title: 'recupére le stock des pompes d\'un bureau'})
    @Get('getStock/:idBureau')
    @Authorized()
    async getStock(@Param() params, @Req() req) {
        // console.log('query', req.query);
        return await this.pompeService.getStock(params.idBureau, req.query)
    }

    @ApiOperation({title: 'get indispo'})
    @Get('getIndisponible/:idPompe')
    @Authorized()
    async getIndisponible(@Param() params) {
        return await this.pompeService.getIndisponible(params.idPompe)
    }


    // RendezVousPompe

    @ApiOperation({title: 'récupére les indispo'})
    @Post('rendezVousPompe')
    @Authorized()
    async addRendezVousPompe(@Body() requestBody) {
        return await this.pompeService.addRendezVousPompe(requestBody)
    }

    @ApiOperation({title: 'récupére les indispo'})
    @Delete('rendezVousPompe/:idRendezVousPompe')
    @Authorized()
    async removeRendezVousPompe(@Param() params) {
        return await this.pompeService.removeRendezVousPompe(params.idRendezVousPompe)
    }

}
