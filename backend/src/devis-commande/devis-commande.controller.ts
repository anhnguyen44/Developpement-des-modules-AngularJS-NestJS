import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get, InternalServerErrorException,
    Param,
    Patch,
    Post,
    Put,
    Req, Res,
    UnauthorizedException,
    UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { Rights } from '../common/decorators/rights.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { GenerationService } from '../generation/generation.service';
import { HistoriqueService } from '../historique/historique.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { UtilisateurService } from '../utilisateur/utilisateur.service';
import { DevisCommande } from './devis-commande.entity';
import { DevisCommandeService } from './devis-commande.service';
import {
    EnumTypeContactDevisCommande, EnumTypeDevis, profils, EnumTypeBesoinLabo, IIntervention,
    EnumTypeZoneIntervention, EnumAppareilsProtectionRespiratoire, EnumTypePrelevement, EnumTypeTemplate,
    EnumTypeFichier, Objectif, SitePrelevement, EnumTypeBatimentsForWord, EnumTypeDeChantier, EnumConfinement,
    EnumEmpoussierementGeneral, EnumEnvironnement
} from '@aleaac/shared';
import { ContactDevisCommande } from '../contact-devis-commande/contact-devis-commande.entity';
import { ParametrageFranchise } from '../parametrage-franchise/parametrage-franchise.entity';
import { ChantierService } from '../chantier/chantier.service';
import { BesoinClientLaboService } from '../besoin-client-labo/besoin-client-labo.service';
import { StrategieService } from '../strategie/strategie.service';
import { InterventionService } from '../intervention/intervention.service';
import { QueryBuilder } from 'typeorm';
import { DevisCommandeDetail } from '../devis-commande-detail/devis-commande-detail.entity';
import { ProduitService } from '../produit/produit.service';
import { Strategie } from '../strategie/strategie.entity';
import { BesoinClientLabo } from '../besoin-client-labo/besoin-client-labo.entity';
import { Intervention } from '../intervention/intervention.entity';
import { Produit } from '../produit/produit.entity';
import { GrilleTarifService } from '../grille-tarif/grille-tarif.service';
import { GrilleTarif } from '../grille-tarif/grille-tarif.entity';
import { Compte } from '../compte/compte.entity';
import { Contact } from '../contact/contact.entity';
import { Chantier } from '../chantier/chantier.entity';
import { TarifDetailService } from '../tarif-detail/tarif-detail.service';
import { ZoneInterventionService } from '../zone-intervention/zone-intervention.service';
import { Processus } from '../processus/processus.entity';
import { TarifDetail } from '../tarif-detail/tarif-detail.entity';
import { ZoneIntervention } from '../zone-intervention/zone-intervention.entity';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { PrelevementService } from '../prelevement/prelevement.service';
import { FranchiseService } from '../franchise/franchise.service';
import { MpcaService } from '../mpca/mpca.service';
import { Mpca } from '../mpca/mpca.entity';
import { OutilTechniqueService } from '../outil-technique/outil-technique.service';
import { CaptageAspirationSourceService } from '../captage-aspiration-source/captage-aspiration-source.service';
import { TravailHumideService } from '../travail-humide/travail-humide.service';
import { FichierService } from '../fichier/fichier.service';
import { Fichier } from '../fichier/fichier.entity';
import { InfosBesoinClientLaboService } from '../infos-besoin-client-labo/infos-besoin-client-labo.service';
import { TemplateVersionService } from '../template-version/template-version.service';

@ApiUseTags('devis-commande')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'devis-commande'))

export class DevisCommandeController {
    enumTypeDevis = EnumTypeDevis;
    enumTypeContactDevisCommande = EnumTypeContactDevisCommande;

    constructor(
        private devisCommandeService: DevisCommandeService,
        private generationService: GenerationService,
        private serviceUser: UtilisateurService,
        private historiqueService: HistoriqueService,
        private chantierService: ChantierService,
        private besoinService: BesoinClientLaboService,
        private strategieService: StrategieService,
        private interventionService: InterventionService,
        private produitServcie: ProduitService,
        private grilleTarifService: GrilleTarifService,
        private tarifDetailService: TarifDetailService,
        private zoneInterventionService: ZoneInterventionService,
        private prelevementService: PrelevementService,
        private franchiseService: FranchiseService,
        private mpcaService: MpcaService,
        private outilTechniqueService: OutilTechniqueService,
        private travailHumideService: TravailHumideService,
        private captageAspirationService: CaptageAspirationSourceService,
        private fichierService: FichierService,
        private infosBesoinService: InfosBesoinClientLaboService,
        private templateVersionService: TemplateVersionService,
    ) { }

    @ApiOperation({ title: 'Récupération de toute les devisCommande d\'une franchise' })
    @Get('all/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], params.idFranchise)) {
            return await this.devisCommandeService.getAll(params.idFranchise, req.query);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération de toute les devisCommande d\'une franchise par id formation' })
    @Get('allByIdFormation/:idFormation/:idFranchise')
    @Authorized()
    async getAllByIdFormation(@Param() params, @Req() req) {
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], params.idFranchise)) {
            return await this.devisCommandeService.getAllByIdFormation(params.idFormation,params.idFranchise, req.query);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération nombre devis commande par franchise' })
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], params.idFranchise)) {
            return await this.devisCommandeService.countAll(params.idFranchise, req.query);
        } else {
            throw new UnauthorizedException();
        }
    }

    private ucFirst(str) {
        if (str.length > 0) {
            return str[0].toUpperCase() + str.substring(1).toLowerCase();
        } else {
            return str;
        }
    }

    @ApiOperation({ title: 'generation devis' })
    @Get('generate/:idDevisCommande')
    @Authorized()
    async generate(@Param() params, @Req() req) {
        const devisCommande = await this.devisCommandeService.get(params.idDevisCommande);
        const franchise = await this.franchiseService.findOneById(devisCommande.idFranchise);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], devisCommande.idFranchise)) {
            const nomFichier = 'devis-' + franchise.trigramme + '-' + devisCommande.id + '-V' + devisCommande.version;
            const data: any = { devisCommande: devisCommande };

            const client = devisCommande.contactDevisCommandes.find((client2) => {
                return client2.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
            });

            if (devisCommande.totalRemiseHT > 0) {
                data.isRemise = true;
            }

            data.client = client;
            let contactClient = '';
            if (client.contact.adresse.email || client.contact.adresse.telephone) {
                contactClient += '(';
                if (client.contact.adresse.email) {
                    contactClient += 'Email : ' + client.contact.adresse.email;
                }

                if (client.contact.adresse.email && client.contact.adresse.telephone) {
                    contactClient += ' ou ';
                }

                if (client.contact.adresse.telephone) {
                    contactClient += 'Téléphone : ' + client.contact.adresse.telephone;
                }
                contactClient += ')';
            }
            data.contactClient = contactClient;


            const today = new Date();
            data.dateGeneration = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
            this.historiqueService.add(req.user.id, 'devis-commande', params.idDevisCommande, 'Génération fichier : ' + nomFichier);

            // Infos spécifiques au devis LABO
            if (devisCommande.typeDevis === EnumTypeDevis.LABO) {
                // Data supplémentaire
                // chantier, template
                data.chantier = await this.chantierService.get(devisCommande.idChantier);
                data.chantier.franchise = await this.franchiseService.findOneById(data.chantier.idFrancise);
                data.bureauHasCofrac = data.chantier.bureau.numeroAccreditation && data.chantier.bureau.numeroAccreditation.length > 0;
                data.chantier.besoinClient.informations = await this.infosBesoinService.find({
                    where: {
                        idBesoinClientLabo: data.chantier.besoinClient.id
                    }
                });

                data.hasSignatureRedacteur = data.chantier.redacteurStrategie.idSignature
                    && data.chantier.redacteurStrategie.idSignature > 0
                    && data.chantier.redacteurStrategie.signature;
                data.chantier.signatureRedacteur = data.hasSignatureRedacteur
                    ? './uploads/' + data.chantier.redacteurStrategie.signature.keyDL
                    : null;

                // TARIF
                data.tarif = (client as ContactDevisCommande).contact.compteContacts.compte.grilleTarifs
                    .find(gt => gt.idTypeGrille === EnumTypeDevis.LABO);
                if (!data.tarif) {
                    data.tarif = (await this.grilleTarifService.getPublic(data.chantier.idFranchise))
                        .find(gt => gt.idTypeGrille === EnumTypeDevis.LABO);
                }

                if (data.tarif && data.tarif.conditions && data.tarif.conditions.length > 0) {
                    data.conditionsTarifaires = (data.tarif as GrilleTarif).conditions;
                } else {
                    data.conditionsTarifaires = 'Nos coûts unitaires de prélèvements s’entendent pour la pose et la dépose d’une mesure sur le même site de prestation.\n\
                    Une modification de la stratégie d’échantillonnage définie peut entrainer une modification du nombre de prélèvements et donc du prix global de la prestation.\n\
                    La prestation démarre à réception du présent contrat daté, paraphé et signé par le représentant légal de la société.\n\
                    Il conviendra d’adresser au Laboratoire un ordre d’intervention par une personne de votre société avant chaque intervention sur vos chantiers.\n\
                    Les conditions de règlement sont fixées à 30 jours fin de mois par virement bancaire ou postal à compter de la date de facturation.\n';
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

                data.hasBureauComplementAdresse = !!data.devisCommande.bureau.adresse.complement;

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
                        data.chantier.adresseComplete += '\n' + '\n'
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
                    const indexCurrent =
                        data.objectifs.findIndex(o => o.id === prel.idObjectif && o.idZoneIntervention === prel.idZIPrel);
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
                                ...prel.objectif, idZoneIntervention: prel.idZIPrel,
                                zoneIntervention: prel.zoneIntervention.reference, count: 1, materiaux: mater
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

                data.objectifsMetAir = [...data.objectifs].filter(o => !o.isMesureOperateur);
                data.hasMetAir = data.objectifsMetAir.length > 0;
                data.objectifsMetaOp = [...data.objectifs].filter(o => o.isMesureOperateur);
                data.hasMetaOp = data.objectifsMetaOp.length > 0;

                data.hasJ = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'J') > -1;
                data.hasIK = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'I' || o.code === 'K') > -1;

                data.hasG = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'G') > -1;
                data.hasHLMNOPQRS = (data.objectifs as Array<Objectif>).findIndex(
                    o => o.code === 'H' || o.code === 'L' || o.code === 'M' || o.code === 'N'
                        || o.code === 'O' || o.code === 'P' || o.code === 'Q' || o.code === 'R'
                        || o.code === 'S'
                ) > -1;
                data.hasTUVWX = (data.objectifs as Array<Objectif>).findIndex(
                    o => o.code === 'T' || o.code === 'U' || o.code === 'V' || o.code === 'W'
                        || o.code === 'X'
                ) > -1;

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
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[1]) {
                    data.txtFichiersFournis += 'Liste des processus' + '\n';
                    if (data.documentsPresents[2] || data.documentsPresents[3]
                        || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[2]) {
                    data.txtFichiersFournis += 'Mode opératoire' + '\n';
                    if (data.documentsPresents[3]
                        || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[3]) {
                    data.txtFichiersFournis += 'Plan d\'installation chantier' + '\n';
                    if (data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[4]) {
                    data.txtFichiersFournis += 'Planning des informations' + '\n';
                    if (data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[5]) {
                    data.txtFichiersFournis += 'Repérage amiante avant travaux' + '\n';
                    if (data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
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

                data.template = await this.templateVersionService.getVersion(EnumTypeTemplate.LABO_PROP_COMMERCIALE);
                data.template.dateDebut = (new Date(data.template.dateDebut))
                    .toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                data.fichierTemplate = await this.fichierService.getById(data.template.idFichier);
                data.template.nom = data.fichierTemplate.nom;
                data.template.typeTemplate = data.fichierTemplate.nom;

                // console.log(data);
                return await this.generationService.generateDocx(data, EnumTypeTemplate.LABO_PROP_COMMERCIALE, 'devis-commande',
                    devisCommande.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CMD_DEVIS, true);
            } else {
                return await this.generationService.generateDocx(data, 'devis.docx', 'devis-commande',
                    devisCommande.id, req.user.id, nomFichier, req.user);
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'generation devis' })
    @Get('generate-test/:idDevisCommande')
    @Authorized([profils.ANIMATEUR_QUALITE, profils.SUPER_ADMIN])
    async generateTest(@Param() params, @Req() req) {
        const devisCommande = await this.devisCommandeService.get(params.idDevisCommande);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], devisCommande.idFranchise)) {
            const nomFichier = 'devis-' + devisCommande.id + '-V' + devisCommande.version;
            const data: any = { devisCommande: devisCommande };

            const client = devisCommande.contactDevisCommandes.find((client2) => {
                return client2.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
            });

            if (devisCommande.totalRemiseHT > 0) {
                data.isRemise = true;
            }

            data.client = client;
            let contactClient = '';
            if (client.contact.adresse.email || client.contact.adresse.telephone) {
                contactClient += '(';
                if (client.contact.adresse.email) {
                    contactClient += 'Email : ' + client.contact.adresse.email;
                }

                if (client.contact.adresse.email && client.contact.adresse.telephone) {
                    contactClient += ' ou ';
                }

                if (client.contact.adresse.telephone) {
                    contactClient += 'Téléphone : ' + client.contact.adresse.telephone;
                }
                contactClient += ')';
            }
            data.contactClient = contactClient;


            const today = new Date();
            data.dateGeneration = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
            this.historiqueService.add(req.user.id, 'devis-commande', params.idDevisCommande, 'Génération fichier : ' + nomFichier);

            // Infos spécifiques au devis LABO
            if (devisCommande.typeDevis === EnumTypeDevis.LABO) {
                // Data supplémentaire
                // chantier, template
                data.chantier = await this.chantierService.get(devisCommande.idChantier);
                data.chantier.franchise = await this.franchiseService.findOneById(data.chantier.idFrancise);
                data.chantier.besoinClient.informations = await this.infosBesoinService.find({
                    where: {
                        idBesoinClientLabo: data.chantier.besoinClient.id
                    }
                });

                data.hasSignatureRedacteur = data.chantier.redacteurStrategie.idSignature
                    && data.chantier.redacteurStrategie.idSignature > 0
                    && data.chantier.redacteurStrategie.signature;
                data.chantier.signatureRedacteur = data.hasSignatureRedacteur
                    ? './uploads/' + data.chantier.redacteurStrategie.signature.keyDL
                    : null;


                // TARIF
                data.tarif = (client as ContactDevisCommande).contact.compteContacts.compte.grilleTarifs
                    .find(gt => gt.idTypeGrille === EnumTypeDevis.LABO);
                if (!data.tarif) {
                    data.tarif = (await this.grilleTarifService.getPublic(data.chantier.idFranchise))
                        .find(gt => gt.idTypeGrille === EnumTypeDevis.LABO);
                }

                if (data.tarif && data.tarif.conditions && data.tarif.conditions.length > 0) {
                    data.conditionsTarifaires = (data.tarif as GrilleTarif).conditions;
                } else {
                    data.conditionsTarifaires = 'Nos coûts unitaires de prélèvements s’entendent pour la pose et la dépose d’une mesure sur le même site de prestation.\n\
                    Une modification de la stratégie d’échantillonnage définie peut entrainer une modification du nombre de prélèvements et donc du prix global de la prestation.\n\
                    La prestation démarre à réception du présent contrat daté, paraphé et signé par le représentant légal de la société.\n\
                    Il conviendra d’adresser au Laboratoire un ordre d’intervention par une personne de votre société avant chaque intervention sur vos chantiers.\n\
                    Les conditions de règlement sont fixées à 30 jours fin de mois par virement bancaire ou postal à compter de la date de facturation.\n';
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
                    pz.confinement =
                        this.ucFirst(EnumConfinement[data.zonesIntervention.find(z => z.id === pz.idZoneIntervention).confinement]);
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

                data.hasBureauComplementAdresse = !!data.devisCommande.bureau.adresse.complement;

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
                        data.chantier.adresseComplete += '\n' + '\n'
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
                    const indexCurrent =
                        data.objectifs.findIndex(o => o.id === prel.idObjectif && o.idZoneIntervention === prel.idZIPrel);
                    if (indexCurrent === -1) {
                        prel.zoneIntervention = data.zonesIntervention.find(z => z.id === prel.idZIPrel);

                        const mater = prel.objectif.description.split(' - ')[0];
                        data.objectifs.push({
                            ...prel.objectif, idZoneIntervention: prel.idZIPrel,
                            zoneIntervention: prel.zoneIntervention.reference, count: 1, materiaux: mater
                        });
                    } else {
                        data.objectifs[indexCurrent].count++;
                    }

                    if (prel.objectif.isMesureOperateur) {
                        data.totalMetaOp++;
                    } else {
                        data.totalMetAir++;
                    }
                }

                data.objectifsMetAir = [...data.objectifs].filter(o => !o.isMesureOperateur);
                data.hasMetAir = data.objectifsMetAir.length > 0;
                data.objectifsMetaOp = [...data.objectifs].filter(o => o.isMesureOperateur);
                data.hasMetaOp = data.objectifsMetaOp.length > 0;

                data.hasJ = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'J') > -1;
                data.hasIK = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'I' || o.code === 'K') > -1;

                data.hasG = (data.objectifs as Array<Objectif>).findIndex(o => o.code === 'G') > -1;
                data.hasHLMNOPQRS = (data.objectifs as Array<Objectif>).findIndex(
                    o => o.code === 'H' || o.code === 'L' || o.code === 'M' || o.code === 'N'
                        || o.code === 'O' || o.code === 'P' || o.code === 'Q' || o.code === 'R'
                        || o.code === 'S'
                ) > -1;
                data.hasTUVWX = (data.objectifs as Array<Objectif>).findIndex(
                    o => o.code === 'T' || o.code === 'U' || o.code === 'V' || o.code === 'W'
                        || o.code === 'X'
                ) > -1;

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
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[1]) {
                    data.txtFichiersFournis += 'Liste des processus' + '\n';
                    if (data.documentsPresents[2] || data.documentsPresents[3]
                        || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[2]) {
                    data.txtFichiersFournis += 'Mode opératoire' + '\n';
                    if (data.documentsPresents[3]
                        || data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[3]) {
                    data.txtFichiersFournis += 'Plan d\'installation chantier' + '\n';
                    if (data.documentsPresents[4] || data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[4]) {
                    data.txtFichiersFournis += 'Planning des informations' + '\n';
                    if (data.documentsPresents[5] || data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
                        data.txtFichiersFournis += ', ';
                    }
                }
                if (data.documentsPresents[5]) {
                    data.txtFichiersFournis += 'Repérage amiante avant travaux' + '\n';
                    if (data.documentsPresents[6]
                        || data.documentsPresents[7] || data.documentsPresents[8] || data.documentsPresents[9]
                    ) {
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

                data.template = await this.templateVersionService.getVersion(EnumTypeTemplate.LABO_PROP_COMMERCIALE);
                data.template.dateDebut = (new Date(data.template.dateDebut))
                    .toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                data.fichierTemplate = await this.fichierService.getById(data.template.idFichier);
                data.template.nom = data.fichierTemplate.nom;
                data.template.typeTemplate = data.fichierTemplate.nom;

                // console.log(data);
                return await this.generationService.generateDocx(data, EnumTypeTemplate.TEST_LABO_PROP_COMMERCIALE, 'devis-commande',
                    devisCommande.id, req.user.id, nomFichier, req.user, true, EnumTypeFichier.CMD_DEVIS, true);
            } else {
                return await this.generationService.generateDocx(data, 'devis.docx', 'devis-commande',
                    devisCommande.id, req.user.id, nomFichier, req.user);
            }
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Fige un devisCommande' })
    @Get('figer/:idDevisCommande')
    @Authorized()
    async figer(@Param() params, @Req() req) {
        const devisCommande = await this.devisCommandeService.get(params.idDevisCommande);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], devisCommande.idFranchise)) {
            devisCommande.versionFigee = !devisCommande.versionFigee;
            if (devisCommande.versionFigee) {
                this.historiqueService.add(req.user.id, 'devis-commande', devisCommande.id, 'Devis figée')
            } else {
                this.historiqueService.add(req.user.id, 'devis-commande', devisCommande.id, 'Devis en saisie')
            }
            return this.devisCommandeService.update(devisCommande, req);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Récupération des type devis commande' })
    @Get('/typeContact')
    @Authorized()
    async getAllType() {
        return await this.devisCommandeService.getAllType()
    }


    @ApiOperation({ title: 'Récupération d\'un devis commande en fonction de son id' })
    @Get(':idDevisCommande')
    @Authorized()
    async get(@Param() params, @Req() req) {
        const devisCommande = await this.devisCommandeService.get(params.idDevisCommande);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_SEE_FRANCHISE'], devisCommande.idFranchise)) {
            return devisCommande;
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Initialiser les lignes depuis le chantier' })
    @Post('init-from-chantier/:idChantier')
    @Authorized()
    async initFromChantier(@Body() devisCommande: DevisCommande, @Param() params, @Req() req): Promise<DevisCommande> {
        const chantier: Chantier = await this.chantierService.get(params.idChantier);
        const strategies: Strategie[] = await this.strategieService.getAll(chantier.id, null);
        const besoin: BesoinClientLabo = await this.besoinService.findOneById(chantier.idBesoinClient);
        const interventions: IIntervention[] = chantier.interventions;
        const clientCompte: Compte | null = chantier.client.compteContacts ? chantier.client.compteContacts.compte : null;
        const clientContact: Contact | null = chantier.client;

        const tarif: GrilleTarif =
            (await this.grilleTarifService.getPublicWithDetail(chantier.idFranchise)).find(gt => gt.idTypeGrille === EnumTypeDevis.LABO);
        let tarifClient: GrilleTarif;
        if (clientCompte) {
            // console.log(clientCompte);
            tarifClient = clientCompte.grilleTarifs.find(gt => gt.idTypeGrille === EnumTypeDevis.LABO);
        }

        if (!tarif) {
            throw new InternalServerErrorException('PAS DE GRILLE LABO :(');
        }

        // Rédaction de la stratégie
        if (besoin.idTypeBesoinLabo === EnumTypeBesoinLabo.CODE_TRAVAIL) {
            const produit: Produit = await this.produitServcie.findOneByCode('STRAT');
            if (besoin.ss3) {
                const redacStrat = new DevisCommandeDetail();
                redacStrat.idDevisCommande = devisCommande.id;
                redacStrat.idProduit = produit.id;
                redacStrat.description = produit.description + '(SS3)';
                redacStrat.quantite = 1;

                const detailTarifPublicSS3: TarifDetail = tarif.details.find(td => td.idProduit === produit.id);
                let detailTarifPersoSS4: TarifDetail;
                if (tarifClient) {
                    // console.log(tarifClient);
                    detailTarifPersoSS4 = tarifClient.details.find(td => td.idProduit === produit.id);
                } else {
                    detailTarifPersoSS4 = detailTarifPublicSS3;
                }

                redacStrat.montantHT = detailTarifPublicSS3.prixUnitaire;
                redacStrat.montantRemise = detailTarifPersoSS4.prixUnitaire;
                redacStrat.totalHT = redacStrat.quantite * redacStrat.montantRemise;
                if (!devisCommande.devisCommandeDetails) {
                    devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
                }

                devisCommande.devisCommandeDetails.push(redacStrat);
            }
            if (besoin.ss4) {
                const redacStrat2 = new DevisCommandeDetail();
                redacStrat2.idDevisCommande = devisCommande.id;
                redacStrat2.idProduit = produit.id;
                redacStrat2.description = produit.description + '(SS4)';
                redacStrat2.quantite = 1;

                const detailTarifPublicSS4: TarifDetail = tarif.details.find(td => td.idProduit === produit.id);
                let detailTarifPersoSS4: TarifDetail;
                if (tarifClient) {
                    detailTarifPersoSS4 = tarifClient.details.find(td => td.idProduit === produit.id);
                } else {
                    detailTarifPersoSS4 = detailTarifPublicSS4;
                }

                redacStrat2.montantHT = detailTarifPublicSS4.prixUnitaire;
                redacStrat2.montantRemise = detailTarifPersoSS4.prixUnitaire;
                redacStrat2.totalHT = redacStrat2.quantite * redacStrat2.montantRemise;
                if (!devisCommande.devisCommandeDetails) {
                    devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
                }

                devisCommande.devisCommandeDetails.push(redacStrat2);
            }
        } else {
            const produit: Produit = await this.produitServcie.findOneByCode('STRAT');
            const redacStrat = new DevisCommandeDetail();
            redacStrat.idDevisCommande = devisCommande.id;
            redacStrat.idProduit = produit.id;
            redacStrat.description = produit.description + '(CSP)';
            redacStrat.quantite = 1;

            const detailTarifPublicCSP: TarifDetail = tarif.details.find(td => td.idProduit === produit.id);
            let detailTarifPersoCSP: TarifDetail;
            if (tarifClient) {
                detailTarifPersoCSP = tarifClient.details.find(td => td.idProduit === produit.id);
            } else {
                detailTarifPersoCSP = detailTarifPublicCSP;
            }

            redacStrat.montantHT = detailTarifPublicCSP.prixUnitaire;
            redacStrat.montantRemise = detailTarifPersoCSP.prixUnitaire;
            redacStrat.totalHT = redacStrat.quantite * redacStrat.montantRemise;
            if (!devisCommande.devisCommandeDetails) {
                devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
            }

            devisCommande.devisCommandeDetails.push(redacStrat);
        }

        // Mesures complémentaires
        const listeZones = new Array<ZoneIntervention>();
        for (const strat of strategies) {
            const tmp = await this.zoneInterventionService.findByStrategie(strat.id, '');
            for (const zone of tmp) {
                listeZones.push(zone);
            }
        }

        // Si on a au moins une ZT (avec un processus)
        if (listeZones.findIndex(z => z.type === EnumTypeZoneIntervention.ZT) > -1) {
            // On propose des MEST
            const produitMest: Produit = await this.produitServcie.findOneByCode('MEST');
            const mestPropose = new DevisCommandeDetail();
            mestPropose.idDevisCommande = devisCommande.id;
            mestPropose.idProduit = produitMest.id;
            mestPropose.description = produitMest.description;
            mestPropose.quantite = 1;

            const detailTarifPublicMest: TarifDetail = tarif.details.find(td => td.idProduit === produitMest.id);
            let detailTarifPersoMest: TarifDetail;
            if (tarifClient) {
                detailTarifPersoMest = tarifClient.details.find(td => td.idProduit === produitMest.id);
            } else {
                detailTarifPersoMest = detailTarifPublicMest;
            }

            mestPropose.montantHT = detailTarifPublicMest.prixUnitaire;
            mestPropose.montantRemise = detailTarifPersoMest.prixUnitaire;
            mestPropose.totalHT = mestPropose.quantite * mestPropose.montantRemise;
            if (!devisCommande.devisCommandeDetails) {
                devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
            }
            devisCommande.devisCommandeDetails.push(mestPropose);

            // On enlève les commentaires s'ils y sont déjà
            devisCommande.commentaireDevis =
                devisCommande.commentaireDevis.replace(/\[EXPLICATION MEST PROPOSEE, ATTENTE ALEA\]\.(\n)?/g, '');
            devisCommande.commentaireDevis =
                devisCommande.commentaireDevis.replace(/\[PROPOSITION PRELEVEMENTS MATERIAUX, ATTENTE ALEA\]\.(\n)?/g, '');
            // On les met/remet
            devisCommande.commentaireDevis += '[EXPLICATION MEST PROPOSEE, ATTENTE ALEA].' + '\n';
            devisCommande.commentaireDevis += '[PROPOSITION PRELEVEMENTS MATERIAUX, ATTENTE ALEA].' + '\n';
        }

        const listeProcessusZone = new Array<ProcessusZone>();
        for (const zone of listeZones) {
            for (const procZone of zone.processusZone) {
                listeProcessusZone.push(procZone);
            }
        }

        // Si on a un processu avec une protection AA, on propose une mesure de la qualité de l'air
        if (listeProcessusZone.findIndex(pz => pz.idAppareilsProtectionRespiratoire === EnumAppareilsProtectionRespiratoire.AA) > -1) {
            // Q_ADD_AIR
            const produitQAddAir: Produit = await this.produitServcie.findOneByCode('Q_ADD_AIR');
            const quadairPropose = new DevisCommandeDetail();
            quadairPropose.idDevisCommande = devisCommande.id;
            quadairPropose.idProduit = produitQAddAir.id;
            quadairPropose.description = produitQAddAir.description;
            quadairPropose.quantite = 1;

            const detailTarifPublicQAddAir: TarifDetail = tarif.details.find(td => td.idProduit === produitQAddAir.id);
            let detailTarifPersoQAddAir: TarifDetail;
            if (tarifClient) {
                detailTarifPersoQAddAir = tarifClient.details.find(td => td.idProduit === produitQAddAir.id);
            } else {
                detailTarifPersoQAddAir = detailTarifPublicQAddAir;
            }

            quadairPropose.montantHT = detailTarifPublicQAddAir.prixUnitaire;
            quadairPropose.montantRemise = detailTarifPersoQAddAir.prixUnitaire;
            quadairPropose.totalHT = quadairPropose.quantite * quadairPropose.montantRemise;
            if (!devisCommande.devisCommandeDetails) {
                devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
            }

            devisCommande.devisCommandeDetails.push(quadairPropose);
        }

        // Prélèvements / Délai express
        const listePrelevements = await this.prelevementService.getAllByType('chantier', chantier.id, null);
        const nbPrelevementsMetAir = [...listePrelevements].filter(p => p.idTypePrelevement === EnumTypePrelevement.ENVIRONNEMENTAL).length;
        const nbPrelevementsMetaOp = [...listePrelevements].filter(p => p.idTypePrelevement === EnumTypePrelevement.METAOP).length;
        const nbDelaiExpress = [...listePrelevements].filter(p => p.isDelaiExpress).length;

        if (nbPrelevementsMetAir > 0) {
            const produitPrlvmntAir: Produit = await this.produitServcie.findOneByCode('META');
            const prelvmtAir = new DevisCommandeDetail();
            prelvmtAir.idDevisCommande = devisCommande.id;
            prelvmtAir.idProduit = produitPrlvmntAir.id;
            prelvmtAir.description = produitPrlvmntAir.description;
            prelvmtAir.quantite = nbPrelevementsMetAir;

            const detailTarifPublicPrlvtAir: TarifDetail = tarif.details.find(td => td.idProduit === produitPrlvmntAir.id);
            let detailTarifPersoPrlvtAir: TarifDetail;
            if (tarifClient) {
                detailTarifPersoPrlvtAir = tarifClient.details.find(td => td.idProduit === produitPrlvmntAir.id);
            } else {
                detailTarifPersoPrlvtAir = detailTarifPublicPrlvtAir;
            }

            prelvmtAir.montantHT = detailTarifPublicPrlvtAir.prixUnitaire;
            prelvmtAir.montantRemise = detailTarifPersoPrlvtAir.prixUnitaire;
            prelvmtAir.totalHT = prelvmtAir.quantite * prelvmtAir.montantRemise;

            if (!devisCommande.devisCommandeDetails) {
                devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
            }

            devisCommande.devisCommandeDetails.push(prelvmtAir);
        }

        if (nbPrelevementsMetaOp > 0) {
            const produitPrlvmntOp: Produit = await this.produitServcie.findOneByCode('METAOP');
            const prelvmtOp = new DevisCommandeDetail();
            prelvmtOp.idDevisCommande = devisCommande.id;
            prelvmtOp.idProduit = produitPrlvmntOp.id;
            prelvmtOp.description = produitPrlvmntOp.description;
            prelvmtOp.quantite = nbPrelevementsMetaOp;

            const detailTarifPublicPrlvtOp: TarifDetail = tarif.details.find(td => td.idProduit === produitPrlvmntOp.id);
            let detailTarifPersoPrlvtOp: TarifDetail;
            if (tarifClient) {
                detailTarifPersoPrlvtOp = tarifClient.details.find(td => td.idProduit === produitPrlvmntOp.id);
            } else {
                detailTarifPersoPrlvtOp = detailTarifPublicPrlvtOp;
            }

            prelvmtOp.montantHT = detailTarifPublicPrlvtOp.prixUnitaire;
            prelvmtOp.montantRemise = detailTarifPersoPrlvtOp.prixUnitaire;
            prelvmtOp.totalHT = prelvmtOp.quantite * prelvmtOp.montantRemise;

            if (!devisCommande.devisCommandeDetails) {
                devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
            }

            devisCommande.devisCommandeDetails.push(prelvmtOp);
        }

        // Délai express
        if (nbDelaiExpress > 0) {
            const produitDelaiExpress: Produit = await this.produitServcie.findOneByCode('ECH_24H');
            const delaiExpress = new DevisCommandeDetail();
            delaiExpress.idDevisCommande = devisCommande.id;
            delaiExpress.idProduit = produitDelaiExpress.id;
            delaiExpress.description = produitDelaiExpress.description;
            delaiExpress.quantite = nbDelaiExpress;

            const detailTarifPublicDelaiExpress: TarifDetail = tarif.details.find(td => td.idProduit === produitDelaiExpress.id);
            let detailTarifPersoDelaiExpress: TarifDetail;
            if (tarifClient) {
                detailTarifPersoDelaiExpress = tarifClient.details.find(td => td.idProduit === produitDelaiExpress.id);
            } else {
                detailTarifPersoDelaiExpress = detailTarifPublicDelaiExpress;
            }

            delaiExpress.montantHT = detailTarifPublicDelaiExpress.prixUnitaire;
            delaiExpress.montantRemise = detailTarifPersoDelaiExpress.prixUnitaire;
            delaiExpress.totalHT = delaiExpress.quantite * delaiExpress.montantRemise;

            if (!devisCommande.devisCommandeDetails) {
                devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
            }

            devisCommande.devisCommandeDetails.push(delaiExpress);
        }

        // Rapport Final
        const produitRapport: Produit = await this.produitServcie.findOneByCode('RAPPORT_COFRAC');
        const rapportFinal = new DevisCommandeDetail();
        rapportFinal.idDevisCommande = devisCommande.id;
        rapportFinal.idProduit = produitRapport.id;
        rapportFinal.description = produitRapport.description;
        rapportFinal.quantite = besoin.ss3 && besoin.ss4 ? 2 : 1;

        const detailTarifPublic: TarifDetail = tarif.details.find(td => td.idProduit === produitRapport.id);
        let detailTarifPerso: TarifDetail;
        if (tarifClient) {
            detailTarifPerso = tarifClient.details.find(td => td.idProduit === produitRapport.id);
        } else {
            detailTarifPerso = detailTarifPublic;
        }

        rapportFinal.montantHT = detailTarifPublic.prixUnitaire;
        rapportFinal.montantRemise = detailTarifPerso.prixUnitaire;
        rapportFinal.totalHT = rapportFinal.quantite * rapportFinal.montantRemise;
        if (!devisCommande.devisCommandeDetails) {
            devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
        }
        devisCommande.devisCommandeDetails.push(rapportFinal);

        // Déplacements
        // TODO : ATTENTE ALEA MODE CALCUL
        // SI PAS INTERVENTIONS : 4 A/R SINON 2 A/R PAR INTERV QUI CONTIENT METAIR (durée > 6h), 1 A/R INTERV SINON
        const produitTrajet: Produit = await this.produitServcie.findOneByCode('RAPPORT_COFRAC');
        const trajets = new DevisCommandeDetail();
        trajets.idDevisCommande = devisCommande.id;
        trajets.description = 'Aller-retour vers le chantier';
        // trajets.idProduit = produitTrajet.id;
        // trajets.description = produitTrajet.description;
        trajets.quantite = 4;

        // const detailTarifPublicTrajet: TarifDetail = tarif.details.find(td => td.idProduit === produitTrajet.id);
        // let detailTarifPersoTrajet: TarifDetail;
        // if (tarifClient) {
        //     detailTarifPersoTrajet = tarifClient.details.find(td => td.idProduit === produitTrajet.id);
        // } else {
        //     detailTarifPersoTrajet = detailTarifPublicTrajet;
        // }

        // trajets.montantHT = detailTarifPublicTrajet.prixUnitaire;
        // trajets.montantRemise = detailTarifPersoTrajet.prixUnitaire;
        // trajets.totalHT = trajets.quantite * trajets.montantRemise;

        trajets.montantHT = 150;
        trajets.montantRemise = 150;
        trajets.totalHT = trajets.quantite * trajets.montantRemise;
        if (!devisCommande.devisCommandeDetails) {
            devisCommande.devisCommandeDetails = new Array<DevisCommandeDetail>();
        }
        devisCommande.devisCommandeDetails.push(trajets);

        const res = await this.devisCommandeService.update(devisCommande, req);
        // Pour éviter d'afficher en double dans l'interface, on garde que celles avec un id (et donc définitivement en base)
        res.devisCommandeDetails = res.devisCommandeDetails.filter(dcd => dcd.id);
        return res;
    }

    @ApiOperation({ title: 'Création devis Commande' })
    @Post()
    @Authorized()
    @Rights(['CMD_CREATE'])
    async create(@Body() requestBody: DevisCommande, @Req() req) {
        const result = await this.devisCommandeService.create(requestBody, req);
        return result;
    }

    @ApiOperation({ title: 'Maj devis commande' })
    @Put()
    @Authorized()
    @Rights(['CMD_CREATE'])
    async update(@Body() requestBody: DevisCommande, @Req() req) {
        const devisCommande = await this.devisCommandeService.get(requestBody.id);
        return await this.devisCommandeService.update(requestBody, req);
    }

    @ApiOperation({ title: 'Maj devis commande' })
    @Patch()
    @Authorized()
    async updatePartial(@Body() requestBody: DevisCommande, @Req() req) {
        const devisCommande = await this.devisCommandeService.get(requestBody.id);
        if (this.serviceUser.hasRightOnFranchise(req.user, ['CMD_CREATE'], devisCommande.idFranchise)) {
            return await this.devisCommandeService.partialUpdate(requestBody, req);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Delete devis commande' })
    @Delete(':id')
    @Authorized()
    async delete(@CurrentUtilisateur() user, @Param() params) {
        const devisCommande = await this.devisCommandeService.get(params.id);
        if (this.serviceUser.hasRightOnFranchise(user, ['CMD_TEST'], devisCommande.idFranchise)) {
            this.historiqueService.add(user.id, 'devis-commande', params.id, 'Création activité');
            return await this.devisCommandeService.delete(user, params.id);
        } else {
            throw new UnauthorizedException();
        }
    }

    @ApiOperation({ title: 'Génération de l\'export' })
    @Get('generateXlsx/:idFranchise')
    @Authorized(profils.FRANCHISE)
    async generateXlsx(@Param() params, @Res() res) {
        const data = await this.devisCommandeService.getForXlsx(params.idFranchise);
        const header = [
            'Id', 'Type devis', 'Ref', 'Mission', 'Nom contact', 'Prénom Contact',
            'Statut', 'Taux TVA', 'TotalTVA', 'Total HT', 'TotalRemiseHT',
            'TotalTTC', 'Version', 'Date Création', 'Commentaire devis', 'Commentaire interne',
            'Version figée', 'Adresse', 'CP', 'Ville'
        ];
        const datas = [];

        data.forEach((row) => {
            const client = row.contactDevisCommandes.find((client2) => {
                return client2.idTypeContactDevisCommande === this.enumTypeContactDevisCommande.CLIENT
            });
            const rowToPush = [];
            rowToPush.push(row.id);
            if (row.typeDevis) {
                rowToPush.push(this.enumTypeDevis[row.typeDevis]);
            } else {
                rowToPush.push('')
            }
            rowToPush.push(row.ref);
            rowToPush.push(row.mission);
            if (client && client.contact) {
                rowToPush.push(client.contact.nom);
                rowToPush.push(client.contact.prenom);
            } else {
                rowToPush.push('');
                rowToPush.push('');
            }
            if (row.statut) {
                rowToPush.push(row.statut.nom);
            } else {
                rowToPush.push('');
            }
            rowToPush.push(row.tauxTVA);
            rowToPush.push(row.totalTVA);
            rowToPush.push(row.totalHT);
            rowToPush.push(row.totalRemiseHT);
            rowToPush.push(row.totalTTC);
            rowToPush.push(row.version);
            rowToPush.push(row.dateCreation);
            rowToPush.push(row.commentaireDevis);
            rowToPush.push(row.commentaireInterne);
            if (row.versionFigee) {
                rowToPush.push('Oui');
            } else {
                rowToPush.push('Non');
            }
            if (row.adresse) {
                rowToPush.push(row.adresse.cp);
                rowToPush.push(row.adresse.ville);
                rowToPush.push(row.adresse.adresse);
            } else {
                rowToPush.push('');
                rowToPush.push('');
                rowToPush.push('');
            }
            datas.push(rowToPush);
        });

        res.end(await this.generationService.generateXlsx(header, datas))
    }

    @ApiOperation({ title: 'Delete interlocuteur' })
    @Delete('/deleteInterlocuteur/:idContactDevisCommande')
    @Authorized()
    async deleteInterlocuteur(@Param() params, @Req() req) {
        const contactDevisCommande = await this.devisCommandeService.getContactDevisCommande(params.idContactDevisCommande);
        // console.log(contactDevisCommande);
        this.historiqueService.add(req.user.id, 'devis-commande', contactDevisCommande.idDevisCommande,
            'Suppression de l\'interlocuteur ' + contactDevisCommande.contact.nom + ' ' + contactDevisCommande.contact.prenom);
        return await this.devisCommandeService.deleteContactDevisCommande(contactDevisCommande);
    }

    @ApiOperation({ title: 'Delete interlocuteur' })
    @Post('/addContact')
    @Authorized()
    async addContact(@Body() requestBody: ContactDevisCommande, @Req() req) {
        this.historiqueService.add(req.user.id, 'devis-commande', requestBody.idDevisCommande,
            'Ajout de l\'interlocuteur ' + requestBody.contact.nom + ' ' + requestBody.contact.prenom);
        return await this.devisCommandeService.addContact(requestBody);
    }
}