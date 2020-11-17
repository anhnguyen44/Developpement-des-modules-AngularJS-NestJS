import { Injectable } from '@nestjs/common';
import { Contact } from './contact.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Adresse } from '../adresse/adresse.entity';
import { CompteContact } from '../compte-contact/compte-contact.entity';
import { QueryService } from '../query/query.service';
import { Compte } from '../compte/compte.entity';
import { GeocodingService } from '../geocoding/geocoding';
import { LatLng } from '../geocoding/LatLng';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
        @InjectRepository(Adresse)
        private readonly adresseRepository: Repository<Adresse>,
        @InjectRepository(CompteContact)
        private readonly compteContactRepository: Repository<CompteContact>,
        private readonly queryService: QueryService,
        private readonly geocodingService: GeocodingService,
    ) { }

    async getAll(idFranchise: number, inQuery: string): Promise<Contact[]> {

        let query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .leftJoinAndSelect('contact.compteContacts', 'compte_contact')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise });

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getMany();
    }

    async getAllForCompte(idCompte: number, inQuery: string): Promise<Contact[]> {
        const optionsCptContact: FindManyOptions<CompteContact> = {
            where: {
                idCompte: idCompte
            },
        }
        const listCompteContact = await this.compteContactRepository.find(optionsCptContact);
        const idsContact: Array<number> = new Array<number>();
        for (const compteContact of listCompteContact) {
            idsContact.push(compteContact.idContact);
        }
        let query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .where('contact.id IN(:listIds)', { listIds: idsContact });

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getMany();
    }

    async countAllForCompte(idCompte: number, inQuery: string): Promise<number> {
        const optionsCptContact: FindManyOptions<CompteContact> = {
            where: {
                idCompte: idCompte
            },
        }
        const listCompteContact = await this.compteContactRepository.find(optionsCptContact);
        const idsContact: Array<number> = new Array<number>();
        for (const compteContact of listCompteContact) {
            idsContact.push(compteContact.idContact);
        }
        let query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .where('contact.id IN(:listIds)', { listIds: idsContact });

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getCount();
    }

    async getAllFree(idFranchise: number, inQuery: string): Promise<Contact[]> {

        let query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .leftJoinAndSelect('contact.compteContacts', 'compteContacts')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise })
            .andWhere('compteContacts.id is null')
        ;

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getMany();
    }

    async countAll(idFranchise: number, inQuery: string): Promise<number> {
        const query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.compteContacts', 'compte_contact')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise });
        if (inQuery) {
            this.queryService.parseQuery(query, inQuery)
        }
        return await query.getCount();
    }

    async countAllFree(idFranchise: number, inQuery: string): Promise<number> {
        let query = this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .leftJoinAndSelect('contact.compteContacts', 'compteContacts')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise })
            .andWhere('compteContacts.id is null')
        ;

        if (inQuery) {
            query = this.queryService.parseQuery(query, inQuery);
        }

        return await query.getCount();
    }

    async findById(idInterlocuteur): Promise<Contact> {
        // console.log('id interlocuteur :' + idInterlocuteur);
        const options = {
            relations: ['civilite', 'adresse', 'fonction', 'bureau', 'compteContacts',
                'compteContacts.compte', 'compteContacts.compte.adresse', 'compteContacts.compte.qualite', 'utilisateur']
        };
        return await this.contactRepository.findOneOrFail(idInterlocuteur, options)
    }

    async create(contact: Contact): Promise<Contact> {
        const newContact = await this.contactRepository.create(contact);
        const newAdresse = await this.adresseRepository.create(contact.adresse);
        newContact.adresse = newAdresse;

        const latLng: LatLng = await this.geocodingService.getLatLng(newAdresse.adresse, newAdresse.cp)
        newAdresse.latitude = latLng.latitude;
        newAdresse.longitude = latLng.longitude;

        await this.adresseRepository.save(newAdresse);
        const savedNewContact = await this.contactRepository.save(newContact);

        if (contact.compteContacts && contact.compteContacts.compte.id) {
            await this.compteContactRepository.createQueryBuilder().delete()
                .where('idContact = :idContact', { idContact: contact.id }).execute();
            contact.compteContacts.idContact = savedNewContact.id;
            contact.compteContacts.idCompte = contact.compteContacts.compte.id;
            const newCompteContact = await this.compteContactRepository.create(contact.compteContacts);
            await this.compteContactRepository.save(newCompteContact);
        }
        return savedNewContact;
    }

    async update(contact: Contact): Promise<Contact> {
        if (contact.compteContacts) {
            try {
                await this.compteContactRepository.createQueryBuilder()
                    .delete().where('idContact = :idContact', { idContact: contact.id }).execute();
                contact.compteContacts.idContact = contact.id;
                if (contact.compteContacts.compte) {
                    contact.compteContacts.idCompte = contact.compteContacts.compte.id;
                }
                const newCompteContact = await this.compteContactRepository.create(contact.compteContacts);
                await this.compteContactRepository.save(newCompteContact);
                // delete contact.compteContacts;
            } catch (e) {
                console.error(e);
            }
        }
        if (contact.adresse) {
            const latLng: LatLng = await this.geocodingService.getLatLng(contact.adresse.adresse, contact.adresse.cp)
            contact.adresse.latitude = latLng.latitude;
            contact.adresse.longitude = latLng.longitude;
            
            await this.adresseRepository.update(contact.adresse.id, contact.adresse);
        }

        return await this.contactRepository.save(contact)
    }

    async getSecteur(idFranchise): Promise<string[]> {
        const listeSecteurs = await this.contactRepository.createQueryBuilder('i')
            .select('DISTINCT (i.secteur)', 'secteur')
            .where('i.idFranchise = :idFranchise', { idFranchise: idFranchise })
            .getRawMany();

        const secteurs = [];
        for (const secteur of listeSecteurs) {
            secteurs.push(secteur.secteur)
        }
        return secteurs
    }

    async getWithTarif(idContact: number): Promise<Contact> {
        return await this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.compteContacts', 'compteContacts')
            .leftJoinAndSelect('compteContacts.compte', 'compte')
            .leftJoinAndSelect('compte.grilleTarifs', 'grilleTarifs')
            .where('contact.id = :idContact', { idContact: idContact })
            .getOne()
    }

    async findByIdUser(idUser: number): Promise<Contact> {
        return await this.contactRepository.createQueryBuilder('contact')
            .where('idUtilisateur = :idUtilisateur', { idUtilisateur: idUser }).getOne()
    }

    async getForXlsx(idFranchise: number): Promise<Contact[]> {
        return await this.contactRepository.createQueryBuilder('contact')
            .leftJoinAndSelect('contact.adresse', 'adresse')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise })
            .getMany()
    }
}
