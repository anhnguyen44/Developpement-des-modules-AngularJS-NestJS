import { IFranchise } from '@aleaac/shared';
import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException, Param,
    ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, UnauthorizedException, Req
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Franchise } from './franchise.entity';
import { FranchiseService } from './franchise.service';
import { CurrentFranchise } from './franchise.decorator';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { CUtilisateur } from '../utilisateur/utilisateur.entity';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { Profil } from '../profil/profil.entity';
import { Rights } from '../common/decorators/rights.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { profils } from '@aleaac/shared/src/models/profil.model';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { GrilleTarifService } from '../grille-tarif/grille-tarif.service';


@ApiUseTags('Franchises')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'franchise'))
export class FranchiseController {
    constructor(
        private readonly franchiseService: FranchiseService,
        private readonly utilisateurService: UtilisateurService,
        @InjectRepository(Franchise)
        private readonly franchiseRepository: Repository<Franchise>,
        private readonly grilleTarifService: GrilleTarifService
    ) { }

    @ApiOperation({ title: 'Nouveau franchise' })
    @ApiResponse({
        status: 200,
        description: 'Retourne le nouveau franchise.',
        type: Franchise
    })
    @ApiResponse({ status: 400, description: 'Le franchise existe déjà.' })
    @Post()
    async create(@Body() requestBody: IFranchise) {
        try {
            const res = await this.franchiseService.create(requestBody);
            this.grilleTarifService.initGrillesFranchise(res.id);

            return res;
        } catch (err) {
            if (err.message === 'Le franchise existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({ title: 'Franchises du user' })
    @Get('byUser/:idUtilisateur')
    async getByUtilisateur(@Param('idUtilisateur', new ParseIntPipe()) idUtilisateur: number): Promise<Franchise[]> {
        // console.log('franchise by user');
        const result = await this.franchiseService.getByUtilisateur(idUtilisateur);

        return result;
    }

    @ApiOperation({ title: 'Get the current user info (check JWT validity)' })
    @ApiResponse({
        status: 200,
        description: 'JWT is ok, returning user data.',
        type: Franchise
    })
    @ApiResponse({ status: 401, description: 'JWT is no longer valid!' })
    @Authorized()
    @Get('current')
    async getCurrent(@CurrentFranchise() currentFranchise: Franchise): Promise<Franchise> {
         // console.log('franchise current');
        return await this.franchiseService.findOneById(currentFranchise.id);
    }

    @ApiOperation({ title: 'Sortie réseau' })
    @ApiResponse({
        status: 200,
        description: 'OK.',
        type: Franchise
    })
    @ApiResponse({ status: 403, description: 'Refusé' })
    @Authorized(profils.SUPER_ADMIN)
    @Post('sortie-reseau')
    async sortieReseau(@Body() id: number): Promise<boolean> {
        // console.log('franchise sortie réseau : ' + id);
        const franch = await this.franchiseService.findOneById(id);
        franch.isSortieReseau = true;
        if (await this.franchiseService.update(id, franch)) {
            return true;
        } else {
        return false;
        }
    }

    @Get('page')
    @Rights(['FRANCHISE_SEE_ALL'])
    async getPage(@Req() req): Promise<Franchise[]> {

        return this.franchiseService.find(req.query);
    }

    @Get('countAll')
    @Rights(['FRANCHISE_SEE_ALL'])
    async countAll(@Req() req): Promise<number> {
        // console.log('franchise count all');
      return this.franchiseService.count(req.query);

    }

    @Get('get-with-users/:id')
    @Rights('INFO_FRANCHISE_READ')
    async findWithUsers(@Param('id', new ParseIntPipe()) id): Promise<Franchise> {
         // console.log('franchise with user');
        const foundFranchise = await this.franchiseService.findOneById(id, {
            relations: ['utilisateurs']
        });

        if (!foundFranchise) {
            throw new NotFoundException(`Franchise '${id}' introuvable`);
        }

        const listeUtilProfil: UtilisateurProfil[] = foundFranchise.utilisateurs;
        const listeUtil: CUtilisateur[] = new Array<CUtilisateur>();
        for (const utilProfil of listeUtilProfil) {
            if (utilProfil.idUtilisateur && !listeUtil.some(utili => utili.id === utilProfil.idUtilisateur) 
            && utilProfil.profil.isInterne) {
                const util = await this.utilisateurService.findOneById(utilProfil.idUtilisateur);
                if (util) {
                    listeUtil.push(util);
                }
            }
        }

        if (listeUtil.length > 0) {
            for (const util of listeUtil) {
                util.listeProfil = new Array<Profil>();
                for (const utilProfil of listeUtilProfil) {
                    if (utilProfil.idUtilisateur === util.id && utilProfil.profil.isInterne) {
                        util.listeProfil.push(utilProfil.profil);
                    }
                }
            }
        }

        foundFranchise.users = listeUtil;
        return foundFranchise;
    }

    @Get(':id')
    @Rights('INFO_FRANCHISE_READ')
    async findOne(@Param('id') id): Promise<Franchise> {
         // console.log('get tout court');
        const foundFranchise = await this.franchiseService.findOneById(parseInt(id, 10));

        if (!foundFranchise) {
            throw new NotFoundException(`Franchise '${id}' introuvable`);
        }

        return foundFranchise;
    }

    @Get()
    @Authorized()
    async find(@CurrentUtilisateur() user): Promise<Franchise[]> {
        // console.log('franchise get all');
        // Si pas le droit de tout voir, on voit que celles où on a un droit
        if (!this.utilisateurService.hasRight(user, ['FRANCHISE_SEE_ALL'])) {
            return this.getByUtilisateur(user.id);
        }
        return this.franchiseService.find();
    }

    @Put()
    @Rights(['INFO_FRANCHISE_WRITE', 'FRANCHISE_SEE_ALL'])
    async fullUpdate(@Body() franchise: Franchise,
    @CurrentUtilisateur() currentUtilisateur: CUtilisateur) {
         // console.log('franchise put');
        if (!this.utilisateurService.hasRole(currentUtilisateur, [profils.SUPER_ADMIN])) {
            // On peut pas écraser tout l'objet sans être super admin
            throw new UnauthorizedException();
        }
        return this.franchiseService.update(franchise.id, franchise);
    }

    @Patch(':id')
    @Rights(['INFO_FRANCHISE_WRITE', 'FRANCHISE_SEE_ALL'])
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        franchiseId: number,
        @Body() partialEntry: DeepPartial<Franchise>,
        @CurrentUtilisateur() currentUtilisateur: CUtilisateur
    ) {
         // console.log('franchise patch');
        // Il faut empêcher le gens de saisir toutes les valeurs
        // Si pas super admin, on enlève :
        // Date 1ère signature, Date signature contrat en cours, Date de fin de validité du contrat en cours
        // Date de démarrage, trigramme, N° contrat RCP, Montant garanti, N° de contrat, sortie réseau
        if (!this.utilisateurService.hasRole(currentUtilisateur, [profils.SUPER_ADMIN])) {
            delete partialEntry.datePremiereSignature;
            delete partialEntry.dateSignatureContratEnCours;
            delete partialEntry.dateFinContratEnCours;
            delete partialEntry.dateDemarrage;
            delete partialEntry.trigramme;
            delete partialEntry.numeroContratRCP;
            delete partialEntry.montantAnnuelGaranti;
            delete partialEntry.numeroContrat;
            delete partialEntry.isSortieReseau;
        }

        delete partialEntry.utilisateurs;
        delete partialEntry.users;
        return this.franchiseService.update(franchiseId, partialEntry);
    }

    @Delete(':id')
    @Authorized(profils.DEV)
    async remove(
        @Param('id', new ParseIntPipe())
        franchiseId: number
    ) {
         // console.log('franchise delete');
        return this.franchiseService.remove(franchiseId);
    }
}
