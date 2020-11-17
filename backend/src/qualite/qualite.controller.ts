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
import { Qualite } from './qualite.entity';
import { IQualite } from '@aleaac/shared';
import { QualiteService } from './qualite.service';

  @ApiUseTags('Qualite')
  @UseInterceptors(LoggingInterceptor, TransformInterceptor)
  @Controller(apiPath(1, 'qualite'))
  export class QualiteController {
    constructor(private qualiteService: QualiteService) {}

    @ApiOperation({title: 'Nouvelle qualité'})
    @ApiResponse({
      status: 200,
      description: 'Identifiants ok, retourne la nouvelle qualité.',
      type: Qualite
    })
    @ApiResponse({status: 400, description: 'Formulaire invalide.'})
    @Post()
    async create(@Body() requestBody: Qualite) {
       // console.log(requestBody);

      try {
        return await this.qualiteService.create(requestBody);
      } catch (err) {
        if (err.message === 'La qualité existe déjà.') {
          throw new ForbiddenException(err.message);
        } else {
          throw new InternalServerErrorException(err.message);
        }
      }
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<Qualite>): Promise<Qualite[]> {
      const options = {
        take: 100,
        skip: 0,
        ...findOptions // overwrite default ones
      };
      return this.qualiteService.find(options);
    }

    isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the qualite
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<Qualite> {
      const isId = this.isNumber(idOrName);
      const foundQualite = !isId
        ? await this.qualiteService.findOneByName(idOrName)
        : await this.qualiteService.findOneById(parseInt(idOrName, 10));

      if (!foundQualite) {
        throw new NotFoundException(`Qualite '${idOrName}' introuvable`);
      }

      return foundQualite;
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() qualite: Qualite) {
        // TODO : check droits
        return this.qualiteService.update(qualite.id, qualite);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
      @Param('id', new ParseIntPipe())
      qualiteId: number,
      @Body() partialEntry: DeepPartial<Qualite>
    ) {
        // TODO : check droits
        return this.qualiteService.update(qualiteId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
      @Param('id', new ParseIntPipe())
      qualiteId: number
    ) {
        // TODO : check droits
        return this.qualiteService.remove(qualiteId);
    }
  }
