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
import { MateriauConstructionAmianteService } from './materiau-construction-amiante.service';
import { Filtre } from '../filtre/filtre.entity';
import { MateriauConstructionAmiante } from './materiau-construction-amiante.entity';
import { ImportService } from '../generation/import.service';
import { profils } from '@aleaac/shared';


@ApiUseTags('materiau-construction-amiante')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'materiau-construction-amiante'))
export class MateriauConstructionAmianteController {
    constructor(
        private materiauConstructionAmianteService: MateriauConstructionAmianteService,
        private importService: ImportService,
        ) { }

    @ApiOperation({ title: 'Recupération de tous les matériaux' })
    @Get('getAll')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.materiauConstructionAmianteService.getAll(res.query)
    }

    @ApiOperation({ title: 'Count de touts le matériaux' })
    @Get('countAll')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.materiauConstructionAmianteService.countAll(res.query)
    }

    @ApiOperation({ title: 'Get 1 materiauConstructionAmiante en fonction de son id' })
    @Get(':idMateriauConstructionAmiante')
    @Authorized()
    async get(@Param() params) {
        return await this.materiauConstructionAmianteService.get(params.idMateriauConstructionAmiante)
    }

    @ApiOperation({ title: 'Création materiauConstructionAmiante' })
    @Post('truncate')
    @Authorized([profils.SUPER_ADMIN])
    async truncate() {
        return await this.materiauConstructionAmianteService.truncate();
    }

    @ApiOperation({ title: 'Création materiauConstructionAmiante' })
    @Post()
    @Authorized()
    async post(@Body() requestBody: MateriauConstructionAmiante) {
        return await this.materiauConstructionAmianteService.update(requestBody)
    }

    @ApiOperation({ title: 'Update materiauConstructionAmiante' })
    @Put()
    @Authorized()
    async update(@Body() requestBody: MateriauConstructionAmiante) {
        return await this.materiauConstructionAmianteService.create(requestBody)
    }

    import(path: string) {

    }
}
