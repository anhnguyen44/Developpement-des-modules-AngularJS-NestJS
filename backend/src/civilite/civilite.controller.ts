import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
  Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Civilite } from './civilite.entity';
import { CiviliteService } from './civilite.service';

  @ApiUseTags('Civilite')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'civilite'))

  export class CiviliteController {
    constructor(private civiliteService: CiviliteService) {}

    @ApiOperation({title: 'Nouvelle civilité'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle civilité.',
      type: Civilite
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: Civilite) {
       // console.log(requestBody);

      try {
        return await this.civiliteService.create(requestBody);
      } catch (err) {
        if (err.message === 'La civilité existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    // ==============================================
    
    @Get()
    @Authorized()
    @ApiResponse({status: 401, description: 'Formulaire invalide.'})
    async find(@Query() findOptions?: FindManyOptions<Civilite>): Promise<Civilite[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.civiliteService.find(options);
    }
    
    // ==================================================

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    
    /**
     * Duck-Typed Input: could either be an integer for the id or name of the civilite
     */
    @ApiResponse({status: 402, description: 'Formulaire invalide.'})
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<Civilite> {
      const isId = this.isNumber(idOrName);
      const foundCivilite = !isId
        ? await this.civiliteService.findOneByName(idOrName)
        : await this.civiliteService.findOneById(parseInt(idOrName, 10));

      if (!foundCivilite) {
        throw new NotFoundException(`Civilite '${idOrName}' introuvable`);
      }

      return foundCivilite;
    }

    // ===================================================

    @ApiResponse({status: 403, description: 'Formulaire invalide.'})
    @Put()
    @Authorized()
    async fullUpdate(@Body() civilite: Civilite) {
        // TODO : check droits
        return this.civiliteService.update(civilite.id, civilite);
    }

    // ==============================================

    @ApiResponse({status: 404, description: 'Formulaire invalide.'})
    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      civiliteId: number,
      @Body() partialEntry: DeepPartial<Civilite>
    ) {
        // TODO : check droits
        return this.civiliteService.update(civiliteId, partialEntry);
    }

    // =============================================

    @ApiResponse({status: 405, description: 'Formulaire invalide.'})
    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      civiliteId: number
    ) {
        // TODO : check droits
        return this.civiliteService.remove(civiliteId);
    }

    // ===================================================

  }
