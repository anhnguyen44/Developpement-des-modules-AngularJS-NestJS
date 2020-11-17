import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TypeBatiment } from './type-batiment.entity';
import { TypeBatimentService } from './type-batiment.service';


  @ApiUseTags('TypeBatiment')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'type-batiment'))
  export class TypeBatimentController {
    constructor(private typeBatimentService: TypeBatimentService) {}

    @ApiOperation({title: 'Nouvelle typeBatiment'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle typeBatiment.',
      type: TypeBatiment
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: TypeBatiment) {
       // console.log(requestBody);

      try {
        return await this.typeBatimentService.create(requestBody);
      } catch (err) {
        if (err.message === 'La typeBatiment existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TypeBatiment>): Promise<TypeBatiment[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.typeBatimentService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the typeBatiment
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<TypeBatiment> {
      const isId = this.isNumber(idOrName);
      const foundTypeBatiment = !isId
        ? await this.typeBatimentService.findOneByName(idOrName)
        : await this.typeBatimentService.findOneById(parseInt(idOrName, 10));

      if (!foundTypeBatiment) {
        throw new NotFoundException(`TypeBatiment '${idOrName}' introuvable`);
      }

      return foundTypeBatiment;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() typeBatiment: TypeBatiment) {
        // TODO : check droits
        return this.typeBatimentService.update(typeBatiment.id, typeBatiment);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      typeBatimentId: number,
      @Body() partialEntry: DeepPartial<TypeBatiment>
    ) {
        // TODO : check droits
        return this.typeBatimentService.update(typeBatimentId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      typeBatimentId: number
    ) {
        // TODO : check droits
        return this.typeBatimentService.remove(typeBatimentId);
    }
  }
