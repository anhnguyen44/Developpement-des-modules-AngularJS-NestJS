import { CreateUtilisateurDto } from '@aleaac/shared';
import { profils } from '@aleaac/shared/src/models/profil.model';
import { Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, NotFoundException,
    Param, ParseIntPipe, Patch, Post, Put, Query, Req, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { Rights } from '../common/decorators/rights.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { HistoriqueService } from '../historique/historique.service';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { UtilisateurProfilService } from '../user-profil/utilisateur-profil.service';
import { CurrentUtilisateur } from './utilisateur.decorator';
import { CUtilisateur } from './utilisateur.entity';
import { UtilisateurService } from './utilisateur.service';

@ApiUseTags('Utilisateurs')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'users'))
export class UtilisateurController {
    constructor(
        private readonly utilisateurService: UtilisateurService,
        @InjectRepository(CUtilisateur)
        private readonly userRepository: Repository<CUtilisateur>,
        @InjectRepository(UtilisateurProfil)
        private readonly userProfilRepository: Repository<UtilisateurProfil>,
        private readonly userProfilService: UtilisateurProfilService,
        private readonly historiqueService: HistoriqueService
    ) { }

    @ApiOperation({ title: 'Nouvel utilisateur' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne le nouvel utilisateur.',
        type: CUtilisateur
    })
    @ApiResponse({ status: 400, description: 'Email ou mot de passe invalide.' })
    @Rights('USERS_CREATE')
    @Post()
    async create(@Body() requestBody: CreateUtilisateurDto, @Req() req) {
        try {
            const result = await this.utilisateurService.create(requestBody.user, requestBody.user.motDePasse);
            this.historiqueService.add(req.user.id, 'utilisateur', result.id, 'Création utilisateur');
            return result;
        } catch (err) {
            if (err.message === 'L\'utilisateur existe déjà.') {
                throw new ForbiddenException(err.message);
            } else {
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @Get()
    @Authorized()
    async find(@CurrentUtilisateur() currentUtilisateur: CUtilisateur,
        @Query() findOptions?: FindManyOptions<CUtilisateur>): Promise<CUtilisateur[]> {
        if (this.utilisateurService.hasRight(currentUtilisateur, 'USERS_SEE_ALL')) {
            return this.utilisateurService.find();
        } else {
            // On récupère tous les users créés par l'utilisateur courant
            const dePleinDroit: CUtilisateur[] = await this.utilisateurService.find(null, currentUtilisateur.id);

            // On récupère les franchises de l'utilisateur
            const listeFranchiseUser: number[] = new Array<number>();
            for (const userProfile of currentUtilisateur.profils) {
                if (listeFranchiseUser.indexOf(userProfile.idFranchise) === -1) {
                    listeFranchiseUser.push(userProfile.idFranchise);
                }
            }

            // Si on peut voir tous les users de la franchise
            if (this.utilisateurService.hasRight(currentUtilisateur, 'USERS_SEE_FRANCHISE')) {
                // On va chercher tous les profils affectés sur les franchises de l'utlisateur pour trouver
                // tous les utilisateurs des franchises liées à l'utilisateur
                const listeUserProfilsFranchise: UtilisateurProfil[] = await this.userProfilService.findByFranchises(listeFranchiseUser);
                const listeUsersFranchise: number[] = new Array<number>();
                for (const userFranchise of listeUserProfilsFranchise) {

                    if (listeUsersFranchise.indexOf(userFranchise.idUtilisateur) === -1) {
                        listeUsersFranchise.push(userFranchise.idUtilisateur);
                    }
                }
                let deLaFranchise: CUtilisateur[] = [];
                if (listeUsersFranchise.length > 0) {
                    deLaFranchise = await this.utilisateurService.find(null, null, listeUsersFranchise);
                }
                return dePleinDroit.concat(deLaFranchise);
            } else {
                return dePleinDroit;
            }
        }
    }

    @ApiOperation({ title: 'Get the current user info (check JWT validity)' })
    @ApiResponse({
        status: 200,
        description: 'JWT is ok, returning user data.',
        type: CUtilisateur
    })
    @ApiResponse({ status: 401, description: 'JWT is no longer valid!' })
    @Authorized()
    @Get('get-by-right-franchise/:codeDroit/:idFranchise')
    async getByRightOnFranchise(@CurrentUtilisateur() currentUtilisateur: CUtilisateur,
        @Param('codeDroit') codeDroit: string, @Param('idFranchise') idFranchise: number): Promise<CUtilisateur[]> {
        let res = await this.find(currentUtilisateur);
        res = res.filter(u => this.utilisateurService.hasRightOnFranchise(u, [codeDroit], idFranchise));

        return await res;
    }

    @ApiOperation({ title: 'Get the current user info (check JWT validity)' })
    @ApiResponse({
        status: 200,
        description: 'JWT is ok, returning user data.',
        type: CUtilisateur
    })
    @ApiResponse({ status: 401, description: 'JWT is no longer valid!' })
    @Authorized()
    @Get('get-by-profil-franchise/:idProfil/:idFranchise')
    async getByProfilOnFranchise(@CurrentUtilisateur() currentUtilisateur: CUtilisateur,
        @Param('idProfil') idProfil: profils, @Param('idFranchise') idFranchise: number): Promise<CUtilisateur[]> {
        const options: FindManyOptions<CUtilisateur> = {
            relations: ['profils']
        }
        let res = await this.find(currentUtilisateur, options);
        res = res.filter(u => this.utilisateurService.hasRoleOnFranchise(u, [idProfil], idFranchise));

        return await res;
    }

    @ApiOperation({ title: 'Get the current user info (check JWT validity)' })
    @ApiResponse({
        status: 200,
        description: 'JWT is ok, returning user data.',
        type: CUtilisateur
    })
    @ApiResponse({ status: 401, description: 'JWT is no longer valid!' })
    @Get('current')
    async getCurrent(@CurrentUtilisateur() currentUtilisateur: CUtilisateur, @Req() req): Promise<CUtilisateur> {
        if (req.user && req.user.id) {
            return await this.utilisateurService.findOneById(currentUtilisateur.id);
        } else {
            throw new UnauthorizedException();
        }
    }


    @Get('get-with-profil-franchise/:idOrEmail')
    @Authorized()
    async findOneWithFranchise(@Param('idOrEmail') idOrEmail,
        @CurrentUtilisateur() currentUtilisateur: CUtilisateur): Promise<CUtilisateur> {
        // const isEmail = this.emailValidator.simpleCheck(idOrEmail);
        const foundUtilisateur =    // isEmail
            // ?
            // await this.utilisateurService.findOneByEmail(idOrEmail)
            await this.utilisateurService.findOneById(parseInt(idOrEmail, 10), false, true);

        // Si on n'est pas le user lui-même
        if (!foundUtilisateur || (foundUtilisateur.id !== currentUtilisateur.id
            && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
            // Si on n'est pas le créateur
            if ((foundUtilisateur.idCreatedBy !== currentUtilisateur.id
                && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                    || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
                throw new ForbiddenException('Seul l\'utilisateur lui-même, l\'utilisateur qui \
                    l\'a créé ou un administrateur peut modifier cette fiche utilisateur');
            } else {
                // Youpi
            }
        }

        if (!foundUtilisateur) {
            throw new NotFoundException(`Utilisateur '${idOrEmail}' introuvable`);
        }

        return foundUtilisateur;
    }

    /**
     * Duck-Typed Input: could either be an integer for the id or the e-mail address of the user
     */
    @Get('get/:idOrEmail')
    @Authorized()
    async findOne(@Param('idOrEmail') idOrEmail, @CurrentUtilisateur() currentUtilisateur: CUtilisateur): Promise<CUtilisateur> {
        // const isEmail = this.emailValidator.simpleCheck(idOrEmail);
        const foundUtilisateur =    // isEmail
            // ?
            // await this.utilisateurService.findOneByEmail(idOrEmail)
            await this.utilisateurService.findOneById(parseInt(idOrEmail, 10));

        // Si on n'est pas le user lui-même
        if (!foundUtilisateur || (foundUtilisateur.id !== currentUtilisateur.id
            && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
            // Si on n'est pas le créateur
            if ((foundUtilisateur.idCreatedBy !== currentUtilisateur.id
                && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                    || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
                throw new ForbiddenException('Seul l\'utilisateur lui-même, l\'utilisateur qui \
                    l\'a créé ou un administrateur peut modifier cette fiche utilisateur');
            } else {
                // Youpi
            }
        }

        if (!foundUtilisateur) {
            throw new NotFoundException(`Utilisateur '${idOrEmail}' introuvable`);
        }

        return foundUtilisateur;
    }

    @Get('page')
    @Authorized()
    async getPage(@CurrentUtilisateur() currentUtilisateur: CUtilisateur,
        @Req() req): Promise<CUtilisateur[]> {
        if (this.utilisateurService.hasRight(currentUtilisateur, 'USERS_SEE_ALL')) {
            const foundUtilisateur = await this.utilisateurService.find(req.query);
            return foundUtilisateur;
        } else {
            const options: FindManyOptions = {
                where: {
                    idCreatedBy: currentUtilisateur.id
                }
            };
            // On récupère tous les users créés par l'utilisateur courant
            const dePleinDroit: CUtilisateur[] = await this.utilisateurService.find(req.query, currentUtilisateur.id);

            // On récupère les franchises de l'utilisateur
            const listeFranchiseUser: number[] = new Array<number>();
            for (const userProfile of currentUtilisateur.profils) {
                if (listeFranchiseUser.indexOf(userProfile.idFranchise) === -1) {
                    listeFranchiseUser.push(userProfile.idFranchise);
                }
            }

            // Si on peut voir tous les users de la franchise
            if (this.utilisateurService.hasRight(currentUtilisateur, 'USERS_SEE_FRANCHISE')) {
                // On va chercher tous les profils affectés sur les franchises de l'utlisateur pour trouver
                // tous les utilisateurs des franchises liées à l'utilisateur
                const listeUserProfilsFranchise: UtilisateurProfil[] = await this.userProfilService.findByFranchises(listeFranchiseUser);
                const listeUsersFranchise: number[] = new Array<number>();
                for (const userFranchise of listeUserProfilsFranchise) {

                    if (listeUsersFranchise.indexOf(userFranchise.idUtilisateur) === -1) {
                        listeUsersFranchise.push(userFranchise.idUtilisateur);
                    }
                }
                let deLaFranchise: CUtilisateur[] = [];
                if (listeUsersFranchise.length > 0) {
                    deLaFranchise = await this.utilisateurService.find(req.query, null, listeUsersFranchise);
                }
                return dePleinDroit.concat(deLaFranchise).slice((req.query.nbPage - 1) * req.query.parPage, req.query.parPage);
            } else {
                return dePleinDroit.slice((req.query.nbPage - 1) * req.query.parPage, req.query.parPage);
            }
        }
    }

    @Get('countAll')
    async countAll(@CurrentUtilisateur() currentUtilisateur: CUtilisateur): Promise<number> {
        if (this.utilisateurService.hasRight(currentUtilisateur, 'USERS_SEE_ALL')) {
            return this.userRepository.count();
        } else {
            // On récupère tous les users créés par l'utilisateur courant
            const dePleinDroit: CUtilisateur[] = await this.utilisateurService.find(null, currentUtilisateur.id);

            // On récupère les franchises de l'utilisateur
            const listeFranchiseUser: number[] = new Array<number>();
            for (const userProfile of currentUtilisateur.profils) {
                if (listeFranchiseUser.indexOf(userProfile.idFranchise) === -1) {
                    listeFranchiseUser.push(userProfile.idFranchise);
                }
            }

            // Si on peut voir tous les users de la franchise
            if (this.utilisateurService.hasRight(currentUtilisateur, 'USERS_SEE_FRANCHISE')) {
                // On va chercher tous les profils affectés sur les franchises de l'utlisateur pour trouver
                // tous les utilisateurs des franchises liées à l'utilisateur
                const listeUserProfilsFranchise: UtilisateurProfil[] = await this.userProfilService.findByFranchises(listeFranchiseUser);
                const listeUsersFranchise: number[] = new Array<number>();
                for (const userFranchise of listeUserProfilsFranchise) {

                    if (listeUsersFranchise.indexOf(userFranchise.idUtilisateur) === -1) {
                        listeUsersFranchise.push(userFranchise.idUtilisateur);
                    }
                }
                let deLaFranchise: CUtilisateur[] = [];
                if (listeUsersFranchise.length > 0) {
                    deLaFranchise = await this.utilisateurService.find(null, null, listeUsersFranchise);
                }
                return dePleinDroit.concat(deLaFranchise).length;
            } else {
                return dePleinDroit.length;
            }
        }
    }

    @Get('created-by-current')
    @Authorized()
    async findCreatedByCurrent(@CurrentUtilisateur() currentUtilisateur: CUtilisateur): Promise<CUtilisateur[]> {
        if (currentUtilisateur && currentUtilisateur.id) {
            return this.utilisateurService.find(null, currentUtilisateur.id);
        } else {
            throw new UnauthorizedException();
        }
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() user: CUtilisateur, @CurrentUtilisateur() currentUtilisateur: CUtilisateur) {
        if (!user || (user.id !== currentUtilisateur.id
            && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
            if ((user.idCreatedBy !== currentUtilisateur.id
                && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                    || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
                throw new ForbiddenException('Seul l\'utilisateur lui-même, l\'utilisateur qui \
                    l\'a créé ou un administrateur peut modifier cette fiche utilisateur');
            } else {
                // Youpi
            }
        }

        delete user.profils;
        delete user.motDePasseConfirmation;
        if (user.qualite) {
            user.isInterne = user.qualite.isInterne;
        }

        return this.utilisateurService.update(user.id, user);
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        userId: number,
        @Body() partialEntry: DeepPartial<CUtilisateur>,
        @CurrentUtilisateur() currentUtilisateur: CUtilisateur
    ) {
        if (!partialEntry || (partialEntry.id !== currentUtilisateur.id
            && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
            if ((partialEntry.idCreatedBy !== currentUtilisateur.id
                && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                    || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
                throw new ForbiddenException('Seul l\'utilisateur lui-même, l\'utilisateur qui \
                    l\'a créé ou un administrateur peut modifier cette fiche utilisateur');
            } else {
                // On a le droit de modifier cet utilisateur, mais il reste à vérifier si l'on peut modifier tous les paramètres
                const canEditDroits = this.utilisateurService.hasRole(currentUtilisateur,
                    [profils.SUPER_ADMIN, profils.ADMIN, profils.FRANCHISE]);
                if (!canEditDroits) {
                    delete partialEntry.utilisateurParent;
                    delete partialEntry.isSuspendu;
                    delete partialEntry.isHabilite;
                    delete partialEntry.niveauHabilitation;
                    delete partialEntry.dateValiditeHabilitation;
                    delete partialEntry.isInterne;
                }
            }
        }

        delete partialEntry.motDePasseConfirmation;
        delete partialEntry.profils;
        if (partialEntry.qualite) {
            partialEntry.isInterne = partialEntry.qualite.isInterne;
        }

        return this.utilisateurService.update(userId, partialEntry);
    }

    @Delete(':id')
    @Authorized()
    async remove(
        @Param('id', new ParseIntPipe())
        userId: number,
        @CurrentUtilisateur() currentUtilisateur: CUtilisateur
    ) {
        const userToDelete = await this.utilisateurService.findOneById(userId);
        if (!userToDelete || (userToDelete.id !== currentUtilisateur.id
            && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
            if ((userToDelete.idCreatedBy !== currentUtilisateur.id
                && !(this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_ALL')
                    || this.utilisateurService.hasRight(currentUtilisateur, 'USERS_EDIT_FRANCHISE')))) {
                throw new ForbiddenException('Seul l\'utilisateur lui-même, l\'utilisateur qui \
                    l\'a créé ou un administrateur peut modifier cette fiche utilisateur');
            } else {
                // Youpi
            }
        }
        // return this.utilisateurService.remove(userId);
        const supended = new CUtilisateur();
        supended.id = userId;
        supended.isSuspendu = !userToDelete.isSuspendu;
        return this.utilisateurService.update(userId, supended);
    }
}
