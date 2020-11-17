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
import { MateriauZoneService } from './materiau-zone.service';
import { Filtre } from '../filtre/filtre.entity';
import { MateriauZone } from './materiau-zone.entity';


@ApiUseTags('materiau-zone')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'materiau-zone'))
export class MateriauZoneController {
    constructor(private materiauZoneService: MateriauZoneService) { }

    @ApiOperation({ title: 'Recupération de tous les matériaux' })
    @Get('getAll/:idZone')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.materiauZoneService.getAll(params.idZone, res.query);
    }

    @ApiOperation({ title: 'Count de touts le matériaux' })
    @Get('countAll/:idZone')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.materiauZoneService.countAll(params.idZone, res.query);
    }

    @ApiOperation({ title: 'Get 1 materiauZone en fonction de son id' })
    @Get(':idMateriauZone')
    @Authorized()
    async get(@Param() params) {
        return await this.materiauZoneService.get(params.idMateriauZone);
    }

    @ApiOperation({ title: 'Création materiauZone' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: MateriauZone) {
        return await this.materiauZoneService.update(requestBody);
    }

    @ApiOperation({ title: 'Création materiauZone' })
    @Patch(':id')
    @Authorized()
    async patch(@Body() requestBody: MateriauZone) {
        return await this.materiauZoneService.update(requestBody);
    }

    @ApiOperation({ title: 'Update materiauZone' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: MateriauZone) {
        return await this.materiauZoneService.create(requestBody);
    }

    @ApiOperation({ title: 'Update materiauZone' })
    @Delete(':id')
    @Authorized()
    async delete(@Param() id: number) {
        return await this.materiauZoneService.delete(id);
    }
}
