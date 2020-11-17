import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategie } from './strategie.entity';
import { QueryService } from '../query/query.service';
import {
    EnumTypeFichier, EnumEnvironnement, EnumTypeZoneIntervention, EnumAppareilsProtectionRespiratoire, EnumEmpoussierementGeneral,
    EnumConfinement, EnumTypeDeChantier, EnumTypeBatimentsForWord, EnumTypeTemplate, EnumTypeBesoinLabo, GES, EnumTypeAnalysePrelevement,
    EnumListeMateriauxAmiante, EnumEtatDegradation, EnumEtendueDegradation, EnumProtection, EnumEtancheite, EnumExpositionAir,
    EnumExpositionChocs, EnumTypeActivite, EnumDensiteOccupationTheorique, EnumStatutOccupationZone, EnumTypeLocal, EnumResultatExamenAmiante
} from '@aleaac/shared';
import { Fichier } from '../fichier/fichier.entity';
import { Objectif } from '../objectif/objectif.entity';
import { SitePrelevement } from '../site-prelevement/site-prelevement.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { ChantierService } from '../chantier/chantier.service';
import { FranchiseService } from '../franchise/franchise.service';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { MpcaService } from '../mpca/mpca.service';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { PrelevementService } from '../prelevement/prelevement.service';
import { FichierService } from '../fichier/fichier.service';
import { TemplateVersionService } from '../template-version/template-version.service';
import { HistoriqueService } from '../historique/historique.service';
import { TacheProcessus } from '../tache-processus/tache-processus.entity';
import { MateriauZone } from '../materiau-zone/materiau-zone.entity';
import { MateriauConstructionAmiante } from '../materiau-construction-amiante/materiau-construction-amiante.entity';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';


@Injectable()
export class StrategieService {
    constructor(
        @InjectRepository(Strategie)
        private readonly strategieRepository: Repository<Strategie>,
        private queryService: QueryService,
        private chantierService: ChantierService,
        private franchiseService: FranchiseService,
        private infosBesoinService: InfosBesoinClientLaboService,
        private mpcaService: MpcaService,
        private outilTechniqueService: OutilTechniqueService,
        private travailHumideService: TravailHumideService,
        private captageAspirationService: CaptageAspirationSourceService,
        private prelevementService: PrelevementService,
        private fichierService: FichierService,
        private templateVersionService: TemplateVersionService,
        private historiqueService: HistoriqueService,
    ) { }

    async getAll(idChantier: number, inQuery) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .leftJoinAndSelect('strategie.zonesIntervention', 'zonesIntervention')
            .leftJoinAndSelect('strategie.moments', 'moments')
            .where('strategie.idChantier = :idChantier', { idChantier: idChantier });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countAll(idChantier: number, inQuery: string) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .where('strategie.idChantier = :idChantier', { idChantier: idChantier });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async getSS3(idChantier: number, inQuery) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .leftJoinAndSelect('strategie.zonesIntervention', 'zonesIntervention')
            .leftJoinAndSelect('strategie.moments', 'moments')
            .where('(strategie.sousSection = :sousSection OR strategie.sousSection = :sousSectionNumber) AND strategie.idChantier = :idChantier',
                { sousSection: 'SS3', sousSectionNumber: '1', idChantier: idChantier })
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countSS3(idChantier: number, inQuery: string) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .where('(strategie.sousSection = :sousSection OR strategie.sousSection = :sousSectionNumber) AND strategie.idChantier = :idChantier',
                { sousSection: 'SS3', sousSectionNumber: '1', idChantier: idChantier })
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async getSS4(idChantier: number, inQuery) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .leftJoinAndSelect('strategie.zonesIntervention', 'zonesIntervention')
            .leftJoinAndSelect('strategie.moments', 'moments')
            .where('(strategie.sousSection = :sousSection OR strategie.sousSection = :sousSectionNumber) AND strategie.idChantier = :idChantier',
                { sousSection: 'SS4', sousSectionNumber: '2', idChantier: idChantier })
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countSS4(idChantier: number, inQuery: string) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .where('(strategie.sousSection = :sousSection OR strategie.sousSection = :sousSectionNumber) AND strategie.idChantier = :idChantier',
                { sousSection: 'SS4', sousSectionNumber: '2', idChantier: idChantier })
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async getCSP(idChantier: number, inQuery) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .leftJoinAndSelect('strategie.zonesIntervention', 'zonesIntervention')
            .leftJoinAndSelect('strategie.moments', 'moments')
            .where('strategie.sousSection IS NULL AND strategie.idChantier = :idChantier', { idChantier: idChantier });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getMany()
    }

    async countCSP(idChantier: number, inQuery: string) {
        let query = this.strategieRepository
            .createQueryBuilder('strategie')
            .where('strategie.sousSection IS NULL AND strategie.idChantier = :idChantier', { idChantier: idChantier });
        query = this.queryService.parseQuery(query, inQuery);

        return await query.getCount()
    }

    async getForStrat(idStrategie: number): Promise<Strategie> {
        return await this.strategieRepository.createQueryBuilder('strategie')
            .leftJoinAndSelect('strategie.zonesIntervention', 'zonesIntervention')
            .leftJoinAndSelect('zonesIntervention.batiment', 'batiment')
            .leftJoinAndSelect('zonesIntervention.horaires', 'horaires')
            .leftJoinAndSelect('zonesIntervention.materiauxZone', 'materiauxZone')
            .leftJoinAndSelect('materiauxZone.materiau', 'materiau')
            .leftJoinAndSelect('zonesIntervention.processusZone', 'processusZone')
            .leftJoinAndSelect('zonesIntervention.locaux', 'locaux')
            .leftJoinAndSelect('zonesIntervention.environnements', 'environnements')
            .leftJoinAndSelect('zonesIntervention.listeGES', 'listeGES')
            .leftJoinAndSelect('zonesIntervention.echantillonnages', 'echantillonnages')
            .leftJoinAndSelect('echantillonnages.objectif', 'objectif')
            .leftJoinAndSelect('echantillonnages.prelevements', 'prelevements')
            .leftJoinAndSelect('strategie.moments', 'moments')
            .where('strategie.id = :idStrategie', { idStrategie: idStrategie }).getOne()
    }

    async get(idStrategie: number): Promise<Strategie> {
        return await this.strategieRepository.createQueryBuilder('strategie')
            .leftJoinAndSelect('strategie.zonesIntervention', 'zonesIntervention')
            .leftJoinAndSelect('strategie.moments', 'moments')
            .where('strategie.id = :idStrategie', { idStrategie: idStrategie }).getOne()
    }

    async create(strategie: Strategie): Promise<Strategie> {
        const newStrategie = await this.strategieRepository.create(strategie);
        return await this.strategieRepository.save(newStrategie);
    }

    async update(strategie: Strategie): Promise<Strategie> {
        return await this.strategieRepository.save(strategie);
    }

    async delete(idStrategie: number) {
        return await this.strategieRepository.delete(idStrategie);
    }

    parseIntituleClient(client): string {
        let res = '';
        if (client.nom) {
            if (client.compteContacts) {
                res = client.compteContacts.compte.raisonSociale;
            } else {
                res = client.civilite ? client.civilite.nom + ' ' : '';
                res += client.nom + ' ' + client.prenom;
            }
        } else {
            res = client.raisonSociale;
        }

        return res;
    }

    async getDataForStrategie(params: any, req: any) {
        const chantier = await this.chantierService.get(params.idChantier);
        const franchise = await this.franchiseService.findOneById(chantier.idFranchise);
        const nomFichier = 'STR-' + franchise.trigramme + '-' + chantier.id + '-V' + chantier.versionStrategie;
        const data: any = { chantier: chantier };

        data.nomFichier = nomFichier;
        data.hasSignatureRedacteur = chantier.redacteurStrategie.idSignature
            && chantier.redacteurStrategie.idSignature > 0
            && chantier.redacteurStrategie.signature;
        data.chantier.signatureRedacteur = data.hasSignatureRedacteur
            ? './uploads/' + chantier.redacteurStrategie.signature.keyDL
            : null;
        data.hasSignatureValideur = chantier.valideurStrategie.idSignature
            && chantier.valideurStrategie.idSignature > 0
            && chantier.valideurStrategie.signature;
        data.chantier.signatureValideur = data.hasSignatureValideur
            ? './uploads/' + chantier.valideurStrategie.signature.keyDL
            : null;

        const client = chantier.client;
        data.client = client;

        let contactClient = '';
        if (client.adresse && (client.adresse.email || client.adresse.telephone)) {
            contactClient += '(';
            if (client.adresse.email) {
                contactClient += 'Email : ' + client.adresse.email;
            }
            if (client.adresse.email && client.adresse.telephone) {
                contactClient += ' ou ';
            }
            if (client.adresse.telephone) {
                contactClient += 'Téléphone : ' + client.adresse.telephone;
            }
            contactClient += ')';
        }
        data.contactClient = contactClient;
        const today = new Date();
        data.dateGeneration = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        this.historiqueService.add(req.user.id, 'chantier', params.idChantier, 'Génération fichier : ' + nomFichier);
        // Infos spécifiques au devis LABO
        // Data supplémentaire
        // chantier, template
        data.chantier.franchise = await this.franchiseService.findOneById(data.chantier.idFrancise);
        data.chantier.besoinClient.informations = await this.infosBesoinService.find({
            where: {
                idBesoinClientLabo: data.chantier.besoinClient.id
            }
        });

        // Pour la stratégie, il faut déterminer dans quel cadre on est
        data.isCT = chantier.besoinClient.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_TRAVAIL;
        data.codeLoi = data.isCT ? 'Code du Travail' : 'Code de la Santé Publique';
        data.denominationClientCSP = this.parseIntituleClient(data.client);

        // Plans du périmètre d'investigation
        const plansPerim =
            await this.fichierService.getAllByType('chantier', data.chantier.id, EnumTypeFichier.CHANTIER_PLAN_PERIMETRE);

        data.chantier.plansPerimetre = new Array();
        for (const plan of plansPerim) {
            data.chantier.plansPerimetre.push({ image: './uploads/' + plan.keyDL });
        }

        data.zonesIntervention = await this.chantierService.getZI(data.chantier.id);
        data.processusZone = new Array<ProcessusZone>();
        for (const zi of (data.zonesIntervention as Array<ZoneIntervention>)) {
            if (zi.type === EnumTypeZoneIntervention.ZT) {
                for (const pz of zi.processusZone) {
                    data.processusZone.push(pz);
                }
            }
        }
        // On remplace toutes les Enum par du texte et les id aussi
        const listeMPCA = await this.mpcaService.getAll();
        const listeOutilTechnique = await this.outilTechniqueService.getAll();
        const listeTravailHumide = await this.travailHumideService.getAll();
        const listeCaptageAspiration = await this.captageAspirationService.getAll();
        for (const pz of data.processusZone) {
            pz.typeBatiment = EnumTypeBatimentsForWord[pz.processus.idTypeBatiment];
            pz.typeDeChantier = this.ucFirst(EnumTypeDeChantier[pz.typeChantier]);
            pz.mpca = listeMPCA.find(m => m.id === pz.processus.idMpca).nom;
            pz.outilTechnique = listeOutilTechnique.find(m => m.id === pz.processus.idOutilTechnique).nom;
            pz.travailHumide = listeTravailHumide.find(m => m.id === pz.processus.idTravailHumide).nom;
            pz.captageAspiration = listeCaptageAspiration.find(m => m.id === pz.processus.idCaptageAspirationSource).nom;
            pz.confinement = this.ucFirst(EnumConfinement[data.zonesIntervention.find(z => z.id === pz.idZoneIntervention).confinement]);
            pz.empoussierementGeneralAttendu = this.ucFirst(EnumEmpoussierementGeneral[pz.idEmpoussierementGeneralAttendu]);
            pz.appareilsProtectionRespiratoire = EnumAppareilsProtectionRespiratoire[pz.idAppareilsProtectionRespiratoire];
            pz.zoneIntervention = data.zonesIntervention.find(z => z.id === pz.idZoneIntervention);
            // /!\ Attention, ça ne marche que parce qu'on a dégagé le GES et qu'on fait des "séquences unitaires" à la place
            if ((pz as ProcessusZone).listeGES && (pz as ProcessusZone).listeGES.length > 0) {
                pz.descriptionGES = (pz as ProcessusZone).listeGES[0].nom;
            } else {
                pz.descriptionGES = '';
            }
        }
        data.chantier.environnements = [];
        for (const zi of data.zonesIntervention) {
            if (zi.environnements) {
                for (const env of zi.environnements) {
                    if (data.chantier.environnements.indexOf(env) === -1) {
                        data.chantier.environnements.push(env);
                    }
                }
            }
        }
        data.chantier.airUrbain = data.chantier.environnements.findIndex(e => e.id === EnumEnvironnement.AIR_URBAIN) > -1;
        data.chantier.airCampagne = data.chantier.environnements.findIndex(e => e.id === EnumEnvironnement.AIR_CAMPAGNE) > -1;
        data.chantier.airInterieur =
            (data.zonesIntervention as Array<ZoneIntervention>).findIndex(z => z.type === EnumTypeZoneIntervention.ZH) > -1
            || data.chantier.environnements.findIndex(e => e.id === EnumEnvironnement.MILIEU_INTERIEUR) > -1;
        data.hasBureauComplementAdresse = !!data.chantier.bureau.adresse.complement;
        data.bureauHasCofrac = data.chantier.bureau.numeroAccreditation && data.chantier.bureau.numeroAccreditation.length > 0;

        if (!data.bureauHasCofrac) {
            data.chantier.isCOFRAC = false;
            data.chantier.justifNonCOFRAC = 'Ce laboratoire Aléa Contrôles est en attente d\'un numéro d\'accréditation COFRAC';
        }

        data.chantier.adresseComplete = '';
        let i = 0;
        for (const siteInterv of (data.chantier.sitesPrelevement as SitePrelevement[])) {
            i++;
            data.chantier.adresseComplete += siteInterv.adresse.adresse;
            if (siteInterv.adresse.complement) {
                data.chantier.adresseComplete += ',' + '\n' + siteInterv.adresse.complement;
            }
            data.chantier.adresseComplete += ',' + '\n' + siteInterv.adresse.cp + ' ' + siteInterv.adresse.ville;
            // Dans le cas de plusieurs sites d'intervntion, on met toutes les adresses
            if ((data.chantier.sitesPrelevement as SitePrelevement[]).length > 1
                && i < (data.chantier.sitesPrelevement as SitePrelevement[]).length) {
                data.chantier.adresseComplete += '\n' + '\n';
            }
        }
        // Objectifs
        data.objectifs = [];
        data.totalMetAir = 0;
        data.totalMetaOp = 0;
        const prelevements = await this.prelevementService.getAllByType('idChantier', data.chantier.id, null);
        for (const prel of prelevements) {
            // Pour déterminer les objectifs à réaliser on parcourt les prélèvements du chantier
            // Si l'objectif n'est pas encore trouvé, on l'ajoute à la liste, sinon on augmente son 'count'
            const indexCurrent = data.objectifs.findIndex(o => o.id === prel.idObjectif
                && o.idZoneIntervention === prel.idZIPrel // Pour la strat faut pas,c'était pour le devis
            );
            if (indexCurrent === -1) {
                prel.zoneIntervention = data.zonesIntervention.find(z => z.id === prel.idZIPrel);
                const mater = prel.objectif.description.split(' - ')[0];
                if (prel.zoneIntervention) {
                    data.objectifs.push({
                        ...prel.objectif, idZoneIntervention: prel.idZIPrel,
                        zoneIntervention: prel.zoneIntervention.reference, count: 1, materiaux: mater
                    });
                } else {
                    data.objectifs.push({
                        ...prel.objectif, idZoneIntervention: null,
                        zoneIntervention: null, count: 1, materiaux: mater
                    });
                }
            } else {
                data.objectifs[indexCurrent].count++;
            }

            if (prel.objectif.isMesureOperateur) {
                data.totalMetaOp++;
            } else {
                data.totalMetAir++;
            }
        }

        // CT
        data.objectifsMetAir = [...data.objectifs].filter(o => !o.isMesureOperateur);
        data.hasMetAir = data.objectifsMetAir.length > 0;
        data.objectifsMetaOp = [...data.objectifs].filter(o => o.isMesureOperateur);
        data.hasMetaOp = data.objectifsMetaOp.length > 0;
        data.hasJ = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'J') > -1;
        data.hasIK = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'I' || o.code === 'K') > -1;
        data.hasG = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'G') > -1;
        data.hasHLMNOPQRS = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'H' || o.code === 'L' ||
            o.code === 'M' || o.code === 'N' || o.code === 'O' || o.code === 'P' || o.code === 'Q' || o.code === 'R'
            || o.code === 'S') > -1;
        data.hasTUVWX = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'T' || o.code === 'U'
            || o.code === 'V' || o.code === 'W' || o.code === 'X') > -1;

        // CSP
        data.hasABCD = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'A' || o.code === 'B' ||
            o.code === 'C' || o.code === 'D') > -1;
        data.hasEF = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'E' || o.code === 'F') > -1;
        data.hasY = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'Y') > -1;
        data.hasAnnexesCSP = (data.objectifs as Array<Objectif>).findIndex(o => o.code.indexOf('Annexe') > -1) > -1;

        // Annexes B
        data.hasAnnexeBPt0 = (data.objectifs as Array<Objectif>).findIndex(o => o.code.indexOf('Pt0') > -1) > -1;
        data.hasAnnexeB = data.objectifs.findIndex(o => o.code.indexOf('Pt0') === -1 && o.code.indexOf('Annexe') > -1) > -1;


        // Il fallait bien garder les objectifs par ZH/ZT pour la synthèse (qui se base sur objectifsMetaOp et objectifsMetaAir)
        // par contre il faut dédoublonner pour les annexes
        data.objectifsAnnexes = new Array<Objectif>();
        for (const objo of data.objectifs) {
            if (data.objectifsAnnexes.findIndex(o => o.code === objo.code) === -1) {
                data.objectifsAnnexes.push(objo);
            }
        }

        data.objectifsAnnexes = (data.objectifsAnnexes as Array<Objectif>).sort((a, b) => { return a.id < b.id ? -1 : 1; });

        data.documentsPresents = [false, false, false, false, false, false, false, false, false, false];
        data.fichiers = await this.fichierService.getAll('chantier', data.chantier.id);
        data.txtFichiersFournis = '';
        data.fichiers.forEach(fichier => {
            switch (fichier.idTypeFichier) {
                case EnumTypeFichier.CHANTIER_PDRE_SS3:
                    data.documentsPresents[0] = true;
                    break;
                case EnumTypeFichier.CHANTIER_LISTE_PROCESS:
                    data.documentsPresents[1] = true;
                    break;
                case EnumTypeFichier.CHANTIER_MODE_OP:
                    data.documentsPresents[2] = true;
                    break;
                case EnumTypeFichier.CHANTIER_PIC:
                    data.documentsPresents[3] = true;
                    break;
                case EnumTypeFichier.CHANTIER_PLANNING_INFO:
                    data.documentsPresents[4] = true;
                    break;
                case EnumTypeFichier.CHANTIER_REPERAGE_AMIANTE:
                    data.documentsPresents[5] = true;
                    break;
                case EnumTypeFichier.CHANTIER_PHOTOS:
                    data.documentsPresents[6] = true;
                    break;
                case EnumTypeFichier.CHANTIER_PLANS:
                    data.documentsPresents[7] = true;
                    break;
                case EnumTypeFichier.CHANTIER_PDRE_CSP:
                    data.documentsPresents[8] = true;
                    break;
                case EnumTypeFichier.AUTRE:
                    data.documentsPresents[9] = true;
                    break;
            }
        });
        if (data.documentsPresents[0]) {
            data.txtFichiersFournis += 'Plan de retrait';
            if (data.documentsPresents[1] || data.documentsPresents[2] || data.documentsPresents[3]
                || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[1]) {
            data.txtFichiersFournis += 'Liste des processus' + '\n';
            if (data.documentsPresents[2] || data.documentsPresents[3]
                || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[2]) {
            data.txtFichiersFournis += 'Mode opératoire' + '\n';
            if (data.documentsPresents[3]
                || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[3]) {
            data.txtFichiersFournis += 'Plan d\'installation chantier' + '\n';
            if (data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[4]) {
            data.txtFichiersFournis += 'Planning des informations' + '\n';
            if (data.documentsPresents[5] || data.documentsPresents[6]
                || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[5]) {
            data.txtFichiersFournis += 'Repérage amiante avant travaux' + '\n';
            if (data.documentsPresents[6]
                || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[6]) {
            data.txtFichiersFournis += 'Photos' + '\n';
            if (data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[7]) {
            data.txtFichiersFournis += 'Plans' + '\n';
            if (data.documentsPresents[8] || data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[8]) {
            data.txtFichiersFournis += 'Plan de retrait de l\'entreprise de désamiantage' + '\n';
            if (data.documentsPresents[9]) {
                data.txtFichiersFournis += ', ';
            }
        }
        if (data.documentsPresents[9]) {
            data.txtFichiersFournis += 'Autres :' + '\n';
            data.fichiersAutres = ([...data.fichiers] as Array<Fichier>).filter(f => f.idTypeFichier === EnumTypeFichier.AUTRE);
            data.hasFichiersAutres = true;
        }
        data.template = await this.templateVersionService.getVersion(EnumTypeTemplate.LABO_STRATEGIE);
        data.template.dateDebut = (new Date(data.template.dateDebut))
            .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        data.fichierTemplate = await this.fichierService.getById(data.template.idFichier);
        data.template.nom = data.fichierTemplate.nom;
        data.template.typeTemplate = data.fichierTemplate.nom;

        // STRAT METAOP
        data.pzI = new Array<ProcessusZone>();
        data.hasPZI = false; // On fait le "double tableau" dans le document pour chaque objectif qui a des prélèvements
        data.pzJ = new Array<ProcessusZone>();
        data.hasPZJ = false;
        data.pzK = new Array<ProcessusZone>();
        data.hasPZK = false;

        data.chantier.prelevements = await this.prelevementService.getAllByType('idChantier', data.chantier.id, null);

        for (const prel of data.chantier.prelevements) {
            switch (prel.objectif.code) {
                case 'I':
                    if (data.pzI.findIndex(pz => pz && pz.id === prel.idProcessusZone) === -1) {
                        data.pzI.push(prel.processusZone);
                    }

                    data.hasPZI = true;
                    break;
                case 'J':
                    if (data.pzJ.findIndex(pz => pz && pz.id === prel.idProcessusZone) === -1) {
                        data.pzJ.push(prel.processusZone);
                    }

                    data.hasPZJ = true;
                    break;
                case 'K':
                    if (data.pzK.findIndex(pz => pz && pz.id === prel.idProcessusZone) === -1) {
                        data.pzK.push(prel.processusZone);
                    }

                    data.hasPZK = true;
                    break;
                default:
                    break;
            }
        }

        if (data.pzI && data.pzI.length > 0) {
            for (const pz1 of data.pzI) {
                // Oui ça a l'air stupide, mais il parcourt des trucs vides
                if (pz1) {
                    pz1.typeBatiment = EnumTypeBatimentsForWord[pz1.processus.idTypeBatiment];
                    pz1.typeDeChantier = this.ucFirst(EnumTypeDeChantier[pz1.typeChantier]);
                    pz1.mpca = listeMPCA.find(m => m.id === pz1.processus.idMpca).nom;
                    pz1.outilTechnique = listeOutilTechnique.find(m => m.id === pz1.processus.idOutilTechnique).nom;
                    pz1.travailHumide = listeTravailHumide.find(m => m.id === pz1.processus.idTravailHumide).nom;
                    pz1.captageAspiration = listeCaptageAspiration.find(m => m.id === pz1.processus.idCaptageAspirationSource).nom;
                    pz1.confinement =
                        this.ucFirst(EnumConfinement[data.zonesIntervention.find(z => z.id === pz1.idZoneIntervention).confinement]);
                    pz1.empoussierementGeneralAttendu = this.ucFirst(EnumEmpoussierementGeneral[pz1.idEmpoussierementGeneralAttendu]);
                    pz1.appareilsProtectionRespiratoire = EnumAppareilsProtectionRespiratoire[pz1.idAppareilsProtectionRespiratoire];
                    pz1.zoneIntervention = data.zonesIntervention.find(z => z.id === pz1.idZoneIntervention);
                    pz1.tsatMin = Math.min(pz1.tsatP, pz1.processus.tsatA);
                    // /!\ Attention, ça ne marche que parce qu'on a dégagé le GES et qu'on fait des "séquences unitaires" à la place
                    if ((pz1 as ProcessusZone).listeGES && (pz1 as ProcessusZone).listeGES.length > 0) {
                        pz1.descriptionGES = (pz1 as ProcessusZone).listeGES[0].nom;
                        pz1.taches = (pz1 as ProcessusZone).listeGES[0].taches;
                        pz1.ges = (pz1 as ProcessusZone).listeGES[0];
                        pz1.nbPompesParOp = pz1.ges.nbPompes / pz1.nombreOperateurs;
                        pz1.nbFiltresParPompe = pz1.ges.nbFiltres / pz1.ges.nbPompes;
                        pz1.tEffectif = pz1.processus.tmin / (pz1.nombreOperateurs * pz1.nbPompesParOp);
                        // Le nb de pompes du GEs c'est le nb de pompes par op * nb Op
                        pz1.tMaxPrel = (pz1 as ProcessusZone).tr * pz1.ges.nbPompes;
                        switch (pz1.typeAnalyse) {
                            case EnumTypeAnalysePrelevement.CONJOINT:
                                pz1.typeAnalyseString = 'Analyse conjointe';
                                break;
                            case EnumTypeAnalysePrelevement.SOUS_GROUPE:
                                pz1.typeAnalyseString = 'Analysé par sous-groupes';
                                break;
                            case EnumTypeAnalysePrelevement.SOUS_GROUPE:
                                pz1.typeAnalyseString = 'Prélèvements analysés séparément';
                                break;
                        }
                    } else {
                        pz1.descriptionGES = '';
                        pz1.taches = [];
                        pz1.ges = new GES();
                        pz1.nbPompesParOp = 2;
                        pz1.nbFiltresParPompe = 2;
                        pz1.tMaxPrel = 240;
                        pz1.typeAnalyseString = '';
                    }

                    pz1.tachesGlobales = new Array<TacheProcessus>();
                    if ((pz1 as ProcessusZone).processus.tachesInstallation) {
                        for (const tacheInstall1 of pz1.processus.tachesInstallation) {
                            pz1.tachesGlobales.push(tacheInstall1);
                        }
                    }
                    if ((pz1 as ProcessusZone).processus.tachesRetrait) {
                        for (const tacheRetrait1 of pz1.processus.tachesRetrait) {
                            pz1.tachesGlobales.push(tacheRetrait1);
                        }
                    }
                    if ((pz1 as ProcessusZone).processus.tachesRepli) {
                        for (const tacheRepli1 of pz1.processus.tachesRepli) {
                            pz1.tachesGlobales.push(tacheRepli1);
                        }
                    }
                }
            }
        }

        if (data.pzJ && data.pzJ.length > 0) {
            for (const pz2 of data.pzJ) {
                if (pz2) {
                    pz2.typeBatiment = EnumTypeBatimentsForWord[pz2.processus.idTypeBatiment];
                    pz2.typeDeChantier = this.ucFirst(EnumTypeDeChantier[pz2.typeChantier]);
                    pz2.mpca = listeMPCA.find(m => m.id === pz2.processus.idMpca).nom;
                    pz2.outilTechnique = listeOutilTechnique.find(m => m.id === pz2.processus.idOutilTechnique).nom;
                    pz2.travailHumide = listeTravailHumide.find(m => m.id === pz2.processus.idTravailHumide).nom;
                    pz2.captageAspiration = listeCaptageAspiration.find(m => m.id === pz2.processus.idCaptageAspirationSource).nom;
                    pz2.confinement =
                        this.ucFirst(EnumConfinement[data.zonesIntervention.find(z => z.id === pz2.idZoneIntervention).confinement]);
                    pz2.empoussierementGeneralAttendu = this.ucFirst(EnumEmpoussierementGeneral[pz2.idEmpoussierementGeneralAttendu]);
                    pz2.appareilsProtectionRespiratoire = EnumAppareilsProtectionRespiratoire[pz2.idAppareilsProtectionRespiratoire];
                    pz2.zoneIntervention = data.zonesIntervention.find(z => z.id === pz2.idZoneIntervention);
                    pz2.tsatMin = Math.min(pz2.tsatP, pz2.processus.tsatA);
                    // /!\ Attention, ça ne marche que parce qu'on a dégagé le GES et qu'on fait des "séquences unitaires" à la place
                    if ((pz2 as ProcessusZone).listeGES && (pz2 as ProcessusZone).listeGES.length > 0) {
                        pz2.descriptionGES = (pz2 as ProcessusZone).listeGES[0].nom;
                        pz2.taches = (pz2 as ProcessusZone).listeGES[0].taches;
                        pz2.ges = (pz2 as ProcessusZone).listeGES[0];
                        pz2.nbPompesParOp = pz2.ges.nbPompes / pz2.nombreOperateurs;
                        pz2.nbFiltresParPompe = pz2.ges.nbFiltres / pz2.ges.nbPompes;
                        pz2.tEffectif = pz2.processus.tmin / (pz2.nombreOperateurs * pz2.nbPompesParOp);
                        pz2.tMaxPrel = (pz2 as ProcessusZone).tr * pz2.ges.nbPompes;
                        switch (pz2.typeAnalyse) {
                            case EnumTypeAnalysePrelevement.CONJOINT:
                                pz2.typeAnalyseString = 'Analyse conjointe';
                                break;
                            case EnumTypeAnalysePrelevement.SOUS_GROUPE:
                                pz2.typeAnalyseString = 'Analysé par sous-groupes';
                                break;
                            case EnumTypeAnalysePrelevement.SOUS_GROUPE:
                                pz2.typeAnalyseString = 'Prélèvements analysés séparément';
                                break;
                        }
                    } else {
                        pz2.descriptionGES = '';
                        pz2.taches = [];
                        pz2.ges = new GES();
                        pz2.nbPompesParOp = 2;
                        pz2.nbFiltresParPompe = 2;
                        pz2.tMaxPrel = 240;
                        pz2.typeAnalyseString = '';
                    }

                    pz2.tachesGlobales = new Array<TacheProcessus>();
                    if ((pz2 as ProcessusZone).processus.tachesInstallation) {
                        for (const tacheInstall2 of pz2.processus.tachesInstallation) {
                            pz2.tachesGlobales.push(tacheInstall2);
                        }
                    }
                    if ((pz2 as ProcessusZone).processus.tachesRetrait) {
                        for (const tacheRetrait2 of pz2.processus.tachesRetrait) {
                            pz2.tachesGlobales.push(tacheRetrait2);
                        }
                    }
                    if ((pz2 as ProcessusZone).processus.tachesRepli) {
                        for (const tacheRepli2 of pz2.processus.tachesRepli) {
                            pz2.tachesGlobales.push(tacheRepli2);
                        }
                    }
                }
            }
        }

        if (data.pzK && data.pzK.length > 0) {
            for (const pz3 of data.pzK) {
                if (pz3) {
                    pz3.typeBatiment = EnumTypeBatimentsForWord[pz3.processus.idTypeBatiment];
                    pz3.typeDeChantier = this.ucFirst(EnumTypeDeChantier[pz3.typeChantier]);
                    pz3.mpca = listeMPCA.find(m => m.id === pz3.processus.idMpca).nom;
                    pz3.outilTechnique = listeOutilTechnique.find(m => m.id === pz3.processus.idOutilTechnique).nom;
                    pz3.travailHumide = listeTravailHumide.find(m => m.id === pz3.processus.idTravailHumide).nom;
                    pz3.captageAspiration = listeCaptageAspiration.find(m => m.id === pz3.processus.idCaptageAspirationSource).nom;
                    pz3.confinement = this.ucFirst(EnumConfinement[data.zonesIntervention.find(z => z.id === pz3.idZoneIntervention).confinement]);
                    pz3.empoussierementGeneralAttendu = this.ucFirst(EnumEmpoussierementGeneral[pz3.idEmpoussierementGeneralAttendu]);
                    pz3.appareilsProtectionRespiratoire = EnumAppareilsProtectionRespiratoire[pz3.idAppareilsProtectionRespiratoire];
                    pz3.zoneIntervention = data.zonesIntervention.find(z => z.id === pz3.idZoneIntervention);
                    pz3.tsatMin = Math.min(pz3.tsatP, pz3.processus.tsatA);
                    // /!\ Attention, ça ne marche que parce qu'on a dégagé le GES et qu'on fait des "séquences unitaires" à la place
                    if ((pz3 as ProcessusZone).listeGES && (pz3 as ProcessusZone).listeGES.length > 0) {
                        pz3.descriptionGES = (pz3 as ProcessusZone).listeGES[0].nom;
                        pz3.taches = (pz3 as ProcessusZone).listeGES[0].taches;
                        pz3.ges = (pz3 as ProcessusZone).listeGES[0];
                        pz3.nbPompesParOp = pz3.ges.nbPompes / pz3.nombreOperateurs;
                        pz3.nbFiltresParPompe = pz3.ges.nbFiltres / pz3.ges.nbPompes;
                        pz3.tEffectif = pz3.processus.tmin / (pz3.nombreOperateurs * pz3.nbPompesParOp);
                        pz3.tMaxPrel = (pz3 as ProcessusZone).tr * pz3.ges.nbPompes;

                        switch (pz3.typeAnalyse) {
                            case EnumTypeAnalysePrelevement.CONJOINT:
                                pz3.typeAnalyseString = 'Analyse conjointe';
                                break;
                            case EnumTypeAnalysePrelevement.SOUS_GROUPE:
                                pz3.typeAnalyseString = 'Analysé par sous-groupes';
                                break;
                            case EnumTypeAnalysePrelevement.SOUS_GROUPE:
                                pz3.typeAnalyseString = 'Prélèvements analysés séparément';
                                break;
                        }
                    } else {
                        pz3.descriptionGES = '';
                        pz3.taches = [];
                        pz3.ges = new GES();
                        pz3.nbPompesParOp = 2;
                        pz3.nbFiltresParPompe = 2;
                        pz3.tMaxPrel = 240;
                        pz3.typeAnalyseString = '';
                    }

                    // Description globale du processus
                    pz3.tachesGlobales = new Array<TacheProcessus>();
                    if ((pz3 as ProcessusZone).processus.tachesInstallation) {
                        for (const tacheInstall3 of pz3.processus.tachesInstallation) {
                            pz3.tachesGlobales.push(tacheInstall3);
                        }
                    }
                    if ((pz3 as ProcessusZone).processus.tachesRetrait) {
                        for (const tacheRetrait3 of pz3.processus.tachesRetrait) {
                            pz3.tachesGlobales.push(tacheRetrait3);
                        }
                    }
                    if ((pz3 as ProcessusZone).processus.tachesRepli) {
                        for (const tacheRepli3 of pz3.processus.tachesRepli) {
                            pz3.tachesGlobales.push(tacheRepli3);
                        }
                    }
                }
            }
        }

        // STRAT METAIR
        // TODO : Séparer SS3/SS4 et par site interv
        data.strats = new Array<Strategie>();
        for (const strat of data.chantier.strategies) {
            const ttt = await this.getForStrat(strat.id);
            data.strats.push(ttt);
        }

        for (const strat of data.strats) {
            for (const zone of strat.zonesIntervention) {
                zone.isZH = zone.type === EnumTypeZoneIntervention.ZH;

                // Plans des prélèvements
                const plansZone =
                    await this.fichierService.getAllByType('zone-intervention', zone.id, EnumTypeFichier.CHANTIER_PLAN_PRELEVEMENTS);

                // On affiche la répartition pour les objectifs qui ne sont pas HIJKLMNOPQRS, sauf que IJK sont traités séparément
                zone.displayRepartition = true;
                for (const ech of zone.echantillonnages) {
                    if (ech.isRealise &&
                        (ech.objectif.code === 'H' || ech.objectif.code === 'L' || ech.objectif.code === 'M' || ech.objectif.code === 'N'
                            || ech.objectif.code === 'O' || ech.objectif.code === 'P' || ech.objectif.code === 'Q' || ech.objectif.code === 'R'
                            || ech.objectif.code === 'S')
                    ) {
                        zone.displayRepartition = false;
                    }
                }

                zone.plansPrelevement = new Array();
                for (const plan of plansZone) {
                    zone.plansPrelevement.push({
                        image: './uploads/' + plan.keyDL,
                        displayRepartition: zone.displayRepartition,
                        txtRepartition: zone.repartitionPrelevements,
                    });
                }

                // MPCA
                for (const materz of zone.materiauxZone) {
                    if ((materz as MateriauZone).idMateriau) {
                        materz.materiau.nom = materz.materiau.liste === EnumListeMateriauxAmiante.A
                            ? materz.materiau.composantConstruction
                            : materz.materiau.partieComposant;
                    } else {
                        materz.materiau = new MateriauConstructionAmiante();
                        materz.materiau.nom = (materz as MateriauZone).materiauAutre;
                    }

                    switch (materz.etatDegradation) {
                        case EnumEtatDegradation.DEGRADE:
                            materz.etatDegradationString = 'Dégradé';
                            break;
                        case EnumEtatDegradation.NON_DEGRADE:
                            materz.etatDegradationString = 'Non dégradé';
                            break;
                        case EnumEtatDegradation.NC:
                            materz.etatDegradationString = 'Non communiqué';
                            break;
                        default:
                            materz.etatDegradationString = 'Non communiqué';
                            break;
                    }

                    switch (materz.etendueDegradation) {
                        case EnumEtendueDegradation.Generalisee:
                            materz.etendueDegradationString = 'Généralisée';
                            break;
                        case EnumEtendueDegradation.Ponctuelle:
                            materz.etendueDegradationString = 'Ponctuelle';
                            break;
                        case EnumEtendueDegradation.NC:
                            materz.etendueDegradationString = 'Non communiqué';
                            break;
                        default:
                            materz.etendueDegradationString = 'Non communiqué';
                            break;
                    }

                    switch (materz.moyenProtection) {
                        case EnumProtection.Aucune:
                            materz.moyenProtectionString = 'Aucun';
                            break;
                        case EnumProtection.Encoffrement:
                            materz.moyenProtectionString = 'Encoffrement';
                            break;
                        case EnumProtection.Impregnation:
                            materz.moyenProtectionString = 'Imprégnation';
                            break;
                        case EnumProtection.NC:
                            materz.moyenProtectionString = 'Non communiqué';
                            break;
                        default:
                            materz.moyenProtectionString = 'Non communiqué';
                            break;
                    }

                    switch (materz.etancheiteProtection) {
                        case EnumEtancheite.Bonne:
                            materz.etancheiteProtectionString = 'Bonne';
                            break;
                        case EnumEtancheite.Degradee:
                            materz.etancheiteProtectionString = 'Dégradée';
                            break;
                        case EnumEtancheite.NON_APPLICABLE:
                            materz.etancheiteProtectionString = 'Non Applicable';
                            break;
                        case EnumEtancheite.NC:
                            materz.etancheiteProtectionString = 'Non communiqué';
                            break;
                        default:
                            materz.etancheiteProtectionString = 'Non communiqué';
                            break;
                    }

                    switch (materz.resultatConnu) {
                        case EnumResultatExamenAmiante.AC1:
                            materz.resultatConnuString = 'AC1';
                            break;
                        case EnumResultatExamenAmiante.AC2:
                            materz.resultatConnuString = 'AC2';
                            break;
                        case EnumResultatExamenAmiante.EP:
                            materz.resultatConnuString = 'EP';
                            break;
                        case EnumResultatExamenAmiante.SCORE_1:
                            materz.resultatConnuString = 'Score 1';
                            break;
                        case EnumResultatExamenAmiante.SCORE_2:
                            materz.resultatConnuString = 'Score 2';
                            break;
                        case EnumResultatExamenAmiante.SCORE_3:
                            materz.resultatConnuString = 'Score 3';
                            break;
                        default:
                            materz.resultatConnuString = 'Non communiqué';
                            break;
                    }

                    if (!materz.commentaireDifferenceMesure || materz.commentaireDifferenceMesure === null) {
                        materz.commentaireDifferenceMesure = '';
                    }

                    if (!materz.localisation || materz.localisation === null) {
                        materz.localisation = '';
                    }
                }

                // Air/Chocs
                switch (zone.expositionAir) {
                    case EnumExpositionAir.Faible:
                        zone.expositionAirString = 'Faible';
                        break;
                    case EnumExpositionAir.Forte:
                        zone.expositionAirString = 'Forte';
                        break;
                    case EnumExpositionAir.NC:
                        zone.expositionAirString = 'Non communiqué';
                        break;
                    default:
                        zone.expositionAirString = 'Non communiqué';
                        break;
                }

                switch (zone.expositionChocs) {
                    case EnumExpositionChocs.Faible:
                        zone.expositionChocsString = 'Faible';
                        break;
                    case EnumExpositionChocs.Forte:
                        zone.expositionChocsString = 'Forte';
                        break;
                    case EnumExpositionChocs.NC:
                        zone.expositionChocsString = 'Non communiqué';
                        break;
                    default:
                        zone.expositionChocsString = 'Non communiqué';
                        break;
                }

                // Activité/Fréquentation
                switch (zone.typeActivite) {
                    case EnumTypeActivite.Enseignement:
                        zone.typeActiviteString = 'Enseignement';
                        break;
                    case EnumTypeActivite.Bureaux:
                        zone.typeActiviteString = 'Bureaux';
                        break;
                    case EnumTypeActivite.Commerce:
                        zone.typeActiviteString = 'Commercial';
                        break;
                    case EnumTypeActivite.Habitation:
                        zone.typeActiviteString = 'Habitation';
                        break;
                    case EnumTypeActivite.Industriel:
                        zone.typeActiviteString = 'Industriel';
                        break;
                    case EnumTypeActivite.Soins:
                        zone.typeActiviteString = 'Soins';
                        break;
                    case EnumTypeActivite.Loisirs:
                        zone.typeActiviteString = 'Loisirs';
                        break;
                    case EnumTypeActivite.Autre:
                        zone.typeActiviteString = zone.autreActivite;
                        break;
                    case EnumTypeActivite.NC:
                        zone.typeActiviteString = 'Non communiqué';
                        break;
                    default:
                        zone.typeActiviteString = 'Non communiqué';
                        break;
                }

                switch (zone.densiteOccupationTheorique) {
                    case EnumDensiteOccupationTheorique.Faible:
                        zone.densiteOccupationTheoriqueString = 'Faible';
                        break;
                    case EnumDensiteOccupationTheorique.Forte:
                        zone.densiteOccupationTheoriqueString = 'Forte';
                        break;
                    case EnumDensiteOccupationTheorique.NC:
                        zone.densiteOccupationTheoriqueString = 'Non communiqué';
                        break;
                    default:
                        zone.densiteOccupationTheoriqueString = 'Non communiqué';
                        break;
                }

                const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'DIMANCHE'];
                switch (zone.statut) {
                    case EnumStatutOccupationZone.LOCAL_DE_VIE_OCCUPE:
                        zone.statutString = 'Local de vie (LV) - Occupé';
                        if ((zone as ZoneIntervention).horaires && (zone as ZoneIntervention).horaires.length > 0) {
                            zone.commentaireOccupation += '\nHoraires occupation : ' + '\n';
                            for (let cpt1 = 0; cpt1 < 6; cpt1++) {
                                if ((zone as ZoneIntervention).horaires[cpt1].isOccupe) {
                                    zone.commentaireOccupation += joursSemaine[cpt1] + ' : '
                                        + (zone as ZoneIntervention).horaires[cpt1].heureDebut.toString().substr(0, 5)
                                        + '-' + (zone as ZoneIntervention).horaires[cpt1].heureFin.toString().substr(0, 5) + '\n';
                                }
                            }
                        }
                        break;
                    case EnumStatutOccupationZone.LOCAL_DE_VIE_VIDE:
                        zone.statutString = 'Local de vie (LV) - Evacué';
                        break;
                    case EnumStatutOccupationZone.LOCAL_OCCASIONNELLEMENT_VISITE_OCCUPE:
                        zone.statutString = 'Local occasionnellement visité (LOV) - Occupé';

                        if ((zone as ZoneIntervention).horaires && (zone as ZoneIntervention).horaires.length > 0) {
                            zone.commentaireOccupation += '\nHoraires occupation : ' + '\n';
                            for (let cpt1 = 0; cpt1 < 6; cpt1++) {
                                if ((zone as ZoneIntervention).horaires[cpt1].isOccupe) {
                                    zone.commentaireOccupation += joursSemaine[cpt1] + ' : '
                                        + (zone as ZoneIntervention).horaires[cpt1].heureDebut.toString().substr(0, 5)
                                        + '-' + (zone as ZoneIntervention).horaires[cpt1].heureFin.toString().substr(0, 5) + '\n';
                                }
                            }
                        }
                        break;
                    case EnumStatutOccupationZone.LOCAL_OCCASIONNELLEMENT_VISITE_VIDE:
                        zone.statutString = 'Local occasionnellement visité (LOV) - Evacué';
                        break;
                    default:
                        zone.statutString = 'Non communiqué';
                        break;
                }

                zone.sequencage = zone.statut === EnumStatutOccupationZone.LOCAL_DE_VIE_OCCUPE
                    || zone.statut === EnumStatutOccupationZone.LOCAL_OCCASIONNELLEMENT_VISITE_OCCUPE;

                if (zone.isZH) {
                    // Locaux Unitaires
                    zone.locauxInf00Inf15 = [...zone.locaux].filter(l => l.type === EnumTypeLocal.S_INF_EGAL_100M2_L_INF_EGAL_15M);
                    zone.hasInf00Inf15 = zone.locauxInf00Inf15 && zone.locauxInf00Inf15.length > 0;

                    zone.locauxSup100 = [...zone.locaux].filter(l => l.type === EnumTypeLocal.S_SUP_100M2);
                    zone.hasSup100 = zone.locauxSup100 && zone.locauxSup100.length > 0;

                    zone.locauxInf00Sup15 = [...zone.locaux].filter(l => l.type === EnumTypeLocal.S_INF_EGAL_100M2_L_SUP_15M);
                    zone.hasInf00Sup15 = zone.locauxInf00Sup15 && zone.locauxInf00Sup15.length > 0;

                    zone.locauxCageEscalier = [...zone.locaux].filter(l => l.type === EnumTypeLocal.CAGE_ESCALIER);
                    zone.hasCageEscalier = zone.locauxCageEscalier && zone.locauxCageEscalier.length > 0;

                    // Les groupements doivent être séparés parents/enfants
                    zone.locauxGroupement = [...zone.locaux].filter(l => l.type === EnumTypeLocal.GROUPEMENT
                        && (!l.idParent || l.idParent === null || l.idParent === 0));
                    zone.hasGroupement = zone.locauxGroupement && zone.locauxGroupement.length > 0;

                    for (const lparent of zone.locauxGroupement) {
                        const enfants = [...zone.locaux].filter(l => l.idParent && l.idParent === lparent.id);
                        lparent.enfants = [];
                        for (const enfant of enfants) {
                            lparent.enfants.push(enfant);
                        }
                    }
                } else {
                    // Environnement
                    let environnements = '';
                    let j = 0;
                    for (const env of zone.environnements) {
                        j++;
                        environnements += env.nom;

                        if (j < zone.environnements.length) {
                            environnements += '\n';
                        }
                    }
                    zone.environnementsString = environnements;
                }

                // C'est super sale, mais c'est pour le Word, il lui faut comme ça
                for (const ech of zone.echantillonnages) {
                    ech.zoneIntervention = zone;
                }
            }
        }

        return { data, chantier, nomFichier };
    }

    private ucFirst(str) {
        if (str.length > 0) {
            return str[0].toUpperCase() + str.substring(1).toLowerCase();
        } else {
            return str;
        }
    }
}
