import {
  Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
  NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, In } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Batiment } from './batiment.entity';
import { BatimentService } from './batiment.service';
import { SitePrelevementService } from '../site-prelevement/site-prelevement.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { FichierService } from '../fichier/fichier.service';


@ApiUseTags('Batiment')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'batiment'))
export class BatimentController {
  constructor(
    private batimentService: BatimentService,
    private sitePrelevementService: SitePrelevementService,
    private fichierService: FichierService,
  ) { }

  @ApiOperation({ title: 'Nouvelle Batiment' })
  @ApiResponse({
    status: 200,
    description: 'Identifiants ok, retourne la nouvelle Batiment.',
    type: Batiment
  })
  @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
  @Post()
  async create(@Body() requestBody: any) {
    // console.log(requestBody);

    try {
      return await this.batimentService.create(requestBody.batiment);
    } catch (err) {
      if (err.message === 'La Batiment existe déjà.') {
        throw new ForbiddenException(err.message);
      } else {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  @Get('by-chantier/:id')
  @Authorized()
  async findByIdChantier(@Param('id') id): Promise<Batiment[]> {
    const foundSitesPrelevement = (await this.sitePrelevementService.findByChantier(parseInt(id, 10), '')).map(x => x.id);

    return this.find({
      where: {
        idSitePrelevement: In(foundSitesPrelevement)
      }
    });
  }

  @Get('by-site-prelevement/:id')
  @Authorized()
  async findByIdSitePrelevement(@Param('id') id): Promise<Batiment[]> {
    const foundSitePrelevement = await this.sitePrelevementService.findOneById(parseInt(id, 10));

    if (!foundSitePrelevement) {
      throw new NotFoundException(`Site Prélèvements '${id}' introuvable`);
    }

    return foundSitePrelevement.batiments;
  }

  @Get()
  @Authorized()
  async find(@Query() findOptions?: FindManyOptions<Batiment>): Promise<Batiment[]> {
    const options = {
      take: 100,
      skip: 0,
      ...findOptions // overwrite default ones
    };
    return this.batimentService.find(options);
  }

  isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
  }

  @Get(':idOrName')
  @Authorized()
  async findOne(@Param('idOrName') idOrName): Promise<Batiment> {
    const isId = this.isNumber(idOrName);
    const foundBatiment = !isId
      ? await this.batimentService.findOneByName(idOrName)
      : await this.batimentService.findOneById(parseInt(idOrName, 10));

    if (!foundBatiment) {
      throw new NotFoundException(`Batiment '${idOrName}' introuvable`);
    }

    return foundBatiment;
  }

  @Put()
  @Authorized()
  async fullUpdate(@Body() batiment: Batiment) {
    // TODO : check droits
    return this.batimentService.update(batiment.id, batiment);
  }

  @Patch(':id')
  @Authorized()
  async partialUpdate(
    @Param('id', new ParseIntPipe())
    batimentId: number,
    @Body() partialEntry: DeepPartial<Batiment>
  ) {
    // TODO : check droits
    if (partialEntry.typeBatiment && partialEntry.idTypeBatiment) {
      delete partialEntry.typeBatiment;
    }
    return this.batimentService.update(batimentId, partialEntry);
  }

  @Delete(':id')
  @Authorized()
  async remove(
    @Param('id', new ParseIntPipe()) batimentId: number,
    @CurrentUtilisateur() user
  ) {
    // TODO : check droits
    // Delete pieces jointes
    const fichiersLies = await this.fichierService.getAll('site-prelevement', batimentId);
    for (const fichier of fichiersLies) {
      this.fichierService.delete(fichier.id, user);
    }
    return this.batimentService.remove(batimentId);
  }
}
