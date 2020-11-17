import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Environnement } from './environnement.entity';
import { EnvironnementService } from './environnement.service';


  @ApiUseTags('Environnement')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'environnement'))
  export class EnvironnementController {
    constructor(private environnementService: EnvironnementService) {}

    @ApiOperation({title: 'Nouvelle environnement'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle environnement.',
      type: Environnement
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: Environnement) {
       // console.log(requestBody);

      try {
        return await this.environnementService.create(requestBody);
      } catch (err) {
        if (err.message === 'La environnement existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<Environnement>): Promise<Environnement[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.environnementService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the environnement
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<Environnement> {
      const isId = this.isNumber(idOrName);
      const foundEnvironnement = !isId
        ? await this.environnementService.findOneByName(idOrName)
        : await this.environnementService.findOneById(parseInt(idOrName, 10));

      if (!foundEnvironnement) {
        throw new NotFoundException(`Environnement '${idOrName}' introuvable`);
      }

      return foundEnvironnement;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() environnement: Environnement) {
        // TODO : check droits
        return this.environnementService.update(environnement.id, environnement);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      environnementId: number,
      @Body() partialEntry: DeepPartial<Environnement>
    ) {
        // TODO : check droits
        return this.environnementService.update(environnementId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      environnementId: number
    ) {
        // TODO : check droits
        return this.environnementService.remove(environnementId);
    }
  }
