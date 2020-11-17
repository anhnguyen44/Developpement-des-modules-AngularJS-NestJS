import {Injectable} from '@nestjs/common';
import {CUtilisateur} from '../utilisateur/utilisateur.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Franchise} from '../franchise/franchise.entity';
import {UtilisateurProfil} from '../user-profil/utilisateur-profil.entity';
import {Contact} from '../contact/contact.entity';
import {TarifDetail} from '../tarif-detail/tarif-detail.entity';
import {Adresse} from '../adresse/adresse.entity';
import {Compte} from '../compte/compte.entity';

@Injectable()
export class WebServiceService {
    constructor(
        @InjectRepository(CUtilisateur)
        private readonly userRepository: Repository<CUtilisateur>,
        @InjectRepository(Franchise)
        private readonly franchiseRepository: Repository<Franchise>,
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
        @InjectRepository(Compte)
        private readonly compteRepository: Repository<Compte>,
        @InjectRepository(UtilisateurProfil)
        private readonly utilisateurProfilRepository: Repository<UtilisateurProfil>
    ) {}

    async findUserByEmail(email: string) {
        return await this.userRepository.createQueryBuilder('user')
            .select(['user.id', 'user.nom', 'user.prenom', 'user.motDePasse'])
            .where('login = :login', {login: email})
            .getOne()
    }

    async getFranchiseByUser(idUser) {
        const userProfils = await this.utilisateurProfilRepository.createQueryBuilder('userProfils')
            .where('idUtilisateur = :idUser', {idUser: idUser})
            .groupBy('idFranchise')
            .getMany();
        const idFranchises = userProfils.map((userProfil) => userProfil.idFranchise);
        return await this.franchiseRepository.createQueryBuilder('franchise')
            .select(['franchise.id', 'franchise.raisonSociale'])
            .where('id IN :idFranchises', {idFranchises: [idFranchises]})
            .getMany()
    }

    async getFranchiseByEmailUser(emailUser): Promise<number> {
        const user = await this.userRepository.createQueryBuilder('utilisateur')
            .where('login = :login', {login: emailUser})
            .getOne();

        return user.idFranchisePrincipale
    }

    async findContactByEmail(emailInterlocuteur: string, idFranchise: number): Promise<Contact> {
        return await this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .where('LOWER(adresse.email) LIKE :emailInterlocuteur && contact.idFranchise = :idFranchise',
                {emailInterlocuteur: emailInterlocuteur, idFranchise: idFranchise}).getOne()

    }

    async findCompteByEmail(emailInterlocuteur: string, idFranchise: number): Promise<Compte> {
        return await this.compteRepository.createQueryBuilder('compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('compte.compteContacts', 'compteContacts', 'bPrincipale = 1')
            .leftJoinAndSelect('compteContacts.contact', 'contact')
            .where('LOWER(adresse.email) LIKE :emailInterlocuteur && compte.idFranchise = :idFranchise',
                {emailInterlocuteur: emailInterlocuteur, idFranchise: idFranchise}).getOne()
    }



}
