import { Injectable } from '@nestjs/common';
import { DevisCommande } from './devis-commande.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';
import { Franchise } from '../franchise/franchise.entity';
import { HistoriqueService } from '../historique/historique.service';
import { DevisCommandeDetail } from '../devis-commande-detail/devis-commande-detail.entity';
import { EnumTypeDevis, EnumStatutCommande, EnumTypeContactDevisCommande } from '@aleaac/shared';
import { ContactService } from '../contact/contact.service';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { Compte } from '../compte/compte.entity';
import { ContactDevisCommande } from '../contact-devis-commande/contact-devis-commande.entity';
import { TypeContactDevisCommande } from '../type-contact-devis-commande/type-contact-devis-commande.entity';
import { GeocodingService } from '../geocoding/geocoding';
import { Adresse } from '@aleaac/shared/src/models/adresse.model';

@Injectable()
export class DevisCommandeService {
    enumTypeDevis = EnumTypeDevis;
    enumTypeContactDevisCommande = EnumTypeContactDevisCommande;

    constructor(
        @InjectRepository(DevisCommande)
        private readonly devisCommandeRepository: Repository<DevisCommande>,
        @InjectRepository(Franchise)
        private readonly franchiseRepository: Repository<Franchise>,
        @InjectRepository(DevisCommandeDetail)
        private readonly devisCommandeDetailRepository: Repository<DevisCommandeDetail>,
        @InjectRepository(ContactDevisCommande)
        private readonly contactDevisCommandeRepository: Repository<ContactDevisCommande>,
        @InjectRepository(TypeContactDevisCommande)
        private readonly typeContactDevisCommandeRepository: Repository<TypeContactDevisCommande>,
        @InjectRepository(Adresse)
        private readonly adresseRepository: Repository<Adresse>,
        private queryService: QueryService,
        private historiqueService: HistoriqueService,
        private contactService: ContactService,
        private statutService: StatutCommandeService,
        private readonly geocodingService: GeocodingService,
    ) { }


    async find(options: FindManyOptions<DevisCommande>): Promise<DevisCommande[]> {
        return this.devisCommandeRepository.find(options);
    }

    async get(idDevisCommande: number): Promise<DevisCommande> {
        return await this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.bureau', 'bureau')
            .leftJoinAndSelect('bureau.adresse', 'adresseBureau')
            .leftJoinAndSelect('bureau.franchise', 'franchise')
            .leftJoinAndSelect('devisCommande.contactDevisCommandes', 'contactDevisCommandes')
            .leftJoinAndSelect('contactDevisCommandes.contact', 'contact')
            .leftJoinAndSelect('contact.civilite', 'civilite')
            .leftJoinAndSelect('contact.adresse', 'adresseContact')
            .leftJoinAndSelect('contact.compteContacts', 'compteContacts')
            .leftJoinAndSelect('compteContacts.compte', 'compte')
            .leftJoinAndSelect('compte.adresse', 'adresseCompte')
            .leftJoinAndSelect('devisCommande.devisCommandeDetails', 'devisCommandeDetails')
            .leftJoinAndSelect('contactDevisCommandes.typeContactDevisCommande', 'typeContactDevisCommande')
            .leftJoinAndSelect('compte.grilleTarifs', 'grilleTarifs')
            .leftJoinAndSelect('devisCommande.statut', 'statut')
            .leftJoinAndSelect('devisCommande.adresse', 'adresse')
            .where('devisCommande.id = :idDevisCommande', { idDevisCommande: idDevisCommande })
            .getOne()
    }

    async getAll(idFranchise: number, inQuery: string): Promise<DevisCommande[]> {
        let query = this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.statut', 'statut_commande')
            .leftJoinAndSelect('devisCommande.contactDevisCommandes', 'contactDevisCommandes')
            .leftJoinAndSelect('contactDevisCommandes.contact', 'contact')
            .leftJoinAndSelect('contact.compteContacts', 'compteContacts')
            .leftJoinAndSelect('compteContacts.compte', 'compte')
            .where('devisCommande.idFranchise = :idFranchise', { idFranchise: idFranchise });
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async getAllByIdFormation(idFormation:number,idFranchise: number, inQuery: string): Promise<DevisCommande[]> {
        let query = this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.statut', 'statut_commande')
            .leftJoinAndSelect('devisCommande.contactDevisCommandes', 'contactDevisCommandes')
            .leftJoinAndSelect('contactDevisCommandes.contact', 'contact')
            .leftJoinAndSelect('contact.compteContacts', 'compteContacts')
            .leftJoinAndSelect('compteContacts.compte', 'compte')
            .where('devisCommande.idFranchise = :idFranchise', { idFranchise: idFranchise })
            .andWhere('devisCommande.idFormation=:idFormation', { idFormation: idFormation })
            .orderBy('devisCommande.id','DESC');
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }


    async countAll(idFranchise: number, inQuery: string): Promise<number> {
        let query = this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.statut', 'statut_commande')
            .where('idFranchise = :idFranchise', { idFranchise: idFranchise });
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getCount();
    }

    async create(requestBody: DevisCommande, req): Promise<DevisCommande> {
        requestBody.dateCreation = new Date();
        requestBody.idStatutCommande = EnumStatutCommande.DEVIS_EN_SAISIE.valueOf();
        const franchise = await this.franchiseRepository.createQueryBuilder('franchise')
            .where('franchise.id = :idFranchise', { idFranchise: requestBody.idFranchise })
            .getOne();
        const lastDevisCommande = await this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .where('devisCommande.idFranchise = :idFranchise', { idFranchise: franchise.id }).orderBy('id', 'DESC').getOne();
        if (lastDevisCommande) {
            requestBody.ref = lastDevisCommande.ref + 1;
        } else {
            requestBody.ref = 1;
        }

        let newDevisCommande = await this.devisCommandeRepository.create(requestBody);

        const newAdresse = await this.adresseRepository.create(newDevisCommande.adresse);
        newDevisCommande.adresse = newAdresse;
        await this.adresseRepository.save(newAdresse);

        newDevisCommande = await this.devisCommandeRepository.save(newDevisCommande);

        const client = requestBody.contactDevisCommandes.find((contact) => {
            return contact.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
        });

        const contact = await this.contactService.getWithTarif(client.idContact);

        client.idDevisCommande = newDevisCommande.id;

        const newClient = this.contactDevisCommandeRepository.create(client);
        this.contactDevisCommandeRepository.save(newClient);

        if (contact.compteContacts && contact.compteContacts.compte) {
            let tarifSpecifique = 'Tarif spécifique : '
            if (contact.compteContacts.compte.grilleTarifs.length > 0) {
                for (const grille of contact.compteContacts.compte.grilleTarifs) {
                    tarifSpecifique += '- ' + grille.reference + '\n';
                }
            } else {
                tarifSpecifique += 'Aucun';
            }

            this.historiqueService.add(req.user.id, 'devis-commande', newDevisCommande.id,
                'Création du devis \n' +
                'Type : ' + this.enumTypeDevis[newDevisCommande.typeDevis] + '\n' +
                'Compte : ' + contact.compteContacts.compte.raisonSociale + ' ( id : ' + contact.compteContacts.compte.id + ' )\n' +
                tarifSpecifique
            );

            // Dans le cas où l'on lie un contact depuis le compte, faut le mettre "isLinked"
            contact.isLinked = true;
            this.contactService.update(contact);
        } else {
            this.historiqueService.add(req.user.id, 'devis-commande', newDevisCommande.id,
                'Création du devis \n' +
                'Type : ' + this.enumTypeDevis[newDevisCommande.typeDevis] + '\n' +
                'Contact ( Particulier ) : ' + contact.nom + ' ( id : ' + contact.id + ' )'
            );
        }

        return newDevisCommande
    }

    async update(requestBody: DevisCommande, req): Promise<DevisCommande> {
        const oldDevisCommande = await this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.statut', 'statut')
            .leftJoinAndSelect('devisCommande.contactDevisCommandes', 'contactDevisCommandes')
            .leftJoinAndSelect('devisCommande.devisCommandeDetails', 'devisCommandeDetails')
            .where('devisCommande.id = :idDevisCommande', { idDevisCommande: requestBody.id }).getOne();

        let historique = '';
        // modification page information
        if (requestBody.idStatutCommande !== oldDevisCommande.idStatutCommande) {
            const oldStatus = await this.statutService.get(oldDevisCommande.idStatutCommande);
            const newStatus = await this.statutService.get(requestBody.idStatutCommande);

            requestBody.statut = newStatus;

            historique += 'Changement de statut : ' + oldStatus.nom + ' => ' + newStatus.nom;
            if (newStatus.isJustificationNecessaire) {
                historique += ' avec la raison : ' + JSON.stringify(requestBody.raisonStatutCommande);
            }
            historique += '\n';
        }

        // modif adresse
        if (requestBody.adresse) {
            await this.adresseRepository.update(requestBody.adresse.id, requestBody.adresse);
        }

        const oldClient = oldDevisCommande.contactDevisCommandes.find((client) => {
            return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
        });
        const newClient = requestBody.contactDevisCommandes.find((client) => {
            return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
        });

        if (!oldClient || oldClient.idContact !== newClient.idContact || requestBody.typeDevis !== oldDevisCommande.typeDevis) {
            if (requestBody.typeDevis !== oldDevisCommande.typeDevis) {
                historique += 'Modification type de devis \n ' + this.enumTypeDevis[oldDevisCommande.typeDevis] +
                    ' => ' + this.enumTypeDevis[requestBody.typeDevis] + '\n'
            }

            if (!oldClient || oldClient.idContact !== newClient.idContact) {

                if (!oldClient) {
                    const contactDevisCommande = new ContactDevisCommande();
                    contactDevisCommande.idTypeContactDevisCommande = this.enumTypeContactDevisCommande.CLIENT;
                    contactDevisCommande.idContact = newClient.idContact;
                    contactDevisCommande.idDevisCommande = requestBody.id;

                    const newContactDevisCommande = await this.contactDevisCommandeRepository.create(contactDevisCommande);
                    await this.contactDevisCommandeRepository.save(newContactDevisCommande);

                } else {
                    const oldContactDevisCommande = await this.contactDevisCommandeRepository
                        .createQueryBuilder('contactDevisCommande')
                        .where('id = :id', { id: oldClient.id }).getOne();

                    oldContactDevisCommande.idContact = newClient.idContact;

                    await this.contactDevisCommandeRepository.save(oldContactDevisCommande);
                }

                const contact = await this.contactService.getWithTarif(newClient.idContact);

                if (contact.compteContacts && contact.compteContacts.compte) {
                    let tarifSpecifique = 'Tarif spécifique : ';
                    if (contact.compteContacts.compte.grilleTarifs.length > 0) {
                        for (const grille of contact.compteContacts.compte.grilleTarifs) {
                            tarifSpecifique += '- ' + grille.reference + '\n';
                        }
                    } else {
                        tarifSpecifique += 'Aucun';
                    }
                    historique += 'Modification client \nNouveau client => Compte : '
                        + contact.compteContacts.compte.raisonSociale
                        + ' ( id : ' + contact.compteContacts.compte.id + ' )\n'
                        + tarifSpecifique;

                } else {
                    historique += 'Modification client \nNouveau client => Contact ( Particulier ) : '
                        + contact.nom
                        + ' ( id : ' + contact.id + ' )';
                }
            }
        } else { // modification page detail
            for (const devisCommandeDetail of oldDevisCommande.devisCommandeDetails) {
                const findDetail = requestBody.devisCommandeDetails.find((detail) => {
                    return detail.id === devisCommandeDetail.id;
                });
                if (findDetail) { // potentielement modifié
                    if (findDetail.montantRemise !== devisCommandeDetail.montantRemise) {
                        historique += 'Modification prix remisé ' + devisCommandeDetail.description + ' : '
                            + devisCommandeDetail.montantRemise + ' => ' + findDetail.montantRemise + '\n';
                    }
                    this.devisCommandeDetailRepository.save(findDetail);
                } else { // ligne supprimé
                    historique += 'Suppression ' + devisCommandeDetail.description + '\n';
                    this.devisCommandeDetailRepository.delete(devisCommandeDetail.id)
                }
            }

            for (const devisCommandeDetail of requestBody.devisCommandeDetails) {
                if (!devisCommandeDetail.id) { // nouvelle ligne
                    if (devisCommandeDetail.idProduit) {
                        historique += 'Ajout produit ' + devisCommandeDetail.description
                            + ' ( idProduit : ' + devisCommandeDetail.idProduit
                            + ', prix : ' + devisCommandeDetail.montantHT + ', prix remisé ' + devisCommandeDetail.montantRemise + ' ) \n';
                    } else {
                        historique += 'Ajout ligne libre ' + devisCommandeDetail.description
                            + ', prix : ' + devisCommandeDetail.montantHT + ', prix remisé ' + devisCommandeDetail.montantRemise + ' ) \n';
                    }

                    const newDetail = await this.devisCommandeDetailRepository.create(devisCommandeDetail);
                    requestBody.devisCommandeDetails.push(newDetail);
                    await this.devisCommandeDetailRepository.save(newDetail);
                }
            }
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'devis-commande', requestBody.id, historique);
        }
        delete requestBody.contactDevisCommandes;
        return await this.devisCommandeRepository.save(requestBody)
    }

    async partialUpdate(requestBody: DevisCommande, req): Promise<DevisCommande> {
        const oldDevisCommande = await this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.statut', 'statut')
            .leftJoinAndSelect('devisCommande.contactDevisCommandes', 'contactDevisCommandes')
            .leftJoinAndSelect('devisCommande.devisCommandeDetails', 'devisCommandeDetails')
            .where('devisCommande.id = :idDevisCommande', { idDevisCommande: requestBody.id }).getOne();

        let historique = '';
        // modification page information
        if (requestBody.idStatutCommande && requestBody.idStatutCommande !== oldDevisCommande.idStatutCommande) {
            const oldStatus = await this.statutService.get(oldDevisCommande.idStatutCommande);
            const newStatus = await this.statutService.get(requestBody.idStatutCommande);

            historique += 'Changement de statut : ' + oldStatus.nom + ' => ' + newStatus.nom;
            if (newStatus.isJustificationNecessaire) {
                historique += ' avec la raison : ' + requestBody.motifAbandonCommande.nom;
                if (requestBody.raisonStatutCommande) {
                    historique += '(' + JSON.stringify(requestBody.raisonStatutCommande) + ')';
                }
            }
            historique += '\n';
        }

        // modif adresse
        if (requestBody.adresse) {
            await this.adresseRepository.update(requestBody.adresse.id, requestBody.adresse);
        }

        if (requestBody.contactDevisCommandes) {
            const oldClient = oldDevisCommande.contactDevisCommandes.find((client) => {
                return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
            });
            const newClient = requestBody.contactDevisCommandes.find((client) => {
                return client.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
            });

            if ((oldClient.idContact !== newClient.idContact)
                || (requestBody.typeDevis && requestBody.typeDevis !== oldDevisCommande.typeDevis)) {
                if (requestBody.typeDevis !== oldDevisCommande.typeDevis) {
                    historique += 'Modification type de devis \n ' + this.enumTypeDevis[oldDevisCommande.typeDevis] +
                        ' => ' + this.enumTypeDevis[requestBody.typeDevis] + '\n'
                }
                if (oldClient.idContact !== newClient.idContact) {
                    const contact = await this.contactService.getWithTarif(newClient.idContact);

                    if (contact.compteContacts && contact.compteContacts.compte) {
                        let tarifSpecifique = 'Tarif spécifique : ';
                        if (contact.compteContacts.compte.grilleTarifs.length > 0) {
                            for (const grille of contact.compteContacts.compte.grilleTarifs) {
                                tarifSpecifique += '- ' + grille.reference + '\n';
                            }
                        } else {
                            tarifSpecifique += 'Aucun';
                        }
                        historique += 'Modification client \nNouveau client => Compte : '
                            + contact.compteContacts.compte.raisonSociale
                            + ' ( id : ' + contact.compteContacts.compte.id + ' )\n'
                            + tarifSpecifique;

                    } else {
                        historique += 'Modification client \nNouveau client => Contact ( Particulier ) : '
                            + contact.nom
                            + ' ( id : ' + contact.id + ' )';
                    }
                }
            } else if (requestBody.devisCommandeDetails) { // modification page detail
                for (const devisCommandeDetail of oldDevisCommande.devisCommandeDetails) {
                    const findDetail = requestBody.devisCommandeDetails.find((detail) => {
                        return detail.id === devisCommandeDetail.id;
                    });
                    if (findDetail) { // potentielement modifié
                        if (findDetail.montantRemise !== devisCommandeDetail.montantRemise) {
                            historique += 'Modification prix remisé ' + devisCommandeDetail.description + ' : '
                                + devisCommandeDetail.montantRemise + ' => ' + findDetail.montantRemise + '\n';
                        }
                        this.devisCommandeDetailRepository.save(findDetail);
                    } else { // ligne supprimé
                        historique += 'Suppression ' + devisCommandeDetail.description + '\n';
                        this.devisCommandeDetailRepository.delete(devisCommandeDetail.id)
                    }
                }

                for (const devisCommandeDetail of requestBody.devisCommandeDetails) {
                    if (!devisCommandeDetail.id) { // nouvelle ligne
                        if (devisCommandeDetail.idProduit) {
                            historique += 'Ajout produit ' + devisCommandeDetail.description
                                + ' ( idProduit : ' + devisCommandeDetail.idProduit
                                + ', prix : ' + devisCommandeDetail.montantHT + ', prix remisé ' + devisCommandeDetail.montantRemise + ' ) \n';
                        } else {
                            historique += 'Ajout ligne libre ' + devisCommandeDetail.description
                                + ', prix : ' + devisCommandeDetail.montantHT + ', prix remisé ' + devisCommandeDetail.montantRemise + ' ) \n';
                        }

                        const newDetail = await this.devisCommandeDetailRepository.create(devisCommandeDetail);
                        requestBody.devisCommandeDetails.push(newDetail);
                        await this.devisCommandeDetailRepository.save(newDetail);
                    }
                }
            }
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'devis-commande', requestBody.id, historique);
        }

        return await this.devisCommandeRepository.save(requestBody);
    }


    async delete(@CurrentUtilisateur() user, id: number): Promise<any> {
        const oldDevisCommande = await this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.statut', 'statut')
            .leftJoinAndSelect('devisCommande.devisCommandeDetails', 'devisCommandeDetails')
            .where('devisCommande.id = :idDevisCommande', { idDevisCommande: id }).getOne();

        try {
            this.historiqueService.add(user.id, 'devis-commande', id, 'Delete definitif : ' + JSON.stringify(oldDevisCommande));
        } catch (e) {
            console.error(e);
        }
        return await this.devisCommandeRepository.remove(await this.get(id));
    }

    async getForXlsx(idFranchise: number): Promise<DevisCommande[]> {
        return await this.devisCommandeRepository.createQueryBuilder('devisCommande')
            .leftJoinAndSelect('devisCommande.adresse', 'adresse')
            .leftJoinAndSelect('devisCommande.contactDevisCommandes', 'contactDevisCommande')
            .leftJoinAndSelect('contactDevisCommande.contact', 'contact')
            .leftJoinAndSelect('devisCommande.statut', 'statut')
            .leftJoinAndSelect('devisCommande.bureau', 'bureau')
            .where('devisCommande.idFranchise = :idFranchise', { idFranchise: idFranchise })
            .getMany()
    }

    // Contact Devis Commande

    async getContactDevisCommande(idContactDevisCommande): Promise<ContactDevisCommande> {
        return await this.contactDevisCommandeRepository.createQueryBuilder('contactDevisCommande')
            .leftJoinAndSelect('contactDevisCommande.contact', 'contact')
            .where('contactDevisCommande.id = :idContactDevisCommande', { idContactDevisCommande: idContactDevisCommande }).getOne()
    }

    async deleteContactDevisCommande(contactDevisCommande: ContactDevisCommande) {
        return await this.contactDevisCommandeRepository.delete(contactDevisCommande)
    }

    async addContact(contactDevisCommande: ContactDevisCommande): Promise<ContactDevisCommande> {
        delete contactDevisCommande.typeContactDevisCommande;
        delete contactDevisCommande.devisCommande;
        delete contactDevisCommande.contact;
        const newContactDevisCommande = await this.contactDevisCommandeRepository.create(contactDevisCommande);

        return await this.contactDevisCommandeRepository.save(newContactDevisCommande)
    }

    // TypeContact
    async getAllType(): Promise<TypeContactDevisCommande[]> {
        return await this.typeContactDevisCommandeRepository.createQueryBuilder('typeContact').getMany()
    }
}