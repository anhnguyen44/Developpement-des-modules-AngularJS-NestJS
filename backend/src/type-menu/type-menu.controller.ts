import { ITypeMenu } from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TypeMenu } from './type-menu.entity';
import { TypeMenuService } from './type-menu.service';

import { InjectRepository } from '@nestjs/typeorm';
import { profils } from '@aleaac/shared/src/models/profil.model';


@ApiUseTags('type-menu')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-menu'))
export class TypeMenuController {
    constructor(
        private readonly typemenuService: TypeMenuService,
        @InjectRepository(TypeMenu)
        private readonly repositoryTypeMenu: Repository<TypeMenu>,
    ) { }

    @Get()
    @Authorized()
    @ApiResponse({status: 401, description: 'Formulaire invalide.'})
    async find(@Query() findOptions?: FindManyOptions<TypeMenu>): Promise<TypeMenu[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.typemenuService.find(options);
    }
   
}
