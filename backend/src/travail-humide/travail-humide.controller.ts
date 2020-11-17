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
import {TravailHumideService} from './travail-humide.service';


@ApiUseTags('travail-humide')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'travail-humide'))
export class TravailHumideController {
    constructor(private travailHumideService: TravailHumideService) {}

    @ApiOperation({title: 'liste des travail-humide'})
    @Get('')
    @Authorized()
    async find(@Param() params) {
        return await this.travailHumideService.getAll()
    }

    @ApiOperation({title: 'one travail-humide'})
    @Get(':idTravailHumide')
    @Authorized()
    async get(@Param() params) {
        return await this.travailHumideService.get(params.idTravailHumide)
    }
}