import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, UpdateResult, In, FindConditions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Adresse } from '../adresse/adresse.entity';
import { PASSWORD_CRYPTOGRAPHER_TOKEN } from '../auth/constants';
import { PasswordCryptographerService } from '../auth/password-cryptographer/password-cryptographer.interface';
import { Franchise } from '../franchise/franchise.entity';
import { Profil } from '../profil/profil.entity';
import { Droit } from '../droit/droit.entity';
import { CurrentUtilisateur } from './utilisateur.decorator';
import {profils, ProfilsDroits} from '@aleaac/shared';
import { QueryService } from '../query/query.service';
import { UtilisateurProfil } from '../user-profil/utilisateur-profil.entity';
import { CUtilisateur } from './utilisateur.entity';
import { IUtilisateur } from '@aleaac/shared';
import { GeocodingService } from '../geocoding/geocoding';
import { LatLng } from '../geocoding/LatLng';

@Injectable()
export class UtilisateurService {
    constructor(
        @InjectRepository(CUtilisateur)
        private readonly userRepository: Repository<CUtilisateur>,
        @InjectRepository(Adresse)
        private readonly adresseRepository: Repository<Adresse>,
        @InjectRepository(UtilisateurProfil)
        private readonly utilisateurProfilRepository: Repository<UtilisateurProfil>,
        @InjectRepository(Profil)
        private readonly profilRepository: Repository<Profil>,
        @InjectRepository(Franchise)
        private readonly franchiseRepository: Repository<Franchise>,
        @InjectRepository(Droit)
        private readonly droitRepository: Repository<Droit>,
        private readonly queryService: QueryService,
        // private readonly log: Log,
        @Inject(PASSWORD_CRYPTOGRAPHER_TOKEN) private readonly passwordCryptographerService: PasswordCryptographerService,
        private readonly geocodingService: GeocodingService
    ) { }


    // Create
    // Precondition: the user needs to have a unique email address
    async create(userDto: IUtilisateur, password: string): Promise<CUtilisateur> {
        // this.log.debug('trying to create user...');

        const existingUtilisateur = await this.userRepository.findOne({ where: { login: userDto.login } });
        if (existingUtilisateur) {
            throw new Error('Utilisateur already exists');
        }

        const user = this.userRepository.create(userDto);
        // user.role = UtilisateurRole.Regular;
        user.motDePasse = await this.passwordCryptographerService.doHash(password);

        const newAdresse = await this.adresseRepository.create(user.adresse);
        user.adresse = newAdresse;

        const latLng: LatLng = await this.geocodingService.getLatLng(newAdresse.adresse, newAdresse.cp)
        newAdresse.latitude = latLng.latitude;
        newAdresse.longitude = latLng.longitude;

        await this.adresseRepository.save(newAdresse);
        const savedUtilisateur = await this.userRepository.save(user);

        // this.log.debug(JSON.stringify(savedUtilisateur));
        return savedUtilisateur;
    }

    // Read
    async find(inQuery?: string, idCreatedBy?: number, listeUsersFranchise?: number[]): Promise<CUtilisateur[]> {

        let query = this.userRepository.createQueryBuilder('utilisateur')
            .leftJoinAndSelect('utilisateur.civilite', 'civilite')
            .leftJoinAndSelect('utilisateur.qualite', 'qualite')
            .leftJoinAndSelect('utilisateur.adresse', 'adresse')
            .leftJoinAndSelect('utilisateur.franchisePrincipale', 'franchisePrincipale')
            .leftJoinAndSelect('utilisateur.profils', 'utilisateurProfils')
            .leftJoinAndSelect('utilisateurProfils.profil', 'profil')
            .leftJoinAndSelect('profil.droits', 'droits');

        if (idCreatedBy) {
            query.where('idCreatedBy = :idCreatedBy', { idCreatedBy: idCreatedBy })
        }

        if (listeUsersFranchise) {
            query.where('utilisateur.id IN (:listeUsersFranchise)', { listeUsersFranchise: listeUsersFranchise })
        }

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        const results = await query.getMany();

        if (results) {
            for (let result of results) {
                result = this.parseDroitsProfils(result, result.profils);
            }
        }

        return results;
    }

    async findOneById(id: number, getPassword: boolean = false, getFranchiseProfil: boolean = false): Promise<CUtilisateur | undefined> {
        if (getPassword) {
            let response2 = await this.userRepository
                .createQueryBuilder('u')
                .select(['u.id', 'u.nom', 'u.prenom', 'u.motDePasse', 'u.raisonSociale', 'u.mobile', 'u.idAdresse'
                    , 'u.login', 'u.loginGoogleAgenda', 'u.isInterne', 'u.isSuspendu', 'u.isHabilite'
                    , 'u.idCreatedBy', 'u.idCivilite', 'u.idQualite', 'u.idUtilisateurParent', 'u.idFranchisePrincipale', 'u.idFonction'])
                .leftJoinAndSelect('u.fonction', 'fonction')
                .leftJoinAndSelect('utilisateur.profils', 'utilisateurProfils')
                .leftJoinAndSelect('utilisateurProfils.profil', 'profil')
                .leftJoinAndSelect('profil.droits', 'droits')
                .where('login LIKE :login', { id: id })
                .getOne();

            if (response2) {
                // const utilProfil = await this.utilisateurProfilRepository.find({ idUtilisateur: response2.id });
                response2 = this.parseDroitsProfils(response2, response2.profils);
                return response2
            } else {
                // On ne donne pas d'infos à un attaquant si l'utilisateur existe ou pas
                throw new NotFoundException('Email ou mot de passe invalide.');
            }
        } else {
            const options: FindOneOptions<CUtilisateur> = {
                where: {
                    id: id
                },
                relations: ['civilite', 'qualite', 'franchisePrincipale', 'utilisateurParent', 'adresse', 'fonction', 'signature']
            };

            const result = await this.userRepository.findOne(options);

            if (result) {
                result.profils = result.profils.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);
                if (getFranchiseProfil) {
                    for (const pro of result.profils) {
                        const lalala = await this.franchiseRepository.findOne(pro.idFranchise);
                        if (lalala) {
                            pro.franchise = lalala;
                        } else {
                            pro.franchise = new Franchise();
                        }
                    }
                    console.log(await result);
                    return await result;
                } else {
                    return result;
                }
            } else {
                throw new NotFoundException();
            }
        }
    }

    async findOneByEmail(email: string, getPassword: boolean = false): Promise<CUtilisateur | undefined> {
        // this.log.debug('trying to find one user by email...');
        // console.log(email);
        // console.log(getPassword);
        if (getPassword) {
            let response2 = await this.userRepository
                .createQueryBuilder('u')
                .select(['u.id', 'u.nom', 'u.prenom', 'u.motDePasse', 'u.raisonSociale', 'u.mobile', 'u.idAdresse'
                    , 'u.login', 'u.loginGoogleAgenda', 'u.isInterne', 'u.isSuspendu', 'u.isHabilite'
                    , 'u.idCreatedBy', 'u.idCivilite', 'u.idQualite', 'u.idUtilisateurParent', 'u.idFranchisePrincipale', 'u.idFonction'])
                .leftJoinAndSelect('u.civilite', 'civilite')
                .leftJoinAndSelect('u.franchisePrincipale', 'franchisePrincipale')
                .where('login LIKE :login', { login: email })
                .getOne();

            if (response2) {
                const utilProfil = await this.utilisateurProfilRepository.find({ idUtilisateur: response2.id });
                response2 = this.parseDroitsProfils(response2, utilProfil);
                return response2
            } else {
                // On ne donne pas d'infos à un attaquant si l'utilisateur existe ou pas
                throw new NotFoundException('Email ou mot de passe invalide.');
            }
        } else {
            const result = await this.userRepository.findOneOrFail({
                login: email
            });
            result.profils = result.profils.sort((a, b) => a.profil.nom > b.profil.nom ? 1 : -1);
            return result;
        }
    }

    async userToPromise(user: CUtilisateur): Promise<CUtilisateur> {
        return user;
    }

    emailIsTaken(email: string): Promise<boolean> {
        // this.log.debug('checking if email is taken...');
        return this.findOneByEmail(email).then(user => {
            return !!user;
        });
    }

    // Update
    async update(id: number, partialEntry: DeepPartial<CUtilisateur>) {
        // this.log.debug('trying to update user...');
        console.log('Update1');
        if (partialEntry.motDePasse && partialEntry.motDePasse.length >= 6) {
            console.log('Update1.1');
            partialEntry.motDePasse = await this.passwordCryptographerService.doHash(partialEntry.motDePasse);
            console.log('Update1.11');
        } else {
            delete partialEntry.motDePasse;
            console.log('Update1.2');
        }

        if (partialEntry.franchisePrincipale || partialEntry.idFranchisePrincipale) {
            console.log('Update2');
            if ((partialEntry.idFranchisePrincipale && partialEntry.franchisePrincipale)
                || (partialEntry.franchisePrincipale == null && partialEntry.idFranchisePrincipale == null)) {
                    console.log('Update2.1');
                delete partialEntry.franchisePrincipale;
            }
        } else {
            console.log('Update2.2');
            delete partialEntry.idFranchisePrincipale;
            delete partialEntry.franchisePrincipale;
        }

        if (partialEntry.adresse !== undefined && partialEntry.adresse !== null && partialEntry.adresse.id !== undefined) {
            // console.log(partialEntry)
            if (partialEntry.adresse.id == null) {
                delete partialEntry.adresse.id;
                const addr = await this.adresseRepository.save(partialEntry.adresse);
                partialEntry.adresse = addr;

                const latLng: LatLng = await this.geocodingService.getLatLng(partialEntry.adresse.adresse, partialEntry.adresse.cp)
                partialEntry.adresse.latitude = latLng.latitude;
                partialEntry.adresse.longitude = latLng.longitude;
            } else {
                const latLng: LatLng = await this.geocodingService.getLatLng(partialEntry.adresse.adresse, partialEntry.adresse.cp)
                partialEntry.adresse.latitude = latLng.latitude;
                partialEntry.adresse.longitude = latLng.longitude;
                // console.log(latLng);

                await this.adresseRepository.update(partialEntry.adresse.id, partialEntry.adresse);
                // console.log(partialEntry.adresse);
            }
        } else if (partialEntry.adresse === null) {
            const addr = await this.adresseRepository.save(partialEntry.adresse);
            partialEntry.adresse = addr;

            const latLng: LatLng = await this.geocodingService.getLatLng(partialEntry.adresse.adresse, partialEntry.adresse.cp)
            partialEntry.adresse.latitude = latLng.latitude;
            partialEntry.adresse.longitude = latLng.longitude;
        }
        id = partialEntry.id;
        // console.log(id);

        if (partialEntry.idFranchisePrincipale === null && partialEntry.franchisePrincipale === null) {
            // console.log('wesh')
            delete partialEntry.franchisePrincipale;
        }
        if (partialEntry.idFranchisePrincipale && partialEntry.franchisePrincipale) {
            // console.log('wesh')
            delete partialEntry.franchisePrincipale;
        }
        return this.userRepository.save(partialEntry);
    }

    // Delete
    async remove(id: number): Promise<CUtilisateur> {
        // this.log.debug('trying to remove user...');
        const user = await this.findOneById(id);
        if (user) {
            return await this.userRepository.remove(user!);
        } else {
            throw new NotFoundException()
        }
    }

    parseDroitsProfils(utilisateur: CUtilisateur, profils: UtilisateurProfil[]): CUtilisateur {
        const droits: ProfilsDroits[] = [];
        for (const profil of profils) {
            const findedFranchise = droits.find((droit) => {
                return droit.idFranchise === profil.idFranchise
            });
            if (findedFranchise) {
                for (const droit of profil.profil.droits) {
                    findedFranchise.droits.push(droit.code)
                }
                findedFranchise.idProfils.push(profil.idProfil)
            } else {
                const newDroit = [];
                for (const droit of profil.profil.droits) {
                    newDroit.push(droit.code)
                }
                droits.push({idFranchise: profil.idFranchise, droits: newDroit, idProfils: [profil.idProfil]})
            }
        }
        utilisateur.listeProfilsDroits = droits.filter(this.onlyUnique);

        return utilisateur;
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    hasRole(@CurrentUtilisateur() user, roles: profils[]): boolean {
        return roles && roles.length > 0 ? user.profils.some((role) => roles.indexOf(role.profil.id) > -1
            || roles.indexOf(role.profil.id.toString()) > -1) : true;
    }

    hasRight(@CurrentUtilisateur() user, droits: string[] | string): boolean {
        if (typeof droits === 'string') {
            droits = [droits];
        }
        console.log('droits', droits);
        const result = droits && droits.length > 0 ? this.checkRights(user.listeProfilsDroits, droits) : true;
        console.log('result droits', result);
        return result;
    }

    hasRoleOnFranchise(@CurrentUtilisateur() user, roles: profils[], idFranchise: number): boolean {
        const result = roles && roles.length > 0 ? user.profils.some((role) => (roles.indexOf(role.profil.id) > -1
            || roles.indexOf(role.profil.id.toString()) > -1)
            && role.idFranchise == idFranchise) : true; // C'est voulu d'avoir que "==" sinon ça plante alors qu'on compare bien 2 number
        console.log('profils', roles);
        console.log('result profils', result);
        return result;
    }

    hasRightOnFranchise(@CurrentUtilisateur() user, droits: string[] | string, idFranchise: number): boolean {
        if (typeof droits === 'string') {
            droits = [droits];
        }
        console.log(user.listeProfilsDroits);
        const result = droits && droits.length > 0 ? this.checkRightsOnFranchise(user.listeProfilsDroits, droits, idFranchise) : true;
        console.log('result hasRightOnFranchise', result);
        return result;
    }

    async hasRightOrAbove(@CurrentUtilisateur() user, droits: string[] | string): Promise<boolean> {
        if (typeof droits === 'string') {
            droits = [droits];
        }
        const result = droits && droits.length > 0 ? await this.checkRightsOrAbove(user.profils, droits) : true;
        return result;
    }

    async hasRightOrAboveOnFranchise(@CurrentUtilisateur() user, droits: string[] | string, idFranchise: number): Promise<boolean> {
        if (typeof droits === 'string') {
            droits = [droits];
        }
        const result = droits && droits.length > 0 ? await this.checkRightsOrAboveOnFranchise(user.profils, droits, idFranchise) : true;
        return result;
    }

    private checkRights(listeProfilsDroits: ProfilsDroits[], toCheck: string[]): boolean {
        let result = false;

        for (const profilsDroits of listeProfilsDroits) {
            if (!profilsDroits.droits || profilsDroits.droits.length === 0) {
                continue;
            }
            if (profilsDroits.droits.some((droit) => toCheck.indexOf(droit) > -1)) {
                result = true;
                break;
            }
        }

        return result;
    }

    /*private checkRights(utilisaterProfils: UtilisateurProfil[], toCheck: string[]): boolean {
        let result = false;

        for (const userProfil of utilisaterProfils) {
            if (!userProfil.profil.droits) {
                continue;
            }
            if (userProfil.profil.droits.some((droit) => toCheck.indexOf(droit.code) > -1)) {
                result = true;
                break;
            }
        }

        return result;
    }*/

    private checkRightsOnFranchise(listeProfilsDroits: ProfilsDroits[], toCheck: string[], idFranchise: number): boolean {
        let result = false;

        console.log(listeProfilsDroits, toCheck, idFranchise);
        const findedFranchiseProfilsDroits = listeProfilsDroits.find((profilDroit) => {
            return profilDroit.idFranchise == idFranchise
        });

        if (findedFranchiseProfilsDroits) {
            if (findedFranchiseProfilsDroits.droits.some((droit) => toCheck.indexOf(droit) > -1)) {
                result = true;
            }
        }

        return result;
    }

    /*private checkRightsOnFranchise(utilisaterProfils: UtilisateurProfil[], toCheck: string[], idFranchise: number): boolean {
        let result = false;

        for (const userProfil of utilisaterProfils) {
            if (userProfil.idFranchise != idFranchise || !userProfil.profil.droits) {
                // C'est voulu un seul égal, sinon ça plante, alors qu'on compare bien 2 "number"
                continue;
            }
            if (userProfil.profil.droits.some((droit) => toCheck.indexOf(droit.code) > -1)) {
                result = true;
                break;
            }
        }

        return result;
    }*/

    private async checkRightsOrAbove(utilisaterProfils: UtilisateurProfil[], toCheck: string[]): Promise<boolean> {
        let result = false;
        const rightsToCompare = await this.droitRepository.find({
            where: {
                code: In(toCheck)
            }
        });
        let minLevel = Number.MAX_SAFE_INTEGER;
        for (const right of rightsToCompare) {
            if (right.niveau < minLevel) {
                minLevel = right.niveau;
            }
        }

        for (const userProfil of utilisaterProfils) {
            if (userProfil.profil.droits.some((droit) => toCheck.indexOf(droit.code) > -1 || droit.niveau >= minLevel)) {
                result = true;
                break;
            }
        }

        return result;
    }

    private async checkRightsOrAboveOnFranchise(utilisaterProfils: UtilisateurProfil[], toCheck: string[],
        idFranchise: number): Promise<boolean> {
        let result = false;

        const rightsToCompare = await this.droitRepository.find({
            where: {
                code: In(toCheck)
            }
        });
        let minLevel = Number.MAX_SAFE_INTEGER;
        for (const right of rightsToCompare) {
            if (right.niveau < minLevel) {
                minLevel = right.niveau;
            }
        }

        for (const userProfil of utilisaterProfils) {
            if (userProfil.profil.droits.some((droit) => (toCheck.indexOf(droit.code) > -1) || droit.niveau >= minLevel)
                && userProfil.idFranchise == idFranchise) { // C'est voulu "==", sinon ça plante, alors qu'on compare bien 2 "number"
                result = true;
                break;
            }
        }

        return result;
    }
}
