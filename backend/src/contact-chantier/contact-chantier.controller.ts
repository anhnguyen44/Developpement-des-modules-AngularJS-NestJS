import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
   NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ContactChantier } from './contact-chantier.entity';
import { ContactChantierService } from './contact-chantier.service';


  @ApiUseTags('ContactChantier')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'contact-chantier'))
  export class ContactChantierController {
    constructor(private contactChantierService: ContactChantierService) {}

    @ApiOperation({title: 'Nouvelle contactChantier'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle contactChantier.',
      type: ContactChantier
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: ContactChantier) {
       // console.log(requestBody);

      try {
        return await this.contactChantierService.create(requestBody);
      } catch (err) {
        if (err.message === 'La contactChantier existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<ContactChantier>): Promise<ContactChantier[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.contactChantierService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the contactChantier
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<ContactChantier> {
      // const isId = this.isNumber(idOrName);
      const foundContactChantier = await this.contactChantierService.findOneById(parseInt(idOrName, 10));

      if (!foundContactChantier) {
        throw new NotFoundException(`ContactChantier '${idOrName}' introuvable`);
      }

      return foundContactChantier;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() contactChantier: ContactChantier) {
        // TODO : check droits
        return this.contactChantierService.update(contactChantier.id, contactChantier);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      contactChantierId: number,
      @Body() partialEntry: DeepPartial<ContactChantier>
    ) {
        // TODO : check droits
        return this.contactChantierService.update(contactChantierId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      contactChantierId: number
    ) {
        // TODO : check droits
        return this.contactChantierService.remove(contactChantierId);
    }
  }
