import { profils } from '@aleaac/shared/src/models/profil.model';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TypeFacturation } from './type-facturation.entity';
import { TypeFacturationService } from './type-facturation.service';



@ApiUseTags('type-facturation')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'type-facturation'))
export class TypeFacturationController {
    constructor(
        private readonly typeFacturationService: TypeFacturationService,
        @InjectRepository(TypeFacturation)
        private readonly repositoryTypeFacturation: Repository<TypeFacturation>,
    ) { }

    @ApiOperation({ title: 'Nouveau TypeFacturation' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau TypeFacturation.',
        type: TypeFacturation
    })
    @ApiResponse({ status: 400, description: 'Le TypeFacturation existe déjà.' })
    @Post()
    async create(@Body() requestBody: TypeFacturation) {
         // console.log('Create TypeFacturation');
         // console.log(requestBody);
        try {
            return await this.typeFacturationService.create(requestBody);
        } catch (err) {
            if (err.message === 'Le TypeFacturation existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('page/:parPage/:nbPage')
    @Authorized(profils.DEV)
    async getPage(@Param('parPage', new ParseIntPipe()) parPage: number,
     @Param('nbPage', new ParseIntPipe()) nbPage: number): Promise<TypeFacturation[]> {
      const options = {
        take: parPage,
        skip: (nbPage - 1) * parPage,
      };
      return this.typeFacturationService.find(options);
    }

    @Get('countAll')
    @Authorized(profils.DEV)
    async countAll(): Promise<number> {
      return this.repositoryTypeFacturation.count();
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TypeFacturation>): Promise<TypeFacturation[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.typeFacturationService.find(options);
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<TypeFacturation> {
        const foundTypeFacturation = await this.typeFacturationService.findOneById(parseInt(id, 10));

        if (!foundTypeFacturation) {
            throw new NotFoundException(`TypeFacturation '${id}' introuvable`);
        }

        return foundTypeFacturation;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() typeFacturation: TypeFacturation) {
        return this.typeFacturationService.update(typeFacturation.id, typeFacturation);
    }

    @ApiOperation({ title: 'MàJ TypeFacturation' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        TypeFacturationId: number,
        @Body() partialEntry: DeepPartial<TypeFacturation>
    ) {
        return this.repositoryTypeFacturation.save(partialEntry);
    }

    @Delete(':id')
    @Authorized(profils.DEV)
    async remove(
        @Param('id', new ParseIntPipe())
        TypeFacturationId: number
    ) {
        return this.typeFacturationService.remove(TypeFacturationId);
    }
}
