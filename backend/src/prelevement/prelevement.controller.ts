import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Body,
    Controller, Delete,
    Get,
    Param, Post, Put, Req,
    UseInterceptors
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {PrelevementService} from './prelevement.service';
import {Prelevement} from './prelevement.entity';



@ApiUseTags('prelevement')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'prelevement'))
export class PrelevementController {
    constructor(private prelevementService: PrelevementService) {}

    @ApiOperation({title: 'liste des Prélèvement d\'un type'})
    @Get(':nomIdParent/:idParent')
    @Authorized()
    async getAllByType(@Param() params, @Req() req) {
        return await this.prelevementService.getAllByType(params.nomIdParent, params.idParent, req.query);
    }

    @ApiOperation({title: 'liste des Prélèvement d\'un type'})
    @Get('count/:nomIdParent/:idParent')
    @Authorized()
    async countAllByType(@Param() params, @Req() req) {
        return await this.prelevementService.countAllByType(params.nomIdParent, params.idParent, req.query);
    }

    @ApiOperation({title: 'get one prelevement'})
    @Get(':idPrelevement')
    @Authorized()
    async get(@Param() params) {
        return await this.prelevementService.get(params.idPrelevement);
    }

    @ApiOperation({title: 'create prelevement'})
    @Post('')
    @Authorized()
    async create(@Body() requestBody: Prelevement) {
        return await this.prelevementService.create(requestBody);
    }

    @ApiOperation({title: 'update prelevement'})
    @Put('')
    @Authorized()
    async update(@Body() requestBody: Prelevement) {
        return await this.prelevementService.update(requestBody);
    }

    @ApiOperation({title: 'delete prelevement'})
    @Delete(':idPrelevement')
    @Authorized()
    async delete(@Param() params) {
        return await this.prelevementService.delete(params.idPrelevement);
    }

}