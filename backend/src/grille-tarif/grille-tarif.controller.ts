import { profils, EnumTypeDevis } from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UnauthorizedException, Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { GrilleTarif } from './grille-tarif.entity';
import { GrilleTarifService } from './grille-tarif.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';
import { HistoriqueService } from '../historique/historique.service';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Rights } from '../common/decorators/rights.decorator';
import { userInfo } from 'os';

@ApiUseTags('grille-tarif')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'grille-tarif'))
export class GrilleTarifController {
    constructor(
        private readonly grilleTarifTarifService: GrilleTarifService,
        @InjectRepository(GrilleTarif)
        private readonly repositoryGrilleTarif: Repository<GrilleTarif>,
        @InjectRepository(TarifDetail)
        private readonly repositoryTarifDetail: Repository<TarifDetail>,
        private readonly historiqueService: HistoriqueService,
        private readonly utilisateurService: UtilisateurService
    ) { }

    @ApiOperation({ title: 'Duplique un grille existante.' })
    @ApiResponse({
        status: 200,
        description: 'OK.',
    })
    @Authorized()
    @Rights(['GRILLE_CREATE'])
    @Post('duplicate')
    async duplicate(@Body() requestBody: any, @CurrentUtilisateur() user: CUtilisateur): Promise<GrilleTarif> {
        // console.log('Duplicate GrilleTarif');
        try {
            const grille = await this.grilleTarifTarifService.findOneById(requestBody.idFrom);
            if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_CREATE'], grille.idFranchise)) {
                throw new UnauthorizedException();
            }
            const hasFranchise = () => user.profils.some(role => grille.idFranchise.toString().indexOf(role.franchise.id.toString()) > -1);
            if (hasFranchise) {
                const result = await this.grilleTarifTarifService.duplicate(grille, requestBody.reference);
                this.historiqueService.add(user.id, 'grille-tarif', result.id,
                'Création de la grille tarif : ' + requestBody.reference + '(' + result.id + ') depuis '
                + grille.reference);
                return result;
            } else {
                throw new UnauthorizedException();
            }
        } catch (err) {
            if (err.message === 'Le GrilleTarif existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({ title: 'Nouveau GrilleTarif' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau GrilleTarif.',
        type: GrilleTarif
    })
    @ApiResponse({ status: 400, description: 'Le GrilleTarif existe déjà.' })
    @Post()
    @Rights(['GRILLE_CREATE'])
    async create(@Body() requestBody: GrilleTarif, @CurrentUtilisateur() user) {
        // console.log('Create GrilleTarif');
        // console.log(requestBody);
        try {
            if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_CREATE'],
            requestBody.franchise ? requestBody.franchise.id : requestBody.idFranchise)) {
                throw new UnauthorizedException();
            }

            const result = await this.grilleTarifTarifService.create(requestBody);
            this.historiqueService.add(user.id, 'grille-tarif', result.id,
                'Création de la grille tarif : ' + requestBody.reference + '(' + result.id + ')');
            return result;
        } catch (err) {
            if (err.message === 'Le GrilleTarif existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({ title: 'Crée ou met à jour les arborescences des tarifs publics ou déjà créés.' })
    @ApiResponse({
        status: 200,
        description: 'OK.',
    })
    @Post('init-grilles-franchise')
    @Authorized([profils.ADMIN, profils.SUPER_ADMIN, profils.DEV])
    async initGrilles(@Body() requestBody: any) {
        // console.log('Create GrilleTarif');
        // console.log(requestBody);
        try {
            return await this.grilleTarifTarifService.initGrillesFranchise(requestBody.idFranchise);
        } catch (err) {
            if (err.message === 'Le GrilleTarif existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get('page/:parPage/:nbPage')
    @Authorized()
    async getPage(@Param('parPage', new ParseIntPipe()) parPage: number,
        @Param('nbPage', new ParseIntPipe()) nbPage: number): Promise<GrilleTarif[]> {
        const options = {
            take: parPage,
            skip: (nbPage - 1) * parPage,
        };
        return this.grilleTarifTarifService.find(options);
    }

    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@CurrentUtilisateur() user, @Param() params, @Req() req): Promise<number> {
        if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_SEE'], params.idFranchise)) {
            throw new UnauthorizedException();
        }
        return this.grilleTarifTarifService.countAll(params.idFranchise, req.query);
    }

    @ApiOperation({ title: 'Récupération de toute les grilles d\'une franchise' })
    @Get('all/:idFranchise')
    @Authorized()
    async getAll(@CurrentUtilisateur() user, @Param() params, @Req() req) {
        if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_SEE'], params.idFranchise)) {
            throw new UnauthorizedException();
        }
        let result =  await this.grilleTarifTarifService.getAll(params.idFranchise, req.query);

        if (!this.utilisateurService.hasRightOnFranchise(user, ['TMP_ACT_PILOTE'], params.idFranchise)) {
            result = result.filter(g => g.idTypeGrille === EnumTypeDevis.LABO.valueOf());
        }
        return result;
    }

    @ApiOperation({ title: 'Récupération de toute les grilles publiques d\'une franchise pour le devis' })
    @Get('public-devis/:idFranchise')
    @Authorized()
    async getPublicDevis(@CurrentUtilisateur() user, @Param() params) {
        return await this.grilleTarifTarifService.getPublic(params.idFranchise);
    }

    // du coup ça c'est pour le labo
    @ApiOperation({ title: 'Récupération de toute les grilles publiques d\'une franchise' })
    @Get('public/:idFranchise')
    @Authorized()
    async getPublic(@CurrentUtilisateur() user, @Param() params) {
        let result = await this.grilleTarifTarifService.getPublic(params.idFranchise);

        if (!this.utilisateurService.hasRightOnFranchise(user, ['TMP_ACT_PILOTE'], params.idFranchise)) {
            result = result.filter(g => g.idTypeGrille === EnumTypeDevis.LABO.valueOf());
        }
        return result;
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<GrilleTarif>): Promise<GrilleTarif[]> {
        const options = {
            ...findOptions // overwrite default ones
        };
        return this.grilleTarifTarifService.find(options);
    }

    @Get(':id')
    @Authorized()
    async findOne(@Param('id') id, @CurrentUtilisateur() user): Promise<GrilleTarif> {
        const grille = await this.grilleTarifTarifService.findOneById(parseInt(id, 10));

        if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_SEE'], grille.idFranchise)) {
            throw new UnauthorizedException();
        }

        if (!grille) {
            throw new NotFoundException(`GrilleTarif '${id}' introuvable`);
        }

        return grille;
    }

    @Put()
    @Authorized()
    async fullUpdate(@CurrentUtilisateur() user, @Body() grilleTarifTarif: GrilleTarif) {
        if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_SEE'], grilleTarifTarif.idFranchise)) {
            throw new UnauthorizedException();
        }
        return this.grilleTarifTarifService.update(grilleTarifTarif.id, grilleTarifTarif);
    }

    @ApiOperation({ title: 'MàJ GrilleTarif' })
    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        grilleTarifId: number,
        @Body() partialEntry: DeepPartial<GrilleTarif>,
        @CurrentUtilisateur() user
    ) {
        let descHistorique = '';
        const old = await this.findOne(partialEntry.id, user);

        if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_CREATE'], old.idFranchise)) {
            throw new UnauthorizedException();
        }

        if (partialEntry.reference && partialEntry.reference.length > 0 && old.reference !== partialEntry.reference) {
            // tslint:disable-next-line: quotemark
            descHistorique += 'La référence du tarif a changé : ' + old.reference + ' => ' + partialEntry.reference + '.' + "\n";
        }
        if (partialEntry.conditions && partialEntry.conditions.length > 0 && old.conditions !== partialEntry.conditions) {
            // tslint:disable-next-line: quotemark
            descHistorique += 'Les conditions du tarif ont changé : "' + old.conditions + '" => "' + partialEntry.conditions + '".' + "\n";
        }
        if (partialEntry.commentaire && partialEntry.commentaire.length > 0 && old.commentaire !== partialEntry.commentaire) {
            // tslint:disable-next-line: quotemark
            descHistorique += 'Le commentaire du tarif a changé : "' + old.commentaire + '" => "' + partialEntry.commentaire + '".' + "\n";
        }

        if (partialEntry.details) {
            for (const newDetail of partialEntry.details) {
                const oldDetail = await this.repositoryTarifDetail.findOne(newDetail.id);
                if (oldDetail.prixUnitaire !== newDetail.prixUnitaire) {
                    descHistorique += 'Le prix unitaire du produit ' + oldDetail.produit.nom + ' a changé : "'
                        // tslint:disable-next-line: quotemark
                        + oldDetail.prixUnitaire + '" => "' + newDetail.prixUnitaire + '" (idTarifDetail = ' + oldDetail.id + ').' + "\n";
                }
                if (oldDetail.produit.hasTemps && oldDetail.tempsUnitaire !== newDetail.tempsUnitaire) {
                    descHistorique += 'Le temps unitaire du produit ' + oldDetail.produit.nom + ' a changé : "'
                        // tslint:disable-next-line: quotemark
                        + oldDetail.tempsUnitaire + '" => "' + newDetail.tempsUnitaire + '" (idTarifDetail = ' + oldDetail.id + ').' + "\n";
                }
                if (oldDetail.produit.hasTemps && oldDetail.uniteTemps !== newDetail.uniteTemps) {
                    descHistorique += 'L\'unité de tempsdu produit ' + oldDetail.produit.nom + ' a changé : "'
                        // tslint:disable-next-line: quotemark
                        + oldDetail.uniteTemps + '" => "' + newDetail.uniteTemps + '" (idTarifDetail = ' + oldDetail.id + ').' + "\n";
                }
            }
            await this.repositoryTarifDetail.save(partialEntry.details);
        }

        if (descHistorique.length > 0) {
            this.historiqueService.add(user.id, 'grille-tarif', partialEntry.id, descHistorique);
        }
        return this.repositoryGrilleTarif.save(partialEntry);
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParseIntPipe())
        grilleTarifId: number,
        @CurrentUtilisateur() user
    ) {
        const grille = await this.repositoryGrilleTarif.findOne(grilleTarifId);
        // Grille publique = pas suppr
        if (grille.isGrillePublique) {
            throw new UnauthorizedException();
        }

        // Faut le droit sur la frnchise
        if (!this.utilisateurService.hasRightOnFranchise(user, ['GRILLE_CREATE'], grille.idFranchise)) {
            throw new UnauthorizedException();
        }
        this.historiqueService.add(user.id, 'grille-tarif', grilleTarifId, 'Suppression de la grille : ' + grille.reference);
        return this.grilleTarifTarifService.remove(grilleTarifId);
    }
}
