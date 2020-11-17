import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Res, Req
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {ConsommableService} from './consommable.service';
import {Filtre} from '../filtre/filtre.entity';
import {Consommable} from './consommable.entity';


@ApiUseTags('consommable')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'consommable'))
export class ConsommableController {
    constructor(private consommableService: ConsommableService) {}

    @ApiOperation({title: 'Recupération de toute les consommables d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.consommableService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les consommables d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.consommableService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Get 1 consommable en fonction de son id'})
    @Get(':idConsommable')
    @Authorized()
    async get(@Param() params) {
        return await this.consommableService.get(params.idConsommable)
    }

    @ApiOperation({title: 'Création consommable'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: Consommable) {
        return await this.consommableService.update(requestBody)
    }

    @ApiOperation({title: 'Update consommable'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Consommable) {
        return await this.consommableService.create(requestBody)
    }
}
