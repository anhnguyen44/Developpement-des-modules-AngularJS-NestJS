import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param, Post, Put, Req,
    UseInterceptors
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {CmdAnalyseService} from './cmd-analyse.service';
import {CmdAnalyse} from './cmd-analyse.entity';



@ApiUseTags('cmd-analyse')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'cmd-analyse'))
export class CmdAnalyseController {
    constructor(private cmdAnalyseService: CmdAnalyseService) {}

    @ApiOperation({title: 'liste des commandes d\'un chantier'})
    @Get('getAll/:idChantier')
    @Authorized()
    async getAllByType(@Param() params, @Req() req) {
        return await this.cmdAnalyseService.getAll(params.idChantier, req.query);
    }

    @ApiOperation({title: 'count commande analyse par chantier'})
    @Get('count/:idChantier')
    @Authorized()
    async countAllByType(@Param() params, @Req() req) {
        return await this.cmdAnalyseService.countAll(params.idChantier, req.query);
    }

    @ApiOperation({title: 'get one prelevement'})
    @Get(':idCmdAnalyse')
    @Authorized()
    async get(@Param() params) {
        return await this.cmdAnalyseService.get(params.idCmdAnalyse);
    }

    @ApiOperation({title: 'create prelevement'})
    @Post('')
    @Authorized()
    async create(@Body() requestBody: CmdAnalyse) {
        return await this.cmdAnalyseService.create(requestBody);
    }

    @ApiOperation({title: 'update prelevement'})
    @Put('')
    @Authorized()
    async update(@Body() requestBody: CmdAnalyse) {
        return await this.cmdAnalyseService.update(requestBody);
    }

}