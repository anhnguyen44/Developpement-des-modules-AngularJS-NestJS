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
import {DebitmetreService} from './debitmetre.service';
import {Debitmetre} from './debitmetre.entity';


@ApiUseTags('debitmetre')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'debitmetre'))
export class DebitmetreController {
    constructor(private debimetreService: DebitmetreService) {}

    @ApiOperation({title: 'Recupération de toute les debitmetre d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() res) {
        return await this.debimetreService.getAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Count de toute les debitmetre d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() res) {
        return await this.debimetreService.countAll(params.idFranchise, res.query)
    }

    @ApiOperation({title: 'Get 1 debitmetre en fonction de son id'})
    @Get(':idDebitmetre')
    @Authorized()
    async get(@Param() params) {
        return await this.debimetreService.get(params.idDebitmetre)
    }

    @ApiOperation({title: 'Création debitmetre'})
    @Post()
    @Authorized()
    async post(@Body() requestBody: Debitmetre) {
        return await this.debimetreService.update(requestBody)
    }

    @ApiOperation({title: 'Update debitmetre'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: Debitmetre) {
        return await this.debimetreService.create(requestBody)
    }

}
