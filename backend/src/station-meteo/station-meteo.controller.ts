import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors, Req
} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {StationMeteoService} from './station-meteo.service';
import {StationMeteo} from './station-meteo.entity';


@ApiUseTags('station-meteo')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'station-meteo'))
export class StationMeteoController {
    constructor(private stationMeteoService: StationMeteoService) {}

    @ApiOperation({title: 'Recupération de toute les station meteo d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.stationMeteoService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les station meteo d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.stationMeteoService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Get 1 station meteo en fonction de son id'})
    @Get(':idConsommable')
    @Authorized()
    async get(@Param() params) {
        return await this.stationMeteoService.get(params.idConsommable)
    }

    @ApiOperation({title: 'Création station meteo'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: StationMeteo) {
        return await this.stationMeteoService.update(requestBody)
    }

    @ApiOperation({title: 'Update station meteo'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: StationMeteo) {
        return await this.stationMeteoService.create(requestBody)
    }
}
