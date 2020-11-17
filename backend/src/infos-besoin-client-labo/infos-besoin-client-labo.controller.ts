import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { InfosBesoinClientLabo } from './infos-besoin-client-labo.entity';
import { InfosBesoinClientLaboService } from './infos-besoin-client-labo.service';


  @ApiUseTags('InfosBesoinClientLabo')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'infos-besoin-client-labo'))
  export class InfosBesoinClientLaboController {
    constructor(private besoinClientLaboService: InfosBesoinClientLaboService) {}

    @ApiOperation({title: 'Nouvelle Besoin client labo'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle Besoin client labo.',
      type: InfosBesoinClientLabo
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: InfosBesoinClientLabo) {
       // console.log(requestBody);

      try {
        return await this.besoinClientLaboService.create(requestBody);
      } catch (err) {
        if (err.message === 'La Besoin client labo existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get('by-besoin/:id')
    @Authorized()
    async findByBesoin(@Param('id') id): Promise<InfosBesoinClientLabo[]> {
      const options: FindManyOptions<InfosBesoinClientLabo> = {
        where: {
          idBesoinClientLabo: id
        }
      }
      const foundInfosBesoinClientLabo = await this.besoinClientLaboService.find(options);

      if (!foundInfosBesoinClientLabo) {
        throw new NotFoundException(`InfosBesoinClientLabo '${id}' introuvable`);
      }

      return foundInfosBesoinClientLabo;
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<InfosBesoinClientLabo>): Promise<InfosBesoinClientLabo[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.besoinClientLaboService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<InfosBesoinClientLabo> {
      const foundInfosBesoinClientLabo = await this.besoinClientLaboService.findOneById(parseInt(id, 10));

      if (!foundInfosBesoinClientLabo) {
        throw new NotFoundException(`InfosBesoinClientLabo '${id}' introuvable`);
      }

      return foundInfosBesoinClientLabo;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() besoinClientLabo: InfosBesoinClientLabo) {
        // TODO : check droits
        return this.besoinClientLaboService.update(besoinClientLabo.id, besoinClientLabo);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      besoinClientLaboId: number,
      @Body() partialEntry: DeepPartial<InfosBesoinClientLabo>
    ) {
        // TODO : check droits
        return this.besoinClientLaboService.update(besoinClientLaboId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      besoinClientLaboId: number
    ) {
        // TODO : check droits
        return this.besoinClientLaboService.remove(besoinClientLaboId);
    }
  }
