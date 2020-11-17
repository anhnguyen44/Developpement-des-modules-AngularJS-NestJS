import {Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors, Req, Res} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import {FicheExpositionService} from './fiche-exposition.service';
import {FicheExposition} from './fiche-exposition.entity';


@ApiUseTags('fiche-exposition')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'fiche-exposition'))
export class FicheExpositionController {
    constructor(private ficheExpositionService: FicheExpositionService) {}

    @ApiOperation({title: 'Création d\'une activité'})
    @Post()
    @Authorized()
    async create(@Body() requestBody: FicheExposition, @Req() req) {
        return await this.ficheExpositionService.create(requestBody);
    }

    @ApiOperation({title: 'Delete d\'une activité'})
    @Delete(':id')
    @Authorized()
    async delete(@Param() params) {
        return await this.ficheExpositionService.delete(params.id);
    }
}
