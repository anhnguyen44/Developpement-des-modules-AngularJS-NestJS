import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TypeObjectif } from './type-objectif.entity';
import { TypeObjectifService } from './type-objectif.service';


  @ApiUseTags('TypeObjectif')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'type-objectif'))
  export class TypeObjectifController {
    constructor(private typeObjectifService: TypeObjectifService) {}

    @ApiOperation({title: 'Nouvelle typeObjectif'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle typeObjectif.',
      type: TypeObjectif
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: TypeObjectif) {
       // console.log(requestBody);

      try {
        return await this.typeObjectifService.create(requestBody);
      } catch (err) {
        if (err.message === 'La typeObjectif existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TypeObjectif>): Promise<TypeObjectif[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.typeObjectifService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the typeObjectif
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<TypeObjectif> {
      const isId = this.isNumber(idOrName);
      const foundTypeObjectif = !isId
        ? await this.typeObjectifService.findOneByName(idOrName)
        : await this.typeObjectifService.findOneById(parseInt(idOrName, 10));

      if (!foundTypeObjectif) {
        throw new NotFoundException(`TypeObjectif '${idOrName}' introuvable`);
      }

      return foundTypeObjectif;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() typeObjectif: TypeObjectif) {
        // TODO : check droits
        return this.typeObjectifService.update(typeObjectif.id, typeObjectif);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      typeObjectifId: number,
      @Body() partialEntry: DeepPartial<TypeObjectif>
    ) {
        // TODO : check droits
        return this.typeObjectifService.update(typeObjectifId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      typeObjectifId: number
    ) {
        // TODO : check droits
        return this.typeObjectifService.remove(typeObjectifId);
    }
  }
