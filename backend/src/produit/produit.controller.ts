import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository, In } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Produit } from './produit.entity';
import { ProduitService } from './produit.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Rights } from '../common/decorators/rights.decorator';
import { HistoriqueService } from '../historique/historique.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { EnumTypeDevis, TypeProduit } from '@aleaac/shared';
import { TypeGrilleService } from '../type-grille/type-grille.service';


@ApiUseTags('Produits')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'produit'))
export class ProduitController {
    constructor(
        private readonly produitService: ProduitService,
        @InjectRepository(Produit)
        private readonly repositoryProduit: Repository<Produit>,
        private historiqueService: HistoriqueService,
        private utilisateurService: UtilisateurService,
        private typeGrilleService: TypeGrilleService
    ) { }

    @ApiOperation({ title: 'Nouveau produit' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau produit.',
        type: Produit
    })
    @ApiResponse({ status: 400, description: 'Le produit existe déjà.' })
    @Post()
    @Authorized()
    @Rights(['PRODUCTS_CREATE_ALL', 'PRODUCTS_CREATE_FRANCHISE'])
    async create(@Body() requestBody: Produit, @Req() request) {
        // console.log('Create produit');
        // console.log(requestBody);
        try {
            const prd = await this.produitService.create(requestBody);
            await this.historiqueService.add(request.user.id, 'produit', prd.id, 'Création du produit');
            return prd;
        } catch (err) {
            if (err.message === 'Le produit existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('page')
    @Authorized()
    async getPage(@CurrentUtilisateur() user, @Req() req): Promise<Produit[]> {
        if (!this.utilisateurService.hasRight(user, ['TMP_ACT_PILOTE'])) {
            const typeGrilleLabo = await this.typeGrilleService.findOneById(EnumTypeDevis.LABO);
            const idTypesProduitsAutorises: Array<number> = new Array<number>();

            if (typeGrilleLabo && typeGrilleLabo.categories) {
                for (const categ of typeGrilleLabo.categories) {
                    idTypesProduitsAutorises.push(categ.id);
                }
            }
            return await this.produitService.find(req.query, idTypesProduitsAutorises);
        } else {
            return this.produitService.find(req.query);
        }
    }

    @Get('countAll')
    @Authorized()
    @Rights(['PRODUCTS_CREATE_ALL'])
    async countAll(@Req() req): Promise<number> {
        return await this.produitService.count(req.query);
    }

    @Get('typeFormation')
    @Authorized()
    @Rights(['PRODUCTS_CREATE_ALL'])
    async getProduitsTypeFormation(@Req() req): Promise<Produit[]> {
        return await this.produitService.getProduitsTypeFormation();
    }

    @Get()
    @Authorized()
    async find(@CurrentUtilisateur() user, @Req() req) {
        if (!this.utilisateurService.hasRight(user, ['TMP_ACT_PILOTE'])) {
            const typeGrilleLabo = await this.typeGrilleService.findOneById(EnumTypeDevis.LABO);
            const idTypesProduitsAutorises: Array<number> = new Array<number>();

            if (typeGrilleLabo && typeGrilleLabo.categories) {
                for (const categ of typeGrilleLabo.categories) {
                    idTypesProduitsAutorises.push(categ.id);
                }
            }
            return await this.produitService.find(req.query, idTypesProduitsAutorises);
        } else {
            return await this.produitService.find(req.query);
        }
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id): Promise<Produit> {
        const foundProduit = await this.produitService.findOneById(parseInt(id, 10));

        if (!foundProduit) {
            throw new NotFoundException(`Produit '${id}' introuvable`);
        }

        return foundProduit;
    }

    @Put()
    @Authorized()
    @Rights(['PRODUCTS_CREATE_ALL', 'PRODUCTS_CREATE_FRANCHISE'])
    async fullUpdate(@Body() produit: Produit, @Req() request) {
        const oldProduit = await this.repositoryProduit.findOne(produit.id);
        const prd = this.produitService.update(produit.id, produit);
        try {
            await this.historiqueService.add(request.user.id, 'produit', produit.id,
                'Produit entièrement remplacé. ' + JSON.stringify(oldProduit) + ' => ' + JSON.stringify(produit));
        } catch (err) {
            console.error(err);
        }
        return prd;
    }

    @ApiOperation({ title: 'MàJ produit' })
    @Patch(':id')
    @Authorized()
    @Rights(['PRODUCTS_CREATE_ALL', 'PRODUCTS_CREATE_FRANCHISE'])
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        produitId: number,
        @Body() partialEntry: DeepPartial<Produit>,
        @Req() request
    ) {
        const oldProduit = await this.repositoryProduit.findOne(produitId);

        if (partialEntry.prixUnitaire && oldProduit.prixUnitaire !== partialEntry.prixUnitaire) {
            try {
                await this.historiqueService.add(request.user.id, 'produit', produitId,
                    'Prix modifié : ' + oldProduit.prixUnitaire + ' => ' + partialEntry.prixUnitaire);
            } catch (err) {
                console.error(err);
            }
        }

        if (partialEntry.code && oldProduit.code !== partialEntry.code) {
            try {
                await this.historiqueService.add(request.user.id, 'produit', produitId,
                    'Code modifié : ' + oldProduit.code + ' => ' + partialEntry.code);
            } catch (err) {
                console.error(err);
            }
        }

        if (partialEntry.type && oldProduit.type.id !== partialEntry.type.id) {
            try {
                await this.historiqueService.add(request.user.id, 'produit', produitId,
                    'Type modifié : ' + oldProduit.type.nom + ' => ' + partialEntry.type.nom);
            } catch (err) {
                console.error(err);
            }
        }

        const prd = this.repositoryProduit.save(partialEntry);
        return prd;
    }

    @Delete(':id')
    @Authorized()
    @Rights(['PRODUCTS_CREATE_ALL', 'PRODUCTS_CREATE_FRANCHISE'])
    async remove(
        @Param('id', new ParseIntPipe())
        produitId: number,
        @Req() request
    ) {
        const oldProduit = await this.repositoryProduit.findOne(produitId);
        try {
            await this.historiqueService.add(request.user.id, 'produit', produitId,
                'Produit supprimé : ' + JSON.stringify(oldProduit));
        } catch (err) {
            console.error(err);
        }
        return this.produitService.remove(produitId);
    }
}
