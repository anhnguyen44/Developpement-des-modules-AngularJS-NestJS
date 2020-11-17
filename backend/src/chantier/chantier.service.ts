import { Injectable, Delete } from '@nestjs/common';
import { Chantier } from './chantier.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryService } from '../query/query.service';
import { Franchise } from '../franchise/franchise.entity';
import { HistoriqueService } from '../historique/historique.service';
import { EnumTypeDevis, EnumStatutCommande } from '@aleaac/shared';
import { ContactService } from '../contact/contact.service';
import { StatutCommandeService } from '../statut-commande/statut-commande.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';

@Injectable()
export class ChantierService {
  enumTypeDevis = EnumTypeDevis;

  constructor(
    @InjectRepository(Chantier)
    private readonly chantierRepository: Repository<Chantier>,
    @InjectRepository(Franchise)
    private readonly franchiseRepository: Repository<Franchise>,
    private queryService: QueryService,
    private historiqueService: HistoriqueService,
    private contactService: ContactService,
    private statutService: StatutCommandeService
  ) { }

  async get(idChantier: number): Promise<Chantier> {
    return await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut')
      .leftJoinAndSelect('chantier.client', 'client')
      .leftJoinAndSelect('client.adresse', 'clientAdresse')
      .leftJoinAndSelect('chantier.bureau', 'bureau')
      .leftJoinAndSelect('bureau.adresse', 'bureauAdresse')
      .leftJoinAndSelect('client.compteContacts', 'compteContacts')
      .leftJoinAndSelect('client.civilite', 'civiliteClient')
      .leftJoinAndSelect('compteContacts.compte', 'compte')
      .leftJoinAndSelect('compte.grilleTarifs', 'grilleTarifs')
      .leftJoinAndSelect('grilleTarifs.details', 'details')
      .leftJoinAndSelect('chantier.chargeClient', 'chargeClient')
      .leftJoinAndSelect('chargeClient.fonction', 'fonctionChargeClient')
      .leftJoinAndSelect('chantier.redacteurStrategie', 'redacteurStrategie')
      .leftJoinAndSelect('redacteurStrategie.civilite', 'civiliteRedacteurStrategie')
      .leftJoinAndSelect('redacteurStrategie.fonction', 'fonctionRedacteurStrategie')
      .leftJoinAndSelect('redacteurStrategie.signature', 'signatureRedacteurStrategie')
      .leftJoinAndSelect('chantier.valideurStrategie', 'valideurStrategie')
      .leftJoinAndSelect('valideurStrategie.civilite', 'cviliteValideurStrategie')
      .leftJoinAndSelect('valideurStrategie.fonction', 'fonctionValideurStrategie')
      .leftJoinAndSelect('valideurStrategie.signature', 'signatureValideurStrategie')
      .leftJoinAndSelect('chantier.contacts', 'contacts')
      .leftJoinAndSelect('contacts.contact', 'contact')
      .leftJoinAndSelect('contact.compteContacts', 'compteContactsBis')
      .leftJoinAndSelect('compteContactsBis.compte', 'compteBis')
      .leftJoinAndSelect('contact.civilite', 'civilite')
      .leftJoinAndSelect('chantier.besoinClient', 'besoinClient')
      .leftJoinAndSelect('besoinClient.objectifs', 'objectifs')
      .leftJoinAndSelect('chantier.strategies', 'strategies')
      .leftJoinAndSelect('chantier.sitesPrelevement', 'sitesPrelevement')
      .leftJoinAndSelect('sitesPrelevement.adresse', 'adresseSitePrelevement')
      .leftJoinAndSelect('strategies.zonesIntervention', 'zonesIntervention')
      .leftJoinAndSelect('chantier.ordreInterventionGlobal', 'ordreInterventionGlobal')
      .leftJoinAndSelect('chantier.ordreInterventionGlobalSigne', 'ordreInterventionGlobalSigne')
      .where('chantier.id = :idChantier', { idChantier: idChantier })
      .getOne()
  }

  async getSimple(idChantier: number): Promise<Chantier> {
    return await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut')
      .where('chantier.id = :idChantier', { idChantier: idChantier })
      .getOne()
  }

  async getZI(idChantier: number): Promise<ZoneIntervention[]> {
    const chantier = await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.strategies', 'strategies')
      .leftJoinAndSelect('strategies.zonesIntervention', 'zonesIntervention')
      .leftJoinAndSelect('zonesIntervention.batiment', 'batiment')
      .leftJoinAndSelect('zonesIntervention.processusZone', 'processusZone')
      .leftJoinAndSelect('processusZone.processus', 'processus')
      .leftJoinAndSelect('processusZone.listeGES', 'GES')
      .leftJoinAndSelect('processus.tachesRetrait', 'tachesRetrait')
      .leftJoinAndSelect('processus.tachesRepli', 'tachesRepli')
      .leftJoinAndSelect('processus.tachesInstallation', 'tachesInstallation')
      .leftJoinAndSelect('zonesIntervention.environnements', 'environnements')
      .where('chantier.id = :idChantier', { idChantier: idChantier })
      .getOne();

    const zonesIntervention: ZoneIntervention[] = [];

    for (const strategie of chantier.strategies) {
      for (const zi of strategie.zonesIntervention) {
        zonesIntervention.push(zi);
      }
    }
    return zonesIntervention
  }

  async getAll(idFranchise: number, inQuery: string): Promise<Chantier[]> {
    let query = this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut_commande')
      .leftJoinAndSelect('chantier.client', 'client')
      .leftJoinAndSelect('client.compteContacts', 'compteContacts')
      .leftJoinAndSelect('compteContacts.compte', 'compte')
      .where('chantier.idFranchise = :idFranchise', { idFranchise: idFranchise });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getMany();
  }

  async countAll(idFranchise: number, inQuery: string): Promise<number> {
    let query = this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut_commande')
      .where('idFranchise = :idFranchise', { idFranchise: idFranchise });
    query = this.queryService.parseQuery(query, inQuery);
    return await query.getCount();
  }

  async create(requestBody: Chantier, req): Promise<Chantier> {
    requestBody.createdAt = new Date();
    requestBody.idStatut = EnumStatutCommande.LABO_STRAT_A_REALISER.valueOf();
    const franchise = await this.franchiseRepository.createQueryBuilder('franchise')
      .where('franchise.id = :idFranchise', { idFranchise: requestBody.idFranchise })
      .getOne();
    const lastChantier = await this.chantierRepository.createQueryBuilder('chantier')
      .where('chantier.idFranchise = :idFranchise', { idFranchise: franchise.id }).orderBy('id', 'DESC').getOne();
    if (lastChantier) {
      requestBody.reference = lastChantier.reference + 1;
    } else {
      requestBody.reference = 1;
    }
    let newChantier = await this.chantierRepository.create(requestBody);

    newChantier = await this.chantierRepository.save(newChantier);

    // console.log(requestBody);

    let client;
    if (!requestBody.client && requestBody.idClient) {
      client = await this.contactService.findById(requestBody.idClient);
    } else {
      client = requestBody.client;
    }

    if (client.civilite) {
      delete client.civilite;
    }
    if (client.adresse) {
      delete client.adresse;
    }
    if (client.fonction) {
      delete client.fonction;
    }
    if (client.bureau) {
      delete client.bureau;
    }
    if (client.compteContacts) {
      delete client.compteContacts;
    }

    const contact = await this.contactService.getWithTarif(client.id);

    if (contact.compteContacts && contact.compteContacts.compte) {
      let tarifSpecifique = 'Tarif spécifique : '
      if (contact.compteContacts.compte.grilleTarifs.length > 0) {
        for (const grille of contact.compteContacts.compte.grilleTarifs) {
          tarifSpecifique += '- ' + grille.reference + '\n';
        }
      } else {
        tarifSpecifique += 'Aucun';
      }

      this.historiqueService.add(req.user.id, 'chantier', newChantier.id,
        'Création du Chantier \n' +
        'Compte : ' + contact.compteContacts.compte.raisonSociale + ' ( id : ' + contact.compteContacts.compte.id + ' )\n' +
        tarifSpecifique
      );

      // Dans le cas où l'on lie un contact depuis le compte, faut le mettre "isLinked"
      contact.isLinked = true;
      this.contactService.update(contact);
    } else {
      this.historiqueService.add(req.user.id, 'chantier', newChantier.id,
        'Création du Chantier \n' +
        'Contact ( Particulier ) : ' + contact.nom + ' ( id : ' + contact.id + ' )'
      );
    }

    return newChantier
  }

  async update(requestBody: Chantier, req): Promise<Chantier> {
    requestBody.updatedAt = new Date();
    const oldChantier = await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut')
      .leftJoinAndSelect('chantier.client', 'client')
      .leftJoinAndSelect('client.compteContacts', 'compteContacts')
      .leftJoinAndSelect('compteContacts.compte', 'compte')
      .leftJoinAndSelect('compte.grilleTarifs', 'grilleTarifs')
      .leftJoinAndSelect('chantier.chargeClient', 'chargeClient')
      .leftJoinAndSelect('chantier.redacteurStrategie', 'redacteurStrategie')
      .leftJoinAndSelect('chantier.valideurStrategie', 'valideurStrategie')
      .where('chantier.id = :idChantier', { idChantier: requestBody.id }).getOne();

    let historique = '';
    // modification page information
    if (requestBody.idStatut !== oldChantier.idStatut) {
      const oldStatus = await this.statutService.get(oldChantier.idStatut);
      const newStatus = await this.statutService.get(requestBody.idStatut);

      historique += 'Changement de statut : ' + oldStatus.nom + ' => ' + newStatus.nom;
      historique += '\n';
    }

    if (requestBody.idClient !== oldChantier.idClient) {
      if (requestBody.idClient !== oldChantier.idClient) {
        const contact = await this.contactService.getWithTarif(requestBody.idClient);

        if (contact.compteContacts && contact.compteContacts.compte) {
          let tarifSpecifique = 'Tarif spécifique : '
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
    }

    if (historique.length > 0) {
      this.historiqueService.add(req.user.id, 'chantier', requestBody.id, historique);
    }

    if (requestBody.besoinClient) {
      requestBody.idBesoinClient = requestBody.besoinClient.id
      delete requestBody.besoinClient;
    }

    return await this.chantierRepository.save(requestBody)
  }

  async partialUpdate(requestBody: Chantier, req): Promise<Chantier> {
    requestBody.updatedAt = new Date();
    const oldChantier = await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut')
      .leftJoinAndSelect('chantier.client', 'client')
      .leftJoinAndSelect('client.compteContacts', 'compteContacts')
      .leftJoinAndSelect('compteContacts.compte', 'compte')
      .leftJoinAndSelect('compte.grilleTarifs', 'grilleTarifs')
      .leftJoinAndSelect('chantier.chargeClient', 'chargeClient')
      .leftJoinAndSelect('chantier.redacteurStrategie', 'redacteurStrategie')
      .leftJoinAndSelect('chantier.valideurStrategie', 'valideurStrategie')
      .where('chantier.id = :idChantier', { idChantier: requestBody.id }).getOne();

    let historique = '';
    // modification page information
    if (requestBody.idStatut && requestBody.idStatut !== oldChantier.idStatut) {
      const oldStatus = await this.statutService.get(oldChantier.idStatut);
      const newStatus = await this.statutService.get(requestBody.idStatut);

      historique += 'Changement de statut : ' + oldStatus.nom + ' => ' + newStatus.nom;
      historique += '\n';
    }

    if ((requestBody.idClient && requestBody.idClient !== oldChantier.idClient)) {
      if (requestBody.idClient !== oldChantier.idClient) {
        const contact = await this.contactService.getWithTarif(requestBody.idClient);

        if (contact.compteContacts && contact.compteContacts.compte) {
          let tarifSpecifique = 'Tarif spécifique : '
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
    }

    if (historique.length > 0) {
      this.historiqueService.add(req.user.id, 'chantier', requestBody.id, historique);
    }

    return await this.chantierRepository.save(requestBody);
  }


  async delete(@CurrentUtilisateur() user, id: number): Promise<any> {
    const oldChantier = await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.statut', 'statut')
      .where('chantier.id = :idChantier', { idChantier: id }).getOne();

    try {
      this.historiqueService.add(user.id, 'chantier', id, 'Delete definitif : ' + JSON.stringify(oldChantier));
    } catch (e) {
      console.log(e);
    }
    return await this.chantierRepository.remove(await this.get(id));
  }

  async getForGenerate(idChantier: number): Promise<Chantier> {
    return await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.interventions', 'intervention')
      .leftJoinAndSelect('chantier.franchise', 'franchise')
      .leftJoinAndSelect('chantier.bureau', 'bureau')
      .leftJoinAndSelect('bureau.adresse', 'adresseBureau')
      .leftJoinAndSelect('intervention.siteIntervention', 'siteIntervention')
      .leftJoinAndSelect('siteIntervention.adresse', 'adresse')
      .leftJoinAndSelect('intervention.rendezVous', 'rendezVous')
      .leftJoinAndSelect('chantier.client', 'client')
      .leftJoinAndSelect('client.adresse', 'adresseClient')
      .leftJoinAndSelect('client.compteContacts', 'compteContacts')
      .leftJoinAndSelect('compteContacts.compte', 'compte')
      .leftJoinAndSelect('intervention.prelevements', 'prelevement')
      .leftJoinAndSelect('prelevement.objectif', 'objectif')
      .where('chantier.id = :idChantier', { idChantier: idChantier })
      .getOne()
  }

  async importPaintDiag(idChantier: number): Promise<Chantier> {
    return await this.chantierRepository.createQueryBuilder('chantier')
      .leftJoinAndSelect('chantier.prelevements', 'prelevements')
      .leftJoinAndSelect('chantier.sitesPrelevement', 'sitesPrelevement')
      .leftJoinAndSelect('sitesPrelevement.batiments', 'batiments')
      .where('chantier.id = :idChantier', { idChantier: idChantier })
      .getOne();
  }
}