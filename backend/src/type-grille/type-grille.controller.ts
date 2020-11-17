import { ITypeGrille } from '@aleaac/shared';
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
import { TypeGrille } from './type-grille.entity';
import { TypeGrilleService } from './type-grille.service';

import { InjectRepository } from '@nestjs/typeorm';
import { profils } from '@aleaac/shared/src/models/profil.model';


@ApiUseTags('type-grille')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-grille'))
export class TypeGrilleController {
    constructor(
        private readonly typeGrilleService: TypeGrilleService,
        @InjectRepository(TypeGrille)
        private readonly repositoryTypeGrille: Repository<TypeGrille>,
    ) { }

    @ApiOperation({ title: 'Nouveau TypeGrille' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau TypeGrille.',
        type: TypeGrille
    })
    @ApiResponse({ status: 400, description: 'Le TypeGrille existe déjà.' })
    @Post()
    async create(@Body() requestBody: TypeGrille) {
         // console.log('Create TypeGrille');
         // console.log(requestBody);
        try {
            return await this.typeGrilleService.create(requestBody);
        } catch (err) {
            if (err.message === 'Le TypeGrille existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('page/:parPage/:nbPage')
    @Authorized(profils.DEV)
    async getPage(@Param('parPage', new ParseIntPipe()) parPage: number,
     @Param('nbPage', new ParseIntPipe()) nbPage: number): Promise<TypeGrille[]> {
      const options = {
        take: parPage,
        skip: (nbPage - 1) * parPage,
      };
      return this.typeGrilleService.find(options);
    }

    @Get('countAll')
    @Authorized(profils.DEV)
    async countAll(): Promise<number> {
      return this.repositoryTypeGrille.count();
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TypeGrille>): Promise<TypeGrille[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.typeGrilleService.find(options);
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<TypeGrille> {
        const foundTypeGrille = await this.typeGrilleService.findOneById(parseInt(id, 10));

        if (!foundTypeGrille) {
            throw new NotFoundException(`TypeGrille '${id}' introuvable`);
        }

        return foundTypeGrille;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() typeGrille: TypeGrille) {
        return this.typeGrilleService.update(typeGrille.id, typeGrille);
    }

    @ApiOperation({ title: 'MàJ TypeGrille' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        TypeGrilleId: number,
        @Body() partialEntry: DeepPartial<TypeGrille>
    ) {
        return this.repositoryTypeGrille.save(partialEntry);
    }

    @Delete(':id')
    @Authorized(profils.DEV)
    async remove(
        @Param('id', new ParseIntPipe())
        TypeGrilleId: number
    ) {
        return this.typeGrilleService.remove(TypeGrilleId);
    }
}
