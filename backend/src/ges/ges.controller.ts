import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put,
    UseInterceptors,
    Delete, Req
} from '@nestjs/common';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { GESService } from './ges.service';
import { Filtre } from '../filtre/filtre.entity';
import { GES } from './ges.entity';


@ApiUseTags('ges')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'ges'))
export class GESController {
    constructor(private gesService: GESService) { }

    @ApiOperation({ title: 'Recupération de toute les consommables d\'une zone d\'intervention' })
    @Get('getAll/:idZoneIntervention')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.gesService.getAll(params.idZoneIntervention, res.query)
    }

    @ApiOperation({ title: 'Count de toute les consommables d\'une zone d\'intervention' })
    @Get('countAll/:idZoneIntervention')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.gesService.countAll(params.idZoneIntervention, res.query)
    }

    @ApiOperation({ title: 'Get 1 ges en fonction de son id' })
    @Get(':idGES')
    @Authorized()
    async get(@Param() params) {
        return await this.gesService.get(params.idGES)
    }

    @ApiOperation({ title: 'Création ges' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: GES) {
        return await this.gesService.update(requestBody)
    }

    @ApiOperation({ title: 'Update ges' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: GES) {
        return await this.gesService.create(requestBody)
    }

    @ApiOperation({ title: 'Delete 1 ges en fonction de son id' })
    @Delete(':idGES')
    @Authorized()
    async delete(@Param() params) {
        return await this.gesService.delete(params.idGES)
    }
}
