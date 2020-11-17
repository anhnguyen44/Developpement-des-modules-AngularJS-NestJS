import {
    Body, Controller, Delete, ForbiddenException, Get, InternalServerErrorException,
    NotFoundException, Param, ParseIntPipe, Patch, Post, Put, Query, UseInterceptors, Req
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { apiPath } from '../api';
import { Authorized } from '../common/decorators/authorized.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ZoneIntervention } from './zone-intervention.entity';
import { ZoneInterventionService } from './zone-intervention.service';
import { FichierService } from '../fichier/fichier.service';
import { CurrentUtilisateur } from '../utilisateur/utilisateur.decorator';
import { BatimentService } from '../batiment/batiment.service';
import { Batiment } from '../batiment/batiment.entity';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { ProcessusZoneService } from '../processus-zone/processus-zone.service';
import { ObjectifService } from '../objectif/objectif.service';
import { Objectif } from '../objectif/objectif.entity';
import {
    EnumTypeMesure, EnumMomentObjectifs, Strategie, EnumStatutPrelevement,
    EnumTypePrelevement, EnumTypeZoneIntervention, EnumStatutOccupationZone, EnumListeMateriauxAmiante,
    EnumSequencage, EnumConfinement, EnumMilieu, EnumTypeStrategie, EnumSousSectionStrategie
} from '@aleaac/shared';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { StrategieService } from '../strategie/strategie.service';
import { Prelevement } from '../prelevement/prelevement.entity';
import { ChantierService } from '../chantier/chantier.service';
import { Chantier } from '../chantier/chantier.entity';
import { PrelevementService } from '../prelevement/prelevement.service';
import { GES } from '../ges/ges.entity';
import { HistoriqueService } from '../historique/historique.service';


@ApiUseTags('ZoneIntervention')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'zone-intervention'))
export class ZoneInterventionController {
    constructor(
        private zoneInterventionService: ZoneInterventionService,
        private processusZoneService: ProcessusZoneService,
        private objectifService: ObjectifService,
        private echantillonnageService: EchantillonnageService,
        private chantierService: ChantierService,
        private prelevementService: PrelevementService,
        private strategieService: StrategieService,
        private historiqueService: HistoriqueService,
        private batimentService: BatimentService,
        private fichierService: FichierService,
    ) { }

    @ApiOperation({ title: 'Duplication' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle zoneIntervention.',
        type: ZoneIntervention
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post('duplicate/:idZoneFrom/:idStrategieTo')
    async duplicate(@Param() params, @Req() req) {
        const zone = await this.zoneInterventionService.findOneById(params.idZoneFrom, { relations: ['materiauxZone'] });
        return await this.zoneInterventionService.duplicate(zone, params.idStrategieTo);
    }

    @ApiOperation({ title: 'Duplication' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle zoneIntervention.',
        type: ZoneIntervention
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post('update-nb-prel-a-realiser/:idZone')
    async updateNbPrelARealiser(@Param() params, @Req() req) {
        let zone = await this.zoneInterventionService.findOneById(params.idZone);
        // zone.nbPrelevementsARealiser = await this.zoneInterventionService.calculPrelevementsARealiser(params.idZone);
        // zone.nbPrelevementsCalcul = await this.zoneInterventionService.calculPrelevements(zone.id);
        zone = await this.updateEchantillonnages(zone);
        return this.fullUpdate(zone, null);
    }

    @ApiOperation({ title: 'Nouvelle zoneIntervention' })
    @ApiResponse({
        status: 200,
        description: 'Identifiants ok, retourne la nouvelle zoneIntervention.',
        type: ZoneIntervention
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post()
    async create(@Body() requestBody: ZoneIntervention, @Req() req) {
        // console.log(requestBody);
        delete requestBody.horaires;
        try {
            const res = await this.zoneInterventionService.create(requestBody);
            const objectifs: Array<Objectif> = new Array<Objectif>();

            const strategie = await this.strategieService.get(requestBody.idStrategie);
            for (const categ of strategie.moments) {
                const objMoment = await this.objectifService.find({
                    where: {
                        idMomentObjectif: categ.id
                    }
                });

                for (const obj of objMoment) {
                    objectifs.push(obj);
                }
            }

            const isCodeTravail = strategie.sousSection != null && strategie.sousSection.toString() !== '';

            // On ne génère pas les mesures opérateur ici car il faut créer les echantillonnages en fonction du nb de GES (ie ProcessusZone)
            for (const obj of objectifs) {
                // console.log(obj.code);
                if ((obj.idType === null
                    || (isCodeTravail && obj.type.code === 'CT')
                    || (!isCodeTravail && obj.type.code === 'CSP'))
                    && !obj.isMesureOperateur
                ) {
                    // console.log(obj.code);
                    const tmpEch: Echantillonnage = new Echantillonnage();
                    tmpEch.code = res.reference + '-' + obj.code
                    tmpEch.idObjectif = obj.id;
                    tmpEch.idZIEch = res.id;
                    tmpEch.typeMesure = EnumTypeMesure.ENVIRONNEMENTALE;
                    tmpEch.duree = obj.hasTempsCalcule ? Number.parseInt(obj.duree.match(/\d+/g)[0]) : 0;
                    tmpEch.dureeARealiser = tmpEch.duree;
                    tmpEch.frequenceParSemaine = (obj.code === 'L' || obj.code === 'M' || obj.code === 'MExt'
                                    || obj.code === 'P' || obj.code === 'Q' || obj.code === 'R' || obj.code === 'S')
                        ? 1
                        : 0; // 0 = Oneshot
                    tmpEch.isRealise = obj.isObligatoireCOFRAC;
                    tmpEch.nbMesures = this.echantillonnageService.getNbPrelevements(obj, res);
                    tmpEch.nbMesuresARealiser = tmpEch.nbMesures;

                    this.echantillonnageService.create(tmpEch);
                }
            }

            let descriptionStrat = '';
            descriptionStrat += strategie.reference + ' ';
            descriptionStrat += strategie.typeStrategie ? '(' + EnumTypeStrategie[strategie.typeStrategie] + ') ' : '';
            descriptionStrat += strategie.sousSection ? '(' + EnumSousSectionStrategie[strategie.sousSection] + ') ' : '(CSP)';

            let historique = 'Ajout de la ' + res.reference + ' à la stratégie ';
            historique += descriptionStrat;

            this.historiqueService.add(req.user.id, 'chantier', strategie.id, historique);
            return res;
        } catch (err) {
            if (err.message === 'La zoneIntervention existe déjà.') {
                // console.log(err);
                throw new ForbiddenException(err.message);
            } else {
                // console.log(err);
                throw new InternalServerErrorException(err.message);
            }
        }
    }

    @ApiOperation({ title: 'Initialise les prélèvements de la zoneIntervention' })
    @ApiResponse({
        status: 200,
        description: 'Initialise les prélèvements de la zoneIntervention',
        type: ZoneIntervention
    })
    @ApiResponse({ status: 400, description: 'Formulaire invalide.' })
    @Post('init-prelevements/:idZone')
    async initPrelevements(@Param('idZone') idZone, @Req() req) {
        const zone: ZoneIntervention = await this.zoneInterventionService.findOneById(idZone);
        zone.processusZone = await this.processusZoneService.getAllByZone(idZone, '');
        const strategie: Strategie = await this.strategieService.get(zone.idStrategie);
        const chantier: Chantier = await this.chantierService.get(strategie.idChantier);
        const echantillonnages: Echantillonnage[] = await this.echantillonnageService.getAll(idZone, '');

        if (zone.type === EnumTypeZoneIntervention.ZH) {
            for (const echantillonnage of echantillonnages) {
                if (echantillonnage.isRealise) {
                    let nbTotalARealiser = echantillonnage.nbMesuresARealiser;

                    if (echantillonnage.frequenceParSemaine > 0) {
                        nbTotalARealiser = nbTotalARealiser * echantillonnage.frequenceParSemaine;
                    }

                    for (let i = 0; i < nbTotalARealiser; i++) {
                        await this.createSinglePrelevementZH(strategie, echantillonnage, chantier, zone, (i + 1));
                    }
                }
            }
        } else if (zone.type === EnumTypeZoneIntervention.ZT) {
            for (const echantillonnage of echantillonnages) {
                if (echantillonnage.isRealise) {
                    let nbTotalARealiser = echantillonnage.nbMesuresARealiser;

                    if (echantillonnage.frequenceParSemaine > 0) {
                        nbTotalARealiser = nbTotalARealiser * echantillonnage.frequenceParSemaine;
                    }
                    if (echantillonnage.objectif.isMesureOperateur && zone.processusZone && zone.processusZone.length) {
                        let i = 0;
                        for (const pz of zone.processusZone) {
                            for (const ges of pz.listeGES) {
                                await this.createSinglePrelevementZT(strategie, echantillonnage, chantier, zone, (i + 1), pz, ges);
                                i++;
                            }
                        }
                    } else {
                        for (let i = 0; i < nbTotalARealiser; i++) {
                            await this.createSinglePrelevementZH(strategie, echantillonnage, chantier, zone, (i + 1));
                        }
                    }
                }
            }
        } else {
            throw new InternalServerErrorException('Faut que la zone ait un type heing, sinon comment je sais ce qu\'il faut y mettre ?');
        }

        this.historiqueService.add(req.user.id, 'chantier', strategie.id,
            'Initialisation des prélèvements de la ' + zone.reference + ' à partir de son échantillonnage.');
    }

    private async createSinglePrelevementZH(strategie: Strategie, echantillonnage: Echantillonnage, chantier: Chantier,
        zone: ZoneIntervention, refNb: number) {
        const prel: Prelevement = new Prelevement();
        prel.idChantier = strategie.idChantier;
        prel.idEchantillonnage = echantillonnage.id;
        prel.idFranchise = chantier.idFranchise;
        prel.idObjectif = echantillonnage.idObjectif;
        prel.idSitePrelevement = zone.batiment.idSitePrelevement;
        prel.idStatutPrelevement = EnumStatutPrelevement.EN_ATTENTE;
        prel.idStrategie = strategie.id;
        prel.idTypeEcartSaVisee = 1;
        prel.idTypePrelevement = echantillonnage.objectif.isMesureOperateur
            ? EnumTypePrelevement.METAOP
            : EnumTypePrelevement.ENVIRONNEMENTAL;
        prel.idZIPrel = zone.id;
        prel.isCofrac = true;
        prel.isCreeApresStrategie = false;
        prel.isDelaiExpress = false;
        //prel.isNonEffectue = false;

        if (echantillonnage.objectif.SAFibreParLitre !== null) {
            prel.saViseeStrategie = echantillonnage.objectif.SAFibreParLitre;
        } else if (echantillonnage.objectif.limiteSup !== null) {
            prel.saViseeStrategie = echantillonnage.objectif.limiteSup;
        } else {
            prel.saViseeStrategie = 1;
        }
        prel.reference = echantillonnage.code + '-' + this.pad(refNb, 3).toString();
        await this.prelevementService.create(prel);
    }

    private async createSinglePrelevementZT(strategie: Strategie, echantillonnage: Echantillonnage, chantier: Chantier,
        zone: ZoneIntervention, refNb: number, processusZone: ProcessusZone, ges: GES) {
        const prel: Prelevement = new Prelevement();
        prel.idChantier = strategie.idChantier;
        prel.idEchantillonnage = echantillonnage.id;
        prel.idFranchise = chantier.idFranchise;
        prel.idObjectif = echantillonnage.idObjectif;
        prel.idSitePrelevement = zone.batiment.idSitePrelevement;
        prel.idStatutPrelevement = EnumStatutPrelevement.EN_ATTENTE;
        prel.idStrategie = strategie.id;
        prel.idTypeEcartSaVisee = 1;
        prel.idTypePrelevement = echantillonnage.objectif.isMesureOperateur
            ? EnumTypePrelevement.METAOP
            : EnumTypePrelevement.ENVIRONNEMENTAL;
        prel.idZIPrel = zone.id;
        prel.isCofrac = true;
        prel.isCreeApresStrategie = false;
        prel.isDelaiExpress = false;
        // prel.isNonEffectue = false;

        if (echantillonnage.objectif.isMesureOperateur) {
            prel.idProcessus = processusZone.processus.id;
            prel.idProcessusZone = processusZone.id;
            prel.idGes = ges.id;
        }

        if (echantillonnage.objectif.SAFibreParLitre !== null) {
            prel.saViseeStrategie = echantillonnage.objectif.SAFibreParLitre;
        } else if (echantillonnage.objectif.limiteSup !== null) {
            prel.saViseeStrategie = echantillonnage.objectif.limiteSup;
        } else {
            prel.saViseeStrategie = 1;
        }
        prel.reference = echantillonnage.code + '-' + this.pad(refNb, 3).toString();
        await this.prelevementService.create(prel);
    }

    private pad(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    @Get('all/:idStrategie')
    @Authorized()
    async findAllStrategie(@Param('idStrategie') idStrategie, @Req() req): Promise<ZoneIntervention[]> {

        const foundZoneIntervention = await this.zoneInterventionService.findByStrategie(idStrategie, req.query);

        return foundZoneIntervention;
    }

    @Get('countAll/:idStrategie')
    @Authorized()
    async countAllStrategie(@Param('idStrategie') idStrategie, @Req() req): Promise<number> {
        const foundZoneIntervention = await this.zoneInterventionService.findByStrategie(idStrategie, req.query);

        return foundZoneIntervention.length;
    }

    @Get(':idOrName')
    @Authorized()
    async findOne(@Param('idOrName') idOrName): Promise<ZoneIntervention> {
        const foundZoneIntervention = this.zoneInterventionService.findOneById(parseInt(idOrName, 10));

        if (!foundZoneIntervention) {
            throw new NotFoundException(`ZoneIntervention '${idOrName}' introuvable`);
        }

        return foundZoneIntervention;
    }

    @Get()
    @Authorized()
    async find(@Query() findOptions?: FindManyOptions<ZoneIntervention>): Promise<ZoneIntervention[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        return this.zoneInterventionService.find(options);
    }

    isNumber(value: string | number): boolean {
        return !isNaN(Number(value.toString()));
    }

    @Put()
    @Authorized()
    async fullUpdate(@Body() zoneIntervention: ZoneIntervention, @Req() req) {
        // TODO : check droits
        delete zoneIntervention.horaires;
        const old = await this.zoneInterventionService.findOneById(zoneIntervention.id);

        let historique = '';

        if (old.reference && zoneIntervention.reference && old.reference !== zoneIntervention.reference) {
            historique += 'Modification de la référence zone : ' + old.reference
                + ' &#x2192; ' + zoneIntervention.reference + '\n';
        }

        if (old.libelle && zoneIntervention.libelle && old.libelle !== zoneIntervention.libelle) {
            historique += 'Modification du libellé de la zone : ' + old.libelle
                + ' &#x2192; ' + zoneIntervention.libelle + '\n';
        }

        if (old.descriptif && zoneIntervention.descriptif && old.descriptif !== zoneIntervention.descriptif) {
            historique += 'Modification du descriptif de la zone : ' + old.descriptif
                + ' &#x2192; ' + zoneIntervention.descriptif + '\n';
        }

        if (old.statut && zoneIntervention.statut && old.statut !== zoneIntervention.statut) {
            historique += 'Modification du statut de la zone : ' + EnumStatutOccupationZone[old.statut]
                + ' &#x2192; ' + EnumStatutOccupationZone[zoneIntervention.statut] + '\n';
        }

        if (
            (old.batiment && zoneIntervention.batiment && old.batiment !== zoneIntervention.batiment)
            || (old.idBatiment && zoneIntervention.idBatiment && old.idBatiment !== zoneIntervention.idBatiment)
        ) {
            if (zoneIntervention.batiment) {
                historique += 'Modification du bâtiment de la zone : ' + old.batiment.nom
                    + ' &#x2192; ' + zoneIntervention.batiment.nom + '\n';
            } else {
                if (zoneIntervention.idBatiment) {
                    const nouveauBat = await this.batimentService.findOneById(zoneIntervention.idBatiment);
                    historique += 'Modification du bâtiment de la zone : ' + (old.batiment ? old.batiment.nom : 'Aucun')
                        + ' &#x2192; ' + nouveauBat.nom + '\n';
                }
            }
        }

        if ((old.isZoneDefinieAlea && !zoneIntervention.isZoneDefinieAlea)
            || (!old.isZoneDefinieAlea && zoneIntervention.isZoneDefinieAlea)) {
            historique += 'Zone définie par AléaContrôles : ' + (old.isZoneDefinieAlea ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isZoneDefinieAlea ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.isSousAccreditation && !zoneIntervention.isSousAccreditation)
            || (!old.isSousAccreditation && zoneIntervention.isSousAccreditation)) {
            historique += 'Zone définie sous accréditation : ' + (old.isSousAccreditation ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isSousAccreditation ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if (old.commentaire && zoneIntervention.commentaire && old.commentaire !== zoneIntervention.commentaire) {
            historique += 'Modification du commentaire de la zone : ' + old.commentaire
                + ' &#x2192; ' + zoneIntervention.commentaire + '\n';
        }

        // MateriauxZone : Suppressions
        if (old.materiauxZone) {
            for (const materiauZone of old.materiauxZone) {
                if (!zoneIntervention.materiauxZone || zoneIntervention.materiauxZone.findIndex(o => o.id === materiauZone.id) === -1) {
                    historique += 'Suppression matériau de la zone : ';

                    if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.A) {
                        historique += materiauZone.materiau.composantConstruction;
                    } else if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.Autre) {
                        historique += materiauZone.materiauAutre;
                    } else {
                        historique += materiauZone.materiau.partieComposant;
                    }

                    historique += '\n';
                }
            }
        }
        // MateriauxZone : Ajouts
        if (zoneIntervention.materiauxZone) {
            for (const materiauZone of zoneIntervention.materiauxZone) {
                if (!old.materiauxZone || old.materiauxZone.findIndex(o => o.id === materiauZone.id) === -1) {
                    historique += 'Ajout matériau à la zone : ';

                    if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.A) {
                        historique += materiauZone.materiau.composantConstruction;
                    } else if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.Autre) {
                        historique += materiauZone.materiauAutre;
                    } else {
                        historique += materiauZone.materiau.partieComposant;
                    }

                    historique += '\n';
                }
            }
        }

        // Locaux Unitaires : Suppressions
        if (old.locaux) {
            for (const local of old.locaux) {
                if (!zoneIntervention.locaux || zoneIntervention.locaux.findIndex(o => o.id === local.id) === -1) {
                    historique += 'Suppression local unitaire de la zone : ';
                    historique += local.nom;
                    historique += '\n';
                }
            }
        }
        // Locaux Unitaires : Ajouts
        if (zoneIntervention.locaux) {
            for (const local of zoneIntervention.locaux) {
                if (!old.locaux || old.locaux.findIndex(o => o.id === local.id) === -1) {
                    historique += 'Ajout local unitaire à la zone : ';
                    historique += local.nom;
                    historique += '\n';
                }
            }
        }

        // Champs calcués : nbPiecesUnitaires, nbPrelevementsCalcul, nbPrelevementsARealiser (on historise pas)

        if (old.commentaireDifferenceNbPrelevements && zoneIntervention.commentaireDifferenceNbPrelevements
            && old.commentaireDifferenceNbPrelevements !== zoneIntervention.commentaireDifferenceNbPrelevements) {
            historique += 'Modification du commentaireDifferenceNbPrelevements de la zone : ' + old.commentaireDifferenceNbPrelevements
                + ' &#x2192; ' + zoneIntervention.commentaireDifferenceNbPrelevements + '\n';
        }

        if (old.dureeMinPrelevement && zoneIntervention.dureeMinPrelevement
            && old.dureeMinPrelevement !== zoneIntervention.dureeMinPrelevement) {
            historique += 'Modification du dureeMinPrelevement de la zone : ' + old.dureeMinPrelevement
                + ' &#x2192; ' + zoneIntervention.dureeMinPrelevement + '\n';
        }

        if (old.sequencage && zoneIntervention.sequencage && old.sequencage !== zoneIntervention.sequencage) {
            historique += 'Modification du séquençage : ' + EnumSequencage[old.statut]
                + ' &#x2192; ' + EnumSequencage[zoneIntervention.statut] + '\n';
        }

        if (old.repartition && zoneIntervention.repartition
            && old.repartition !== zoneIntervention.repartition) {
            historique += 'Modification de la répartition de la zone : ' + old.repartition
                + ' &#x2192; ' + zoneIntervention.repartition + '\n';
        }

        if (old.precisionsRepartition && zoneIntervention.precisionsRepartition
            && old.precisionsRepartition !== zoneIntervention.precisionsRepartition) {
            historique += 'Modification des précisions sur la répartition de la zone : ' + old.precisionsRepartition
                + ' &#x2192; ' + zoneIntervention.precisionsRepartition + '\n';
        }

        // Processus : Suppressions
        if (old.processusZone) {
            for (const processusZone of old.processusZone) {
                if (!zoneIntervention.processusZone || zoneIntervention.processusZone.findIndex(o => o.id === processusZone.id) === -1) {
                    historique += 'Suppression processus de la zone : ';
                    if (processusZone.processus) {
                        historique += processusZone.processus.libelle;
                    } else {
                        const pz = await this.processusZoneService.get(processusZone.id);
                        historique += pz.processus.libelle;
                    }
                    historique += '\n';
                }
            }
        }

        // Processus : Ajouts
        if (zoneIntervention.processusZone) {
            for (const processusZone of zoneIntervention.processusZone) {
                if (!old.processusZone || old.processusZone.findIndex(o => o.id === processusZone.id) === -1) {
                    historique += 'Ajout processus à la zone : ';
                    if (processusZone.processus) {
                        historique += processusZone.processus.libelle;
                    } else {
                        const pz = await this.processusZoneService.get(processusZone.id);
                        historique += pz.processus.libelle;
                    }
                    historique += '\n';
                }
            }
        }

        if (old.stationMeteo && zoneIntervention.stationMeteo
            && old.stationMeteo !== zoneIntervention.stationMeteo) {
            historique += 'Modification de la station météo de la zone : ' + old.stationMeteo
                + ' &#x2192; ' + zoneIntervention.stationMeteo + '\n';
        }

        if (old.dureeTraitementEnSemaines && zoneIntervention.dureeTraitementEnSemaines
            && old.dureeTraitementEnSemaines !== zoneIntervention.dureeTraitementEnSemaines) {
            historique += 'Modification de la durée de traitement (en semaines) de la zone : ' + old.dureeTraitementEnSemaines
                + ' &#x2192; ' + zoneIntervention.dureeTraitementEnSemaines + '\n';
        }

        // Environnements : Suppressions
        if (old.environnements) {
            for (const env of old.environnements) {
                if (!zoneIntervention.environnements || zoneIntervention.environnements.findIndex(o => o.id === env.id) === -1) {
                    historique += 'Suppression environnement de la zone : ';
                    historique += env.nom;
                    historique += '\n';
                }
            }
        }

        // Environnements : Ajouts
        if (zoneIntervention.environnements) {
            for (const env of zoneIntervention.environnements) {
                if (!old.environnements || old.environnements.findIndex(o => o.id === env.id) === -1) {
                    historique += 'Ajout environnement à la zone : ';
                    historique += env.nom;
                    historique += '\n';
                }
            }
        }

        if (old.confinement && zoneIntervention.confinement && old.confinement !== zoneIntervention.confinement) {
            historique += 'Modification du confinement : ' + EnumConfinement[old.confinement]
                + ' &#x2192; ' + EnumConfinement[zoneIntervention.confinement] + '\n';
        }

        // GES / Nom à définir : Suppressions
        if (old.listeGES) {
            for (const ges of old.listeGES) {
                if (!zoneIntervention.listeGES || zoneIntervention.listeGES.findIndex(o => o.id === ges.id) === -1) {
                    historique += 'Suppression [Nom à définir par Aléa] d\'un processus de la zone : ';
                    historique += ges.nom;
                    historique += '\n';
                }
            }
        }

        // GES / Nom à définir : Ajouts
        if (zoneIntervention.listeGES) {
            for (const ges of zoneIntervention.listeGES) {
                if (!old.listeGES || old.listeGES.findIndex(o => o.id === ges.id) === -1) {
                    historique += 'Ajout [Nom à définir par Aléa] à un processus de la zone : ';
                    historique += ges.nom;
                    historique += '\n';
                }
            }
        }

        // On historise pas la création/suppression d'échantillonnage car c'est généré

        if (
            (old.PIC && zoneIntervention.PIC && old.PIC !== zoneIntervention.PIC)
            || (old.idPIC && zoneIntervention.idPIC && old.idPIC !== zoneIntervention.idPIC)
            || (!old.idPIC && zoneIntervention.idPIC)
        ) {
            if (zoneIntervention.PIC) {
                historique += 'Modification du PIC de la zone : ' + (old.PIC ? old.PIC.nom : 'Aucun')
                    + ' &#x2192; ' + zoneIntervention.PIC.nom + '\n';
            } else {
                if (zoneIntervention.idPIC) {
                    const nouveauPIC = await this.fichierService.getById(zoneIntervention.idPIC);
                    historique += 'Modification du bâtiment de la zone : ' + (old.PIC ? old.PIC.nom : 'Aucun')
                        + ' &#x2192; ' + nouveauPIC.nom + '\n';
                }
            }
        }

        if ((old.isZoneInf10 && !zoneIntervention.isZoneInf10) || (!old.isZoneInf10 && zoneIntervention.isZoneInf10)) {
            historique += 'Zone Homogène < 10m² : ' + (old.isZoneInf10 ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isZoneInf10 ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.isExterieur && !zoneIntervention.isExterieur) || (!old.isExterieur && zoneIntervention.isExterieur)) {
            historique += 'Zone de Travail en Extérieur : ' + (old.isExterieur ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isExterieur ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if (old.nbGrpExtracteurs !== zoneIntervention.nbGrpExtracteurs) {
            zoneIntervention = await this.updateEchantillonnages(zoneIntervention);
            historique += 'Modification du nombre de groupes d\'extracteurs : ' + (old.nbGrpExtracteurs ? old.nbGrpExtracteurs : 0)
                + ' &#x2192; ' + zoneIntervention.nbGrpExtracteurs + '\n';
        }

        if (old.milieu && zoneIntervention.milieu && old.milieu !== zoneIntervention.milieu) {
            historique += 'Modification du milieu : ' + EnumMilieu[old.milieu]
                + ' &#x2192; ' + EnumMilieu[zoneIntervention.milieu] + '\n';
        }

        let tmpZoneForSave = zoneIntervention as any;
        delete tmpZoneForSave.zoneInterventionId;

        tmpZoneForSave.nbPiecesUnitaires = await this.zoneInterventionService.calculPUFromZone(zoneIntervention);
        tmpZoneForSave = await this.updateEchantillonnages(tmpZoneForSave);

        const res = this.zoneInterventionService.update(zoneIntervention.id, tmpZoneForSave);

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'zone-intervention', zoneIntervention.id, historique);

            const strat = await this.strategieService.get(zoneIntervention.idStrategie);
            const chantier = await this.chantierService.get(strat.idChantier);
            this.historiqueService.add(req.user.id, 'chantier', chantier.id,
                'Modification de la ' + zoneIntervention.reference + ' : ' + '\n' + historique);
        }

        return res;
    }

    @Patch(':id')
    @Authorized()
    async partialUpdate(
        @Param('id', new ParseIntPipe())
        zoneInterventionId: number,
        @Body() zoneIntervention: DeepPartial<ZoneIntervention>,
        @Req() req
    ) {
        // TODO : check droits
        delete zoneIntervention.horaires;

        const old = await this.zoneInterventionService.findOneById(zoneInterventionId);

        let historique = '';

        if (old.reference && zoneIntervention.reference && old.reference !== zoneIntervention.reference) {
            historique += 'Modification de la référence zone : ' + old.reference
                + ' &#x2192; ' + zoneIntervention.reference + '\n';
        }

        if (old.libelle && zoneIntervention.libelle && old.libelle !== zoneIntervention.libelle) {
            historique += 'Modification du libellé de la zone : ' + old.libelle
                + ' &#x2192; ' + zoneIntervention.libelle + '\n';
        }

        if (old.descriptif && zoneIntervention.descriptif && old.descriptif !== zoneIntervention.descriptif) {
            historique += 'Modification du descriptif de la zone : ' + old.descriptif
                + ' &#x2192; ' + zoneIntervention.descriptif + '\n';
        }

        if (old.statut && zoneIntervention.statut && old.statut !== zoneIntervention.statut) {
            historique += 'Modification du statut de la zone : ' + EnumStatutOccupationZone[old.statut]
                + ' &#x2192; ' + EnumStatutOccupationZone[zoneIntervention.statut] + '\n';
        }

        if (
            (old.batiment && zoneIntervention.batiment && old.batiment !== zoneIntervention.batiment)
            || (old.idBatiment && zoneIntervention.idBatiment && old.idBatiment !== zoneIntervention.idBatiment)
        ) {
            if (zoneIntervention.batiment) {
                historique += 'Modification du bâtiment de la zone : ' + old.batiment.nom
                    + ' &#x2192; ' + zoneIntervention.batiment.nom + '\n';
            } else {
                if (zoneIntervention.idBatiment) {
                    const nouveauBat = await this.batimentService.findOneById(zoneIntervention.idBatiment);
                    historique += 'Modification du bâtiment de la zone : ' + (old.batiment ? old.batiment.nom : 'Aucun')
                        + ' &#x2192; ' + nouveauBat.nom + '\n';
                }
            }
        }

        if ((old.isZoneDefinieAlea && !zoneIntervention.isZoneDefinieAlea)
            || (!old.isZoneDefinieAlea && zoneIntervention.isZoneDefinieAlea)) {
            historique += 'Zone définie par AléaContrôles : ' + (old.isZoneDefinieAlea ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isZoneDefinieAlea ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.isSousAccreditation && !zoneIntervention.isSousAccreditation)
            || (!old.isSousAccreditation && zoneIntervention.isSousAccreditation)) {
            historique += 'Zone définie sous accréditation : ' + (old.isSousAccreditation ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isSousAccreditation ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if (old.commentaire && zoneIntervention.commentaire && old.commentaire !== zoneIntervention.commentaire) {
            historique += 'Modification du commentaire de la zone : ' + old.commentaire
                + ' &#x2192; ' + zoneIntervention.commentaire + '\n';
        }

        // MateriauxZone : Suppressions
        if (old.materiauxZone) {
            for (const materiauZone of old.materiauxZone) {
                if (!zoneIntervention.materiauxZone || zoneIntervention.materiauxZone.findIndex(o => o.id === materiauZone.id) === -1) {
                    historique += 'Suppression matériau de la zone : ';

                    if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.A) {
                        historique += materiauZone.materiau.composantConstruction;
                    } else if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.Autre) {
                        historique += materiauZone.materiauAutre;
                    } else {
                        historique += materiauZone.materiau.partieComposant;
                    }

                    historique += '\n';
                }
            }
        }
        // MateriauxZone : Ajouts
        if (zoneIntervention.materiauxZone) {
            for (const materiauZone of zoneIntervention.materiauxZone) {
                if (!old.materiauxZone || old.materiauxZone.findIndex(o => o.id === materiauZone.id) === -1) {
                    historique += 'Ajout matériau à la zone : ';

                    if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.A) {
                        historique += materiauZone.materiau.composantConstruction;
                    } else if (materiauZone.materiau.liste === EnumListeMateriauxAmiante.Autre) {
                        historique += materiauZone.materiauAutre;
                    } else {
                        historique += materiauZone.materiau.partieComposant;
                    }

                    historique += '\n';
                }
            }
        }

        // Locaux Unitaires : Suppressions
        if (old.locaux) {
            for (const local of old.locaux) {
                if (!zoneIntervention.locaux || zoneIntervention.locaux.findIndex(o => o.id === local.id) === -1) {
                    historique += 'Suppression local unitaire de la zone : ';
                    historique += local.nom;
                    historique += '\n';
                }
            }
        }
        // Locaux Unitaires : Ajouts
        if (zoneIntervention.locaux) {
            for (const local of zoneIntervention.locaux) {
                if (!old.locaux || old.locaux.findIndex(o => o.id === local.id) === -1) {
                    historique += 'Ajout local unitaire à la zone : ';
                    historique += local.nom;
                    historique += '\n';
                }
            }
        }

        // Champs calcués : nbPiecesUnitaires, nbPrelevementsCalcul, nbPrelevementsARealiser (on historise pas)

        if (old.commentaireDifferenceNbPrelevements && zoneIntervention.commentaireDifferenceNbPrelevements
            && old.commentaireDifferenceNbPrelevements !== zoneIntervention.commentaireDifferenceNbPrelevements) {
            historique += 'Modification du commentaireDifferenceNbPrelevements de la zone : ' + old.commentaireDifferenceNbPrelevements
                + ' &#x2192; ' + zoneIntervention.commentaireDifferenceNbPrelevements + '\n';
        }

        if (old.dureeMinPrelevement && zoneIntervention.dureeMinPrelevement
            && old.dureeMinPrelevement !== zoneIntervention.dureeMinPrelevement) {
            historique += 'Modification du dureeMinPrelevement de la zone : ' + old.dureeMinPrelevement
                + ' &#x2192; ' + zoneIntervention.dureeMinPrelevement + '\n';
        }

        if (old.sequencage && zoneIntervention.sequencage && old.sequencage !== zoneIntervention.sequencage) {
            historique += 'Modification du séquençage : ' + EnumSequencage[old.statut]
                + ' &#x2192; ' + EnumSequencage[zoneIntervention.statut] + '\n';
        }

        if (old.repartition && zoneIntervention.repartition
            && old.repartition !== zoneIntervention.repartition) {
            historique += 'Modification de la répartition de la zone : ' + old.repartition
                + ' &#x2192; ' + zoneIntervention.repartition + '\n';
        }

        if (old.precisionsRepartition && zoneIntervention.precisionsRepartition
            && old.precisionsRepartition !== zoneIntervention.precisionsRepartition) {
            historique += 'Modification des précisions sur la répartition de la zone : ' + old.precisionsRepartition
                + ' &#x2192; ' + zoneIntervention.precisionsRepartition + '\n';
        }

        // Processus : Suppressions
        if (old.processusZone) {
            for (const processusZone of old.processusZone) {
                if (!zoneIntervention.processusZone || zoneIntervention.processusZone.findIndex(o => o.id === processusZone.id) === -1) {
                    historique += 'Suppression processus de la zone : ';
                    if (processusZone.processus) {
                        historique += processusZone.processus.libelle;
                    } else {
                        const pz = await this.processusZoneService.get(processusZone.id);
                        historique += pz.processus.libelle;
                    }
                    historique += '\n';
                }
            }
        }

        // Processus : Ajouts
        if (zoneIntervention.processusZone) {
            for (const processusZone of zoneIntervention.processusZone) {
                if (!old.processusZone || old.processusZone.findIndex(o => o.id === processusZone.id) === -1) {
                    historique += 'Ajout processus à la zone : ';
                    if (processusZone.processus) {
                        historique += processusZone.processus.libelle;
                    } else {
                        const pz = await this.processusZoneService.get(processusZone.id);
                        historique += pz.processus.libelle;
                    }
                    historique += '\n';
                }
            }
        }

        if (old.stationMeteo && zoneIntervention.stationMeteo
            && old.stationMeteo !== zoneIntervention.stationMeteo) {
            historique += 'Modification de la station météo de la zone : ' + old.stationMeteo
                + ' &#x2192; ' + zoneIntervention.stationMeteo + '\n';
        }

        if (old.dureeTraitementEnSemaines && zoneIntervention.dureeTraitementEnSemaines
            && old.dureeTraitementEnSemaines !== zoneIntervention.dureeTraitementEnSemaines) {
            historique += 'Modification de la durée de traitement (en semaines) de la zone : ' + old.dureeTraitementEnSemaines
                + ' &#x2192; ' + zoneIntervention.dureeTraitementEnSemaines + '\n';
        }

        // Environnements : Suppressions
        if (old.environnements) {
            for (const env of old.environnements) {
                if (!zoneIntervention.environnements || zoneIntervention.environnements.findIndex(o => o.id === env.id) === -1) {
                    historique += 'Suppression environnement de la zone : ';
                    historique += env.nom;
                    historique += '\n';
                }
            }
        }

        // Environnements : Ajouts
        if (zoneIntervention.environnements) {
            for (const env of zoneIntervention.environnements) {
                if (!old.environnements || old.environnements.findIndex(o => o.id === env.id) === -1) {
                    historique += 'Ajout environnement à la zone : ';
                    historique += env.nom;
                    historique += '\n';
                }
            }
        }

        if (old.confinement && zoneIntervention.confinement && old.confinement !== zoneIntervention.confinement) {
            historique += 'Modification du confinement : ' + EnumConfinement[old.confinement]
                + ' &#x2192; ' + EnumConfinement[zoneIntervention.confinement] + '\n';
        }

        // GES / Nom à définir : Suppressions
        if (old.listeGES) {
            for (const ges of old.listeGES) {
                if (!zoneIntervention.listeGES || zoneIntervention.listeGES.findIndex(o => o.id === ges.id) === -1) {
                    historique += 'Suppression [Nom à définir par Aléa] d\'un processus de la zone : ';
                    historique += ges.nom;
                    historique += '\n';
                }
            }
        }

        // GES / Nom à définir : Ajouts
        if (zoneIntervention.listeGES) {
            for (const ges of zoneIntervention.listeGES) {
                if (!old.listeGES || old.listeGES.findIndex(o => o.id === ges.id) === -1) {
                    historique += 'Ajout [Nom à définir par Aléa] à un processus de la zone : ';
                    historique += ges.nom;
                    historique += '\n';
                }
            }
        }

        // On historise pas la création/suppression d'échantillonnage car c'est généré

        if (
            (old.PIC && zoneIntervention.PIC && old.PIC !== zoneIntervention.PIC)
            || (old.idPIC && zoneIntervention.idPIC && old.idPIC !== zoneIntervention.idPIC)
            || (!old.idPIC && zoneIntervention.idPIC)
        ) {
            if (zoneIntervention.PIC) {
                historique += 'Modification du PIC de la zone : ' + (old.PIC ? old.PIC.nom : 'Aucun')
                    + ' &#x2192; ' + zoneIntervention.PIC.nom + '\n';
            } else {
                if (zoneIntervention.idPIC) {
                    const nouveauPIC = await this.fichierService.getById(zoneIntervention.idPIC);
                    historique += 'Modification du bâtiment de la zone : ' + (old.PIC ? old.PIC.nom : 'Aucun')
                        + ' &#x2192; ' + nouveauPIC.nom + '\n';
                }
            }
        }

        if ((old.isZoneInf10 && !zoneIntervention.isZoneInf10) || (!old.isZoneInf10 && zoneIntervention.isZoneInf10)) {
            historique += 'Zone Homogène < 10m² : ' + (old.isZoneInf10 ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isZoneInf10 ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if ((old.isExterieur && !zoneIntervention.isExterieur) || (!old.isExterieur && zoneIntervention.isExterieur)) {
            historique += 'Zone de Travail en Extérieur : ' + (old.isExterieur ? '&#x2705;' : '&#x274C;')
                + ' &#x2192; ' + (zoneIntervention.isExterieur ? '&#x2705;' : '&#x274C;') + '\n';
        }

        if (old.nbGrpExtracteurs !== zoneIntervention.nbGrpExtracteurs) {
            if (!zoneIntervention.id) {
                zoneIntervention.id = zoneInterventionId;
            }
            zoneIntervention = await this.updateEchantillonnages(zoneIntervention as ZoneIntervention);
            historique += 'Modification du nombre de groupes d\'extracteurs : ' + (old.nbGrpExtracteurs ? old.nbGrpExtracteurs : 0)
                + ' &#x2192; ' + zoneIntervention.nbGrpExtracteurs + '\n';
        }

        if (old.milieu && zoneIntervention.milieu && old.milieu !== zoneIntervention.milieu) {
            historique += 'Modification du milieu : ' + EnumMilieu[old.milieu]
                + ' &#x2192; ' + EnumMilieu[zoneIntervention.milieu] + '\n';
        }

        if (historique.length > 0) {
            this.historiqueService.add(req.user.id, 'zone-intervention', zoneIntervention.id, historique);

            const strat = await this.strategieService.get(zoneIntervention.idStrategie);
            const chantier = await this.chantierService.get(strat.idChantier);
            this.historiqueService.add(req.user.id, 'chantier', chantier.id,
                'Modification de la ' + zoneIntervention.reference + ' : ' + '\n' + historique);
        }

        let tmpZoneForSave = zoneIntervention as any;
        delete tmpZoneForSave.zoneInterventionId;

        tmpZoneForSave.nbPiecesUnitaires = await this.zoneInterventionService.calculPUFromZone((tmpZoneForSave as ZoneIntervention));
        tmpZoneForSave = await this.updateEchantillonnages((tmpZoneForSave as ZoneIntervention));

        return this.zoneInterventionService.update(zoneInterventionId, tmpZoneForSave);
    }

    @Delete(':id')
    @Authorized()
    async remove(
        @Param('id', new ParseIntPipe())
        zoneInterventionId: number,
        @CurrentUtilisateur() user
    ) {
        const old = await this.zoneInterventionService.findOneById(zoneInterventionId);

        const liensProcessus: ProcessusZone[] = await this.processusZoneService.getAllByZone(zoneInterventionId, null);
        if (liensProcessus && liensProcessus.length > 0) {
            for (const processZone of liensProcessus) {
                try {
                    await this.processusZoneService.delete(processZone);
                } catch (e) {
                    console.error(e);
                }
            }
        }

        const prelevements: Prelevement[] = await this.prelevementService.getAllByType('idZIPrel', zoneInterventionId, null);
        if (prelevements && prelevements.length > 0) {
            for (const prel of prelevements) {
                if (prel.idStatutPrelevement === EnumStatutPrelevement.EN_ATTENTE) {
                    try {
                        await this.prelevementService.delete(prel.id);
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        }

        // TODO : check droits
        // Delete pieces jointes
        // const fichiersLies = await this.fichierService.getAll('zone-intervention', zoneInterventionId);
        // for (const fichier of fichiersLies) {
        //     this.fichierService.delete(fichier.id, user);
        // }

        const strat = await this.strategieService.get(old.idStrategie);
        const chantier = await this.chantierService.get(strat.idChantier);
        this.historiqueService.add(user.id, 'chantier', chantier.id,
            'Suppression de la ' + old.reference + ' de la stratégie ' + strat.reference + '\n');
        return this.zoneInterventionService.remove(zoneInterventionId);
    }

    private async updateEchantillonnages(zone: ZoneIntervention) {
        const listeEch = await this.echantillonnageService.getAll(zone.id, '');

        for (const ech of listeEch) {
            ech.nbMesures = this.echantillonnageService.getNbPrelevements(ech.objectif, zone);
            await this.echantillonnageService.update(ech);
        }

        zone.nbPrelevementsARealiser = await this.zoneInterventionService.calculPrelevementsARealiser(zone.id);
        zone.nbPrelevementsCalcul = await this.zoneInterventionService.calculPrelevements(zone.id);

        return zone;
    }
}
