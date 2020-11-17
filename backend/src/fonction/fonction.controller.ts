import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseInterceptors
  } from '@nestjs/common';
import {FindManyOptions} from 'typeorm';
import {DeepPartial} from 'typeorm/common/DeepPartial';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';

import {Authorized} from '../common/decorators/authorized.decorator';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import { FonctionService } from './fonction.service';
import {Fonction} from './fonction.entity';

@ApiUseTags('Fonction')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'fonction'))
export class FonctionController {
    constructor(private fonctionService: FonctionService) {}

    @Get()
    @Authorized()
    async getAll(): Promise<Fonction[]> {

      return this.fonctionService.getAll();
    }
}
