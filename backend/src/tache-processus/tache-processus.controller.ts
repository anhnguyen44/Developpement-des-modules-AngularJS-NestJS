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
import {TacheProcessusService} from './tache-processus.service';
import {TacheProcessus} from './tache-processus.entity';


@ApiUseTags('tache-processus')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'tache-processus'))
export class TacheProcessusController {
    constructor(private tacheProcessusService: TacheProcessusService) {}

    @ApiOperation({title: 'Recupération de toute les tache d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.tacheProcessusService.getAll(params.idFranchise)
    }

    @ApiOperation({title: 'Get 1 tache processus en fonction de son id'})
    @Get(':idTacheProcessus')
    @Authorized()
    async get(@Param() params) {
        return await this.tacheProcessusService.get(params.idConsommable)
    }

    @ApiOperation({title: 'Création tache processus'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: TacheProcessus) {
        return await this.tacheProcessusService.update(requestBody)
    }

    @ApiOperation({title: 'Update tache processus'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: TacheProcessus) {
        return await this.tacheProcessusService.create(requestBody)
    }
}
