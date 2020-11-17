import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Req, Delete
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {RessourceHumaineService} from './ressource-humaine.service';
import {RessourceHumaine} from './ressource-humaine.entity';


@ApiUseTags('ressource-humaine')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'ressource-humaine'))
export class RessourceHumaineController {
    constructor(private ressourceHumaineService: RessourceHumaineService) {}

    @ApiOperation({title: 'Recupération de toute les ressource humaine d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.ressourceHumaineService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les ressource humaine d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.ressourceHumaineService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Recupération de toute les ressource humaine d\'un bureau'})
    @Get('getByBureau/:idBureau')
    @Authorized()
    async getByBureau(@Param() params, @Req() res) {
        return await this.ressourceHumaineService.getByBureau(params.idBureau, res.query)
    }

    @ApiOperation({title: 'Count de toute les ressource humaine d\'un bureau'})
    @Get('countByBureau/:idBureau')
    @Authorized()
    async countByBureau(@Param() params, @Req() res) {
        return await this.ressourceHumaineService.countByBureau(params.idBureau, res.query)
    }

    @ApiOperation({title: 'Get 1 ressource humaine en fonction de son id'})
    @Get(':idRessourceHumaine')
    @Authorized()
    async get(@Param() params) {
        return await this.ressourceHumaineService.get(params.idRessourceHumaine)
    }

    @ApiOperation({title: 'Création ressource humaine'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: RessourceHumaine) {
        return await this.ressourceHumaineService.create(requestBody)
    }

    @ApiOperation({title: 'Update ressource humaine'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: RessourceHumaine) {
        return await this.ressourceHumaineService.update(requestBody)
    }

    // rendezVousRessourceHumaine

    @ApiOperation({title: 'create rdvRH'})
    @Post('rendezVousRessourceHumaine')
    @Authorized()
    async addRendezVousRessourceHumaine(@Body() requestBody) {
        return await this.ressourceHumaineService.addRendezVousRessourceHumaine(requestBody)
    }

    @ApiOperation({title: 'delete edvRH'})
    @Delete('rendezVousRessourceHumaine/:idRendezVousRessourceHumaine')
    @Authorized()
    async removeRendezVousRessourceHumaine(@Param() params) {
        return await this.ressourceHumaineService.removeRendezVousRessourceHumaine(params.idRendezVousRessourceHumaine)
    }
}
