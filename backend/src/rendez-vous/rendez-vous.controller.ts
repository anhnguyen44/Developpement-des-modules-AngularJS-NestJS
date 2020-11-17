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
import {RendezVousService} from './rendez-vous.service';


@ApiUseTags('rendez-vous')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'rendez-vous'))
export class RendezVousController {
    constructor(private rendezVousService: RendezVousService) {}

    @ApiOperation({title: 'Delete un rdv'})
    @Delete(':idRendezVous')
    @Authorized()
    async delete(@Param() params) {
        return await this.rendezVousService.delete(params.idRendezVous);
    }
}
