import { profils } from '@aleaac/shared/src/models/profil.model';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
    Param, ParseIntPipe, Patch, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { Rights } from '../common/decorators/rights.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Droit } from './droit.entity';
import { DroitService } from './droit.service';


@ApiUseTags('Droit')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'droit'))
export class DroitController {
    constructor(private droitService: DroitService,
        @InjectRepository(Droit)
        private readonly droitRepository: Repository<Droit>,
    ) { }

    @ApiOperation({ title: 'nouveau droit' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouveau droit.',
        type: Droit
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post()
    @Rights('RIGHTS_CREATE')
    async create(@Body() requestBody: Droit) {
         // console.log(requestBody);

        try {
            return await this.droitService.create(requestBody);
        } catch (err) {
            if (err.message === 'La droit existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('droitformenu')
    @Authorized()
    async getDroitForMenu(): Promise<Droit[]> {
      return this.droitService.getDroitForMenu();
    }

    @Get('page')
    @Authorized(profils.DEV)
    async getPage(@Req() req): Promise<Droit[]> {
        return this.droitService.find(req.query);
    }

    @Get('countAll')
    @Authorized(profils.DEV)
    async countAll(@Req() req): Promise<number> {
        return this.droitService.count(req.query);
    }

    @Get()
    @Authorized()
    async find(): Promise<Droit[]> {
        return this.droitService.find();
    }

    isNumber(value: string | number): boolean {
        return !isNaN(Number(value.toString()));
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or name of the droit
     */
    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<Droit> {
        const isId = this.isNumber(idOrName);
        const foundDroit = !isId
            ? await this.droitService.findOneByName(idOrName)
            : await this.droitService.findOneById(parseInt(idOrName, 10));

        if (!foundDroit) {
            throw new NotFoundException(`Droit '${idOrName}' introuvable`);
        }

        return foundDroit;
    }

    @Put()
    @Authorized()
    @Rights('RIGHTS_CREATE')
    async fullUpdate(@Body() droit: Droit) {
        // TODO : check droits
        return this.droitService.update(droit.id, droit);
    }

    @Patch(':id')
    @Authorized()
    @Rights('RIGHTS_CREATE')
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        droitId: number,
        @Body() partialEntry: DeepPartial<Droit>
    ) {
        // TODO : check droits
        return this.droitService.update(droitId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    @Rights('RIGHTS_CREATE')
    async remove(
        @Param('id', new ParseIntPipe())
        droitId: number
    ) {
        // TODO : check droits
        return this.droitService.remove(droitId);
    }
}
