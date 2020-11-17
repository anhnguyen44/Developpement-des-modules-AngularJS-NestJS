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
import {OutilTechniqueService} from './outil-technique.service';


@ApiUseTags('outil-technique')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'outil-technique'))
export class OutilTechniqueController {
    constructor(private outilTechniqueService: OutilTechniqueService) {}

    @ApiOperation({title: 'liste des outil-technique'})
    @Get('')
    @Authorized()
    async find(@Param() params) {
        return await this.outilTechniqueService.getAll()
    }

    @ApiOperation({title: 'one outil-technique'})
    @Get(':idOutilTechnique')
    @Authorized()
    async get(@Param() params) {
        return await this.outilTechniqueService.get(params.idOutilTechnique)
    }
}