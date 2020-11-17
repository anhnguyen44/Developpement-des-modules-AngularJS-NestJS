import {Injectable} from '@nestjs/common';
import {Repository, UpdateResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Adresse} from '../adresse/adresse.entity';
import {Compte} from './compte.entity';
import {CompteContact} from '../compte-contact/compte-contact.entity';
import {id} from 'aws-sdk/clients/datapipeline';
import {QueryService} from '../query/query.service';
import { GeocodingService } from '../geocoding/geocoding';
import { LatLng } from '../geocoding/LatLng';

@Injectable()
export class CompteService {
    constructor(
        @InjectRepository(Compte)
        private readonly compteRepository: Repository<Compte>,
        @InjectRepository(CompteContact)
        private readonly compteContactRepository: Repository<CompteContact>,
        @InjectRepository(Adresse)
        private readonly adresseRepository: Repository<Adresse>,
        private queryService: QueryService,
        private geocodingService: GeocodingService,
    ) {}

    async getAll(idFranchise: number, inQuery: string): Promise<Compte[]> {
        let query = this.compteRepository.createQueryBuilder('compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('compte.qualite', 'qualite')
            .leftJoinAndSelect('compte.compteContacts', 'compte_contacts')
            .where('idFranchise = :idFranchise', {idFranchise: idFranchise});

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getMany();
    }

    async count(idFranchise: number, inQuery: string): Promise<number> {
        let query = this.compteRepository.createQueryBuilder('compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .where('idFranchise = :idFranchise', {idFranchise: idFranchise});

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }
        return await query.getCount();
    }

    async findById(idCompte): Promise<Compte> {
        const options = {
            relations: ['adresse', 'bureau', 'compteContacts',
                'compteContacts.contact', 'compteContacts.contact.adresse',
                'grilleTarifs', 'qualite']
        };
        return await this.compteRepository.findOneOrFail(idCompte, options)
    }

    async create(compte: Compte): Promise<Compte> {
        // console.log(compte);
        const newCompte = await this.compteRepository.create(compte);
        const newAdresse = await this.adresseRepository.create(compte.adresse);
        newCompte.adresse = newAdresse;

        const latLng: LatLng = await this.geocodingService.getLatLng(newAdresse.adresse, newAdresse.cp)
        newAdresse.latitude = latLng.latitude;
        newAdresse.longitude = latLng.longitude;

        await this.adresseRepository.save(newAdresse);
        const newSavedCompte = await this.compteRepository.save(newCompte);
        for (const compteContact of compte.compteContacts) {
            compteContact.idContact = compteContact.contact.id;
            compteContact.idCompte = newSavedCompte.id;
            const newCompteContact = await this.compteContactRepository.create(compteContact);
            await this.compteContactRepository.save(newCompteContact);
            newCompte.compteContacts.push(newCompteContact);
        }
        return newSavedCompte
    }

    async update(compte: Compte): Promise<Compte> {
        // console.log(compte);
        await this.compteContactRepository.createQueryBuilder().delete().where('idCompte = :idCompte', {idCompte: compte.id}).execute();
        for (const compteContact of compte.compteContacts) {
            compteContact.idContact = compteContact.contact.id;
            compteContact.idCompte = compte.id;
            const newCompteContact = await this.compteContactRepository.create(compteContact);
            await this.compteContactRepository.save(newCompteContact)
        }
        await delete compte.compteContacts;

        const latLng: LatLng = await this.geocodingService.getLatLng(compte.adresse.adresse, compte.adresse.cp)
        compte.adresse.latitude = latLng.latitude;
        compte.adresse.longitude = latLng.longitude;

        await this.adresseRepository.update(compte.adresse.id, compte.adresse);
        return await this.compteRepository.save(compte)
    }

    async getWithTarif(idCompte: number): Promise<Compte> {
        return await this.compteRepository.createQueryBuilder('compte')
            .leftJoinAndSelect('compte.compteContacts', 'compteContacts')
            .leftJoinAndSelect('compteContacts.contact', 'contact')
            .leftJoinAndSelect('compte.grilleTarifs', 'grilleTarifs')
            .where('compte.id = :idCompte', {idCompte: idCompte})
            .getOne()
    }

    async delete(idCompte: number) {
        const compte = await this.compteRepository.createQueryBuilder('compte')
            .where('id = :id', {id: idCompte}).getOne();
        return await this.compteRepository.remove(compte)
    }

    async getForXlsx(idFranchise: number): Promise<Compte[]> {
        return await this.compteRepository.createQueryBuilder('compte')
            .leftJoinAndSelect('compte.adresse', 'adresse')
            .leftJoinAndSelect('compte.qualite', 'qualite')
            .where('idFranchise = :idFranchise', {idFranchise: idFranchise})
            .getMany()
    }
}
