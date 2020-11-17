import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { TypeContactChantier } from './type-contact-chantier.entity';
import { TypeContactChantierService } from './type-contact-chantier.service';


  @ApiUseTags('TypeContactChantier')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'type-contact-chantier'))
  export class TypeContactChantierController {
    constructor(private typeContactChantierService: TypeContactChantierService) {}

    @ApiOperation({title: 'Nouvelle typeContactChantier'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle typeContactChantier.',
      type: TypeContactChantier
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: TypeContactChantier) {
       // console.log(requestBody);

      try {
        return await this.typeContactChantierService.create(requestBody);
      } catch (err) {
        if (err.message === 'La typeContactChantier existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<TypeContactChantier>): Promise<TypeContactChantier[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.typeContactChantierService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the typeContactChantier
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<TypeContactChantier> {
      const isId = this.isNumber(idOrName);
      const foundTypeContactChantier = !isId
        ? await this.typeContactChantierService.findOneByName(idOrName)
        : await this.typeContactChantierService.findOneById(parseInt(idOrName, 10));

      if (!foundTypeContactChantier) {
        throw new NotFoundException(`TypeContactChantier '${idOrName}' introuvable`);
      }

      return foundTypeContactChantier;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() typeContactChantier: TypeContactChantier) {
        // TODO : check droits
        return this.typeContactChantierService.update(typeContactChantier.id, typeContactChantier);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      typeContactChantierId: number,
      @Body() partialEntry: DeepPartial<TypeContactChantier>
    ) {
        // TODO : check droits
        return this.typeContactChantierService.update(typeContactChantierId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      typeContactChantierId: number
    ) {
        // TODO : check droits
        return this.typeContactChantierService.remove(typeContactChantierId);
    }
  }
