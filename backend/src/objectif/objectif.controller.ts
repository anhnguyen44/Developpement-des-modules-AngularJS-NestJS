import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
     NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, In } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Objectif } from './objectif.entity';
import { ObjectifService } from './objectif.service';
import { EnumTypeObjectifs } from '@aleaac/shared';


    @ApiUseTags('Objectif')
    @UseInterceptors(LoggingInterceptor, TransformInterceptor)
    @Controller(apiPath(1, 'objectif'))
    export class ObjectifController {
        constructor(private objectifService: ObjectifService) {}

        @ApiOperation({title: 'Nouvelle objectif'})
        @ApiResponse({
            status: 200,
            description: 'Identifiants ok, retourne la nouvelle objectif.',
            type: Objectif
        })
        @ApiResponse({status: 400, description: 'Formulaire invalide.'})
        @Post()
        async create(@Body() requestBody: Objectif) {
            try {
                return await this.objectifService.create(requestBody);
            } catch (err) {
                if (err.message === 'La objectif existe déjà.') {
                    throw new ForbiddenException(err.message);
                } else {
                    throw new InternalServerErrorException(err.message);
                }
            }
        }

        @Get('get-hors-travaux')
        @Authorized()
        async findHorsTravaux(): Promise<Objectif[]> {
            const options: FindManyOptions<Objectif> = {
                where: {
                    idType: EnumTypeObjectifs.CSP
                }
            };
            // const options: FindManyOptions<Objectif> = {
            //     where: {
            //         idMomentObjectif: In([1, 2, 8])
            //     }
            // };
            return this.objectifService.find(options);
        }

        @Get('get-pendant-travaux')
        @Authorized()
        async findPendantTravaux(): Promise<Objectif[]> {
            const options: FindManyOptions<Objectif> = {
                where: {
                    idType: EnumTypeObjectifs.CT
                }
            };
            // const options: FindManyOptions<Objectif> = {
            //     where: {
            //         idMomentObjectif: In([3, 4, 5, 6, 7])
            //     }
            // };
            return this.objectifService.find(options);
        }

        @Get()
        @Authorized()
        async find(@Query() findOptions?: FindManyOptions<Objectif>): Promise<Objectif[]> {
            const options = {
                take: 100,
                skip: 0,
                ...findOptions // overwrite default ones
            };
            return this.objectifService.find(options);
        }

        isNumber(value: string | number): boolean {
            return !isNaN(Number(value.toString()));
        }

        /**
         * Duck-Typed Input: could either be an integer for the id or name of the objectif
         */
        @Get(':idOrName')
        @Authorized()
        async findOne(@Param('idOrName') idOrName): Promise<Objectif> {
            const isId = this.isNumber(idOrName);
            const foundObjectif = !isId
                ? await this.objectifService.findOneByName(idOrName)
                : await this.objectifService.findOneById(parseInt(idOrName, 10));

            if (!foundObjectif) {
                throw new NotFoundException(`Objectif '${idOrName}' introuvable`);
            }

            return foundObjectif;
        }

        @Put()
        @Authorized()
        async fullUpdate(@Body() objectif: Objectif) {
                // TODO : check droits
                return this.objectifService.update(objectif.id, objectif);
        }

        @Patch(':id')
        @Authorized()
        async partialUpdate(
            @Param('id', new ParseIntPipe())
            objectifId: number,
            @Body() partialEntry: DeepPartial<Objectif>
        ) {
                // TODO : check droits
                return this.objectifService.update(objectifId, partialEntry);
        }

        @Delete(':id')
        @Authorized()
        async remove(
            @Param('id', new ParseIntPipe())
            objectifId: number
        ) {
                // TODO : check droits
                return this.objectifService.remove(objectifId);
        }
    }
