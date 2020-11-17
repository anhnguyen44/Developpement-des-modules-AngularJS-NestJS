import {Controller, Get, UseInterceptors, Param, Req, Post, Body, Put} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {ApiOperation, ApiUseTags} from '@nestjs/swagger';
import {Authorized} from '../common/decorators/authorized.decorator';
import {StatutCommandeService} from './statut-commande.service';
import {StatutCommande} from './statut-commande.entity';
import {GenerationService} from '../generation/generation.service';

@ApiUseTags('statut-commande')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'statut-commande'))

export class StatutCommandeController {

    constructor(
        private statutCommandeService: StatutCommandeService,
        private generationService: GenerationService
    ){}

    @ApiOperation({title: 'Récupération de tous les statutCommande'})
    @Get()
    @Authorized()
    async getAll() {
        return await this.statutCommandeService.getAll();
    }

    @ApiOperation({title: 'Récupération nombre satatut commande'})
    @Get('countAll')
    @Authorized()
    async countAll() {
        return await this.statutCommandeService.countAll();
    }

    @ApiOperation({title: 'Récupération d\'un statut commande en fonction de son id'})
    @Get(':idStatutCommande')
    @Authorized()
    async get(@Param() params, @Req() req) {
        return await this.statutCommandeService.get(params.idStatutCommande)
    }

    @ApiOperation({title: 'Création statut Commande'})
    @Post()
    @Authorized()
    async create(@Body() requestBody: StatutCommande, @Req() req) {
        return await  this.statutCommandeService.create(requestBody, req)
    }

    @ApiOperation({title: 'Maj statut commande'})
    @Put()
    @Authorized()
    async update(@Body() requestBody: StatutCommande, @Req() req) {
        return await this.statutCommandeService.update(requestBody, req)
    }
}