import { ITypeProduit } from '@aleaac/shared';
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
import { TypeProduit } from './type-produit.entity';
import { TypeProduitService } from './type-produit.service';

import { InjectRepository } from '@nestjs/typeorm';
import { profils } from '@aleaac/shared/src/models/profil.model';


@ApiUseTags('type-produit')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-produit'))
export class TypeProduitController {
    constructor(
        private readonly typeProduitService: TypeProduitService,
        @InjectRepository(TypeProduit)
        private readonly repositoryTypeProduit: Repository<TypeProduit>,
    ) { }

    @ApiOperation({ title: 'Nouveau TypeProduit' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau TypeProduit.',
        type: TypeProduit
    })
    @ApiResponse({ status: 400, description: 'Le TypeProduit existe déjà.' })
    @Post()
    async create(@Body() requestBody: TypeProduit) {
         // console.log('Create TypeProduit');
         // console.log(requestBody);
        try {
            return await this.typeProduitService.create(requestBody);
        } catch (err) {
            if (err.message === 'Le TypeProduit existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('page/:parPage/:nbPage')
    @Authorized(profils.DEV)
    async getPage(@Param('parPage', new ParseIntPipe()) parPage: number,
     @Param('nbPage', new ParseIntPipe()) nbPage: number): Promise<TypeProduit[]> {
      const options = {
        take: parPage,
        skip: (nbPage - 1) * parPage,
      };
      return this.typeProduitService.find(options);
    }

    @Get('countAll')
    @Authorized(profils.DEV)
    async countAll(): Promise<number> {
      return this.repositoryTypeProduit.count();
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TypeProduit>): Promise<TypeProduit[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.typeProduitService.find(options);
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<TypeProduit> {
        const foundTypeProduit = await this.typeProduitService.findOneById(parseInt(id, 10));

        if (!foundTypeProduit) {
            throw new NotFoundException(`TypeProduit '${id}' introuvable`);
        }

        return foundTypeProduit;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() typeProduit: TypeProduit) {
        return this.typeProduitService.update(typeProduit.id, typeProduit);
    }

    @ApiOperation({ title: 'MàJ TypeProduit' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        TypeProduitId: number,
        @Body() partialEntry: DeepPartial<TypeProduit>
    ) {
        return this.repositoryTypeProduit.save(partialEntry);
    }

    @Delete(':id')
    @Authorized(profils.DEV)
    async remove(
        @Param('id', new ParseIntPipe())
        TypeProduitId: number
    ) {
        return this.typeProduitService.remove(TypeProduitId);
    }
}
