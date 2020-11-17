import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {
    Controller,
    Get,
    Param,
    UseInterceptors
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {Authorized} from '../common/decorators/authorized.decorator';
import {CaptageAspirationSourceService} from './captage-aspiration-source.service';


@ApiUseTags('captage-aspiration-source')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'captage-aspiration-source'))
export class CaptageAspirationSourceController {
    constructor(private captageAspirationSourceService: CaptageAspirationSourceService) {}

    @ApiOperation({title: 'liste des captage aspiration source'})
    @Get('')
    @Authorized()
    async find(@Param() params) {
        return await this.captageAspirationSourceService.getAll()
    }

    @ApiOperation({title: 'one aspiration source'})
    @Get(':idCaptageAspirationSource')
    @Authorized()
    async get(@Param() params) {
        return await this.captageAspirationSourceService.get(params.idCaptageAspirationSource)
    }
}