import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    UseInterceptors
  } from '@nestjs/common';
  import {FindManyOptions} from 'typeorm';
  import {DeepPartial} from 'typeorm/common/DeepPartial';
  import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';

  import {Authorized} from '../common/decorators/authorized.decorator';
  import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
  import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
  import {apiPath} from '../api';
import { MotifAbandonCommande } from './motif-abandon-commande.entity';
import { IMotifAbandonCommande } from '@aleaac/shared';
import { MotifAbandonCommandeService } from './motif-abandon-commande.service';

  @ApiUseTags('MotifAbandonCommande')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'motif-abandon-commande'))
  export class MotifAbandonCommandeController {
    constructor(private motifAbandonCommandeService: MotifAbandonCommandeService) {}

    @ApiOperation({title: 'Nouveau MotifAbandonCommande'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouveau MotifAbandonCommande.',
      type: MotifAbandonCommande
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: MotifAbandonCommande) {
       // console.log(requestBody);

      try {
        return await this.motifAbandonCommandeService.create(requestBody);
      } catch (err) {
        if (err.message === 'La MotifAbandonCommande existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<MotifAbandonCommande>): Promise<MotifAbandonCommande[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.motifAbandonCommandeService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the motifAbandonCommande
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<MotifAbandonCommande> {
      const isId = this.isNumber(idOrName);
      const foundMotifAbandonCommande = !isId
        ? await this.motifAbandonCommandeService.findOneByName(idOrName)
        : await this.motifAbandonCommandeService.findOneById(parseInt(idOrName, 10));

      if (!foundMotifAbandonCommande) {
        throw new NotFoundException(`MotifAbandonCommande '${idOrName}' introuvable`);
      }

      return foundMotifAbandonCommande;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() motifAbandonCommande: MotifAbandonCommande) {
        // TODO : check droits
        return this.motifAbandonCommandeService.update(motifAbandonCommande.id, motifAbandonCommande);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      motifAbandonCommandeId: number,
      @Body() partialEntry: DeepPartial<MotifAbandonCommande>
    ) {
        // TODO : check droits
        return this.motifAbandonCommandeService.update(motifAbandonCommandeId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      motifAbandonCommandeId: number
    ) {
        // TODO : check droits
        return this.motifAbandonCommandeService.remove(motifAbandonCommandeId);
    }
  }
