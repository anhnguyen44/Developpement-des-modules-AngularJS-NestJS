import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { MomentObjectif } from './moment-objectif.entity';
import { MomentObjectifService } from './moment-objectif.service';


  @ApiUseTags('MomentObjectif')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'moment-objectif'))
  export class MomentObjectifController {
    constructor(private momentObjectifService: MomentObjectifService) {}

    @ApiOperation({title: 'Nouvelle momentObjectif'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle momentObjectif.',
      type: MomentObjectif
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: MomentObjectif) {
       // console.log(requestBody);

      try {
        return await this.momentObjectifService.create(requestBody);
      } catch (err) {
        if (err.message === 'La momentObjectif existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<MomentObjectif>): Promise<MomentObjectif[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.momentObjectifService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Momentd Input: could either be an integer for the id or name of the momentObjectif
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<MomentObjectif> {
      const isId = this.isNumber(idOrName);
      const foundMomentObjectif = !isId
        ? await this.momentObjectifService.findOneByName(idOrName)
        : await this.momentObjectifService.findOneById(parseInt(idOrName, 10));

      if (!foundMomentObjectif) {
        throw new NotFoundException(`MomentObjectif '${idOrName}' introuvable`);
      }

      return foundMomentObjectif;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() momentObjectif: MomentObjectif) {
        // TODO : check droits
        return this.momentObjectifService.update(momentObjectif.id, momentObjectif);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      momentObjectifId: number,
      @Body() partialEntry: DeepPartial<MomentObjectif>
    ) {
        // TODO : check droits
        return this.momentObjectifService.update(momentObjectifId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      momentObjectifId: number
    ) {
        // TODO : check droits
        return this.momentObjectifService.remove(momentObjectifId);
    }
  }
