import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult, FindManyOptions} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Adresse} from '../adresse/adresse.entity';
import {CompteContact} from '../compte-contact/compte-contact.entity';
import {Activite} from './activite.entity';
import {QueryService} from '../query/query.service';
import { LatLng } from '../geocoding/LatLng';
import { GeocodingService } from '../geocoding/geocoding';

@Injectable()
export class ActiviteService {
    constructor(
        @InjectRepository(Activite)
        private readonly activiteRepository: Repository<Activite>,
        @InjectRepository(CompteContact)
        private readonly compteContactRepository: Repository<CompteContact>,
        @InjectRepository(Adresse)
        private readonly adresseRepository: Repository<Adresse>,
        private readonly queryService: QueryService,
        private geocodingService: GeocodingService
    ) {}

    async getByCompte(idCompte: number, inQuery: string) {
        const idContacts = await this.compteContactRepository.find({
            select: ['idContact'],
            where: {
                idCompte: idCompte
            }
        });
        const ids = idContacts.map((contact) => {
            return contact.idContact
        });

        let query = this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('activite.idContact IN (:ids)', {ids: ids})
            .orderBy('activite.date');

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany();
    }

    async getByContact(idContact: number, inQuery: string) {
        let query = this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('idContact = :idContact', {idContact: idContact});
        query = this.queryService.parseQuery(query, inQuery);
        return query.getMany();
    }

    async getAll(idFranchise: number, inQuery: string) {
        // console.log(inQuery);
        let query = this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('activite.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);
        return query.getMany();
    }

    async countByCompte(idCompte: number, inQuery: string) {
        const idContacts = await this.compteContactRepository.find({
            select: ['idContact'],
            where: {
                idCompte: idCompte
            }
        });
        const ids = idContacts.map((contact) => {
            return contact.idContact
        });

        let query = this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('activite.idContact IN (:ids)', {ids: ids})
            .orderBy('activite.date');

        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount();
    }

    async countByContact(idContact: number, inQuery: string) {
        let query = this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('idContact = :idContact', {idContact: idContact});
        query = this.queryService.parseQuery(query, inQuery);
        return query.getCount();
    }

    async countAll(idFranchise: number, inQuery: string) {
        let query = this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('activite.idFranchise = :idFranchise', {idFranchise: idFranchise});
        query = this.queryService.parseQuery(query, inQuery);
        return query.getCount();
    }

    async get(idActivite: number) {
        return await this.activiteRepository.findOne(idActivite, {relations: ['adresse', 'contact', 'contact.adresse',
         'categorie', 'utilisateur']});
    }

    async update(activite: Activite): Promise<UpdateResult> {
        const latLng: LatLng = await this.geocodingService.getLatLng(activite.adresse.adresse, activite.adresse.cp)
        activite.adresse.latitude = latLng.latitude;
        activite.adresse.longitude = latLng.longitude;

        await this.adresseRepository.update(activite.adresse.id, activite.adresse);
        delete activite.contact;
        delete activite.categorie;
        delete activite.utilisateur;
        return await this.activiteRepository.update(activite.id, activite)
    }

    async create(activite: Activite): Promise<Activite> {
         // console.log(activite)
        const newAdresse = await this.adresseRepository.create(activite.adresse);
        const newActivite = await this.activiteRepository.create(activite);
        await this.adresseRepository.save(newAdresse);
        newActivite.adresse = newAdresse;

        const latLng: LatLng = await this.geocodingService.getLatLng(newAdresse.adresse, newAdresse.cp)
        newAdresse.latitude = latLng.latitude;
        newAdresse.longitude = latLng.longitude;

        return await this.activiteRepository.save(newActivite);
    }

    async delete(idActivite: number): Promise<any> {
        const activite = this.activiteRepository.findOneOrFail(idActivite);
       return await this.activiteRepository.delete(idActivite);
   }

    async getForXlsx(idFranchise: number): Promise<Activite[]> {
        return await this.activiteRepository.createQueryBuilder('activite')
            .leftJoinAndSelect('activite.adresse', 'adresse')
            .leftJoinAndSelect('activite.contact', 'contact')
            .leftJoinAndSelect('activite.utilisateur', 'utilisateur')
            .leftJoinAndSelect('activite.categorie', 'categorie')
            .where('activite.idFranchise = :idFranchise', {idFranchise: idFranchise})
            .getMany()
    }
}
