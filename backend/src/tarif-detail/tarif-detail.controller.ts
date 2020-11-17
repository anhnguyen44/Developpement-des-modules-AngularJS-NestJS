import { ITarifDetail } from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TarifDetail } from './tarif-detail.entity';
import { TarifDetailService } from './tarif-detail.service';

import { InjectRepository } from '@nestjs/typeorm';
import { profils } from '@aleaac/shared/src/models/profil.model';


@ApiUseTags('tarif-detail')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'tarif-detail'))
export class TarifDetailController {
    constructor(
        private readonly tarifDetailService: TarifDetailService,
        @InjectRepository(TarifDetail)
        private readonly repositoryTarifDetail: Repository<TarifDetail>,
    ) { }

    @ApiOperation({ title: 'Nouveau TarifDetail' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau TarifDetail.',
        type: TarifDetail
    })
    @ApiResponse({ status: 400, description: 'Le TarifDetail existe déjà.' })
    @Post()
    async create(@Body() requestBody: TarifDetail) {
         // console.log('Create TarifDetail');
         // console.log(requestBody);
        try {
            return await this.tarifDetailService.create(requestBody);
        } catch (err) {
            if (err.message === 'Le TarifDetail existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('byGrilles')
    @Authorized()
    async getByGrilles(@Req() req): Promise<TarifDetail[]> {
        return await this.tarifDetailService.findByGrilles(req.query);
    }

    @Get('countByGrilles')
    @Authorized()
    async countByGrilles(@Req() req): Promise<number> {
        return await this.tarifDetailService.countByGrilles(req.query);
    }


    @Get('page/:parPage/:nbPage')
    @Authorized(profils.DEV)
    async getPage(@Param('parPage', new ParseIntPipe()) parPage: number,
     @Param('nbPage', new ParseIntPipe()) nbPage: number): Promise<TarifDetail[]> {
      const options = {
        take: parPage,
        skip: (nbPage - 1) * parPage,
      };
      return this.tarifDetailService.find(options);
    }

    @Get('countAll')
    @Authorized(profils.DEV)
    async countAll(): Promise<number> {
      return this.repositoryTarifDetail.count();
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TarifDetail>): Promise<TarifDetail[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.tarifDetailService.find(options);
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<TarifDetail> {
        const foundTarifDetail = await this.tarifDetailService.findOneById(parseInt(id, 10));

        if (!foundTarifDetail) {
            throw new NotFoundException(`TarifDetail '${id}' introuvable`);
        }

        return foundTarifDetail;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() tarifDetail: TarifDetail) {
        return this.tarifDetailService.update(tarifDetail.id, tarifDetail);
    }

    @ApiOperation({ title: 'MàJ TarifDetail' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        tarifDetailId: number,
        @Body() partialEntry: DeepPartial<TarifDetail>
    ) {
        return this.repositoryTarifDetail.save(partialEntry);
    }

    @Delete(':id')
    @Authorized(profils.DEV)
    async remove(
        @Param('id', new ParseIntPipe())
        tarifDetailId: number
    ) {
        return this.tarifDetailService.remove(tarifDetailId);
    }
}
