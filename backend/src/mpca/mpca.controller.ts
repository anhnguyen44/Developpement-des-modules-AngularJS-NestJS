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
import {MpcaService} from './mpca.service';



@ApiUseTags('mpca')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'mpca'))
export class MpcaController {
    constructor(private mpcaService: MpcaService) {}

    @ApiOperation({title: 'liste des Mpca'})
    @Get('')
    @Authorized()
    async find(@Param() params) {
        return await this.mpcaService.getAll()
    }

    @ApiOperation({title: 'one Mpca'})
    @Get(':idMpca')
    @Authorized()
    async get(@Param() params) {
        return await this.mpcaService.get(params.idMpca)
    }
}