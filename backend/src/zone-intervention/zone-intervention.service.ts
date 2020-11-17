import { Injectable, Inject } from '@nestjs/common';
import { FindManyOptions, Repository, UpdateResult, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { Log } from '../logger/logger';
import { ZoneIntervention } from './zone-intervention.entity';
import { IZoneIntervention, EnumTypeZoneIntervention, EnumTypeLocal, EnumTypeMesure, EnumMomentObjectifs } from '@aleaac/shared';
import { QueryService } from '../query/query.service';
import { EchantillonnageService } from '../echantillonnage/echantillonnage.service';
import { Echantillonnage } from '../echantillonnage/echantillonnage.entity';
import { LocalUnitaire } from '../local-unitaire/local-unitaire.entity';
import { MateriauZone } from '../materiau-zone/materiau-zone.entity';
import { ProcessusZone } from '../processus-zone/processus-zone.entity';
import { Objectif } from '../objectif/objectif.entity';
import { Strategie } from '../strategie/strategie.entity';
import { StrategieService } from '../strategie/strategie.service';
import { ObjectifService } from '../objectif/objectif.service';

@Injectable()
export class ZoneInterventionService {
    constructor(
        @InjectRepository(ZoneIntervention) private readonly zoneInterventionRepository: Repository<ZoneIntervention>,
        @InjectRepository(LocalUnitaire) private readonly localUnitaireRepository: Repository<LocalUnitaire>,
        @InjectRepository(Echantillonnage) private readonly echantillonnageRepository: Repository<Echantillonnage>,
        @InjectRepository(MateriauZone) private readonly materiauZoneRepository: Repository<MateriauZone>,
        private readonly strategieService: StrategieService,
        private readonly objectifService: ObjectifService,
        private readonly echantillonnageService: EchantillonnageService,
        private readonly queryService: QueryService,
    ) { }

    // Create
    // Precondition: the zoneIntervention needs to have a unique nom
    async create(zoneInterventionDto: IZoneIntervention): Promise<ZoneIntervention> {
        const savedZoneIntervention = await this.zoneInterventionRepository.save(zoneInterventionDto);
        return savedZoneIntervention;
    }

    // Read
    async find(findOptions?: FindManyOptions<ZoneIntervention>): Promise<ZoneIntervention[]> {
        const options = {
            take: 100,
            skip: 0,
            ...findOptions // overwrite default ones
        };
        // this.log.debug(`searching for max ${options.take} zoneInterventions with an offset of ${options.skip} ...`);
        return await this.zoneInterventionRepository.find(options);
    }

    async findByStrategie(idStrategie: number, inQuery: string): Promise<ZoneIntervention[]> {
        let query = this.zoneInterventionRepository.createQueryBuilder('zoneIntervention')
            .leftJoinAndSelect('zoneIntervention.batiment', 'batiment')
            .leftJoinAndSelect('zoneIntervention.horaires', 'horaires')
            .leftJoinAndSelect('zoneIntervention.locaux', 'locaux')
            .leftJoinAndSelect('zoneIntervention.materiauxZone', 'materiauxZone')
            .leftJoinAndSelect('zoneIntervention.processusZone', 'processusZone')
            .leftJoinAndSelect('zoneIntervention.echantillonnages', 'echantillonnages')
            .leftJoinAndSelect('zoneIntervention.environnements', 'environnements')
            .leftJoinAndSelect('processusZone.listeGES', 'listeGES')
            .where('zoneIntervention.idStrategie = :idStrategie', { idStrategie: idStrategie });
        query = this.queryService.parseQuery(query, inQuery);
        return await query.getMany();
    }

    async findOneById(id: number, options: FindOneOptions = {}): Promise<ZoneIntervention> {
        // this.log.debug('trying to find one zoneIntervention by id...');
        return await this.zoneInterventionRepository.findOne({
            id: id
        }, options);
        // return await this.zoneInterventionRepository.findOne({
        //     id: id
        // }, {
        //     relations: ['processusZone']
        // });
    }

    // Update
    async update(id: number, partialEntry: DeepPartial<ZoneIntervention>): Promise<ZoneIntervention> {
        // this.log.debug('trying to update zoneIntervention...');
        const toto = partialEntry as any;
        delete toto.zoneInterventionId;

        return await this.zoneInterventionRepository.save(toto);
    }

    async updatePartial(id: number, partialEntry: DeepPartial<ZoneIntervention>) {
        // this.log.debug('trying to update zoneIntervention...');
        const toto = partialEntry as any;
        delete toto.zoneInterventionId;
        delete toto.processusZone;
        delete toto.materiauxZone;
        delete toto.listeGES;

        return await this.zoneInterventionRepository.save(toto);
    }

    // Delete
    async remove(id: number): Promise<ZoneIntervention> {
        // this.log.debug('trying to remove zoneIntervention...');
        return await this.zoneInterventionRepository.remove(await this.findOneById(id));
    }

    async duplicate(zoneToDuplicate: ZoneIntervention, strategieDestination: number = -1) {
        const nouvelleZone = new ZoneIntervention();
        // Pas PIC ni batiment, on mettra les ID
        nouvelleZone.commentaire = zoneToDuplicate.commentaire;
        nouvelleZone.commentaireDifferenceNbPrelevements = zoneToDuplicate.commentaireDifferenceNbPrelevements;
        nouvelleZone.commentaireExpositionAirChocs = zoneToDuplicate.commentaireExpositionAirChocs;
        nouvelleZone.commentaireOccupation = zoneToDuplicate.commentaireOccupation;
        nouvelleZone.conditions = zoneToDuplicate.conditions;
        nouvelleZone.confinement = zoneToDuplicate.confinement;
        nouvelleZone.densiteOccupationTheorique = zoneToDuplicate.densiteOccupationTheorique;
        nouvelleZone.descriptif = zoneToDuplicate.descriptif;
        nouvelleZone.dureeMinPrelevement = zoneToDuplicate.dureeMinPrelevement;
        nouvelleZone.dureeTraitementEnSemaines = zoneToDuplicate.dureeTraitementEnSemaines;
        //nouvelleZone.echantillonnages = zoneToDuplicate.echantillonnages; // On fera un nouvel echantillonnage
        nouvelleZone.environnements = zoneToDuplicate.environnements;
        nouvelleZone.expositionAir = zoneToDuplicate.expositionAir;
        nouvelleZone.expositionChocs = zoneToDuplicate.expositionChocs;
        nouvelleZone.horaires = zoneToDuplicate.horaires;
        nouvelleZone.idBatiment = zoneToDuplicate.idBatiment;
        nouvelleZone.idPIC = zoneToDuplicate.idPIC;
        nouvelleZone.idStrategie = strategieDestination > 0 ? strategieDestination : zoneToDuplicate.idStrategie;
        nouvelleZone.isExterieur = zoneToDuplicate.isExterieur;
        nouvelleZone.isSousAccreditation = zoneToDuplicate.isSousAccreditation;
        nouvelleZone.isZoneDefinieAlea = zoneToDuplicate.isZoneDefinieAlea;
        nouvelleZone.isZoneInf10 = zoneToDuplicate.isZoneInf10;
        nouvelleZone.libelle = zoneToDuplicate.libelle;
        nouvelleZone.locaux = new Array<LocalUnitaire>(); // cf. plus bas
        nouvelleZone.materiauxZone = new Array<MateriauZone>(); // cf. plus bas
        nouvelleZone.milieu = zoneToDuplicate.milieu;
        nouvelleZone.nbGrpExtracteurs = zoneToDuplicate.nbGrpExtracteurs;
        nouvelleZone.nbPiecesUnitaires = zoneToDuplicate.nbPiecesUnitaires;
        nouvelleZone.precisionsRepartition = zoneToDuplicate.precisionsRepartition;
        // Pour l'instant pas besoin de dupliquer les ProcessusZone (si on doit le faire un jour /!\ listeGES)
        nouvelleZone.processusZone = new Array<ProcessusZone>();
        nouvelleZone.reference = zoneToDuplicate.reference;
        nouvelleZone.repartition = zoneToDuplicate.repartition;
        nouvelleZone.sequencage = zoneToDuplicate.sequencage;
        nouvelleZone.stationMeteo = zoneToDuplicate.stationMeteo;
        nouvelleZone.statut = zoneToDuplicate.statut;
        // pas strategie car idStrategieDejà fait
        nouvelleZone.type = zoneToDuplicate.type;
        nouvelleZone.typeActivite = zoneToDuplicate.typeActivite;
        delete nouvelleZone.zoneInterventionId;

        const res = await this.zoneInterventionRepository.save(nouvelleZone);

        // LOCAUX UNITAIRES
        const mapParentIds: Map<Number, number> = new Map<Number, number>();
        // On parcourt une fois pour avoir les anciens id de locaux parents
        if (zoneToDuplicate.locaux) {
            for (const local of zoneToDuplicate.locaux) {
                if (local.idParent) {
                    mapParentIds.set(local.idParent, 0);
                }
            }

            for (const local of zoneToDuplicate.locaux) {
                const nouveauLocal = { ...local };
                delete nouveauLocal.id;
                delete nouveauLocal.zoneIntervention;
                nouveauLocal.idZILocal = res.id;
                // On met les nouveaux liens par rapport à ceux existants
                // Comme on peut pas créer de locaux enfants avant le parent, normalement ils sont dans le bon ordre
                if (local.idParent) {
                    nouveauLocal.idParent = mapParentIds.get(local.idParent);
                }

                await this.localUnitaireRepository.save(nouveauLocal);

                // On fait la correspondance pour les nouveaux locaux parent
                // Si le local que l'on vient d'enregistrer correspond à un local parent dans la zone "source",
                // on crée la correspondance pour les prochains locaux (enfants) que l'on va créer
                if (mapParentIds.has(local.id)) {
                    mapParentIds.set(local.id, nouveauLocal.id);
                }
            }
        }

        // MATERIAUX ZONE
        if (zoneToDuplicate.materiauxZone) {
            for (const materiau of zoneToDuplicate.materiauxZone) {
                const nouveauMateriau = { ...materiau };
                delete nouveauMateriau.id;
                delete nouveauMateriau.zoneIntervention;
                nouveauMateriau.idZoneIntervention = res.id;

                await this.materiauZoneRepository.save(nouveauMateriau);
            }
        }

        // Echantillonnages
        const objectifs: Array<Objectif> = new Array<Objectif>();

        const strategie = await this.strategieService.get(nouvelleZone.idStrategie);
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
                tmpEch.typeMesure = obj.isMesureOperateur ? EnumTypeMesure.SUR_OPERATEUR : EnumTypeMesure.ENVIRONNEMENTALE;
                tmpEch.duree = obj.isMesureOperateur ? 4 : 24;
                tmpEch.dureeARealiser = tmpEch.duree;
                tmpEch.frequenceParSemaine = obj.momentObjectif.id === EnumMomentObjectifs.PENDANT_TRAVAUX_INTERV_LIES_AMIANTE.valueOf()
                    ? 1
                    : 0; // 0 = Oneshot
                tmpEch.isRealise = obj.isObligatoireCOFRAC;
                tmpEch.nbMesures = this.echantillonnageService.getNbPrelevements(obj, res);
                tmpEch.nbMesuresARealiser = tmpEch.nbMesures;

                this.echantillonnageService.create(tmpEch);
            }
        }

        return res;
    }

    async calculPU(idZone: number) {
        const zone = await this.zoneInterventionRepository.findOne(idZone);
        // console.log(zone)

        if (zone.isZoneInf10) {
            zone.nbPiecesUnitaires = 1;
            zone.nbPrelevementsCalcul = 0;
            await this.zoneInterventionRepository.save(zone);

            const echans: Echantillonnage[] = await this.echantillonnageRepository.find({
                where: {
                    idZIEch: idZone
                }
            });

            for (const ech of echans) {
                if (ech.isRealise) {
                    zone.nbPrelevementsCalcul += 1;
                }
                await this.echantillonnageRepository.save(ech);
            }

            await this.zoneInterventionRepository.save(zone);
            return zone.nbPiecesUnitaires;
        } else {
            zone.nbPiecesUnitaires = 0;
            zone.nbPrelevementsCalcul = 0;

            if (zone.type === EnumTypeZoneIntervention.ZH
                || zone.type === EnumTypeZoneIntervention.ZH) {

                const listeLocaux = await this.localUnitaireRepository.find({
                    where: {
                        idZILocal: idZone
                    }
                });

                console.log(listeLocaux);
                for (const local of listeLocaux) {
                    switch (local.type) {
                        case EnumTypeLocal.S_INF_EGAL_100M2_L_INF_EGAL_15M:
                            // Maintenant on ajoute chaque superficie à la main, on saisit pas un nombre
                            zone.nbPiecesUnitaires += 1; // 2 prélèvements par PU mais une seule PU
                            break;
                        case EnumTypeLocal.S_INF_EGAL_100M2_L_SUP_15M:
                            zone.nbPiecesUnitaires += Math.ceil(local.longueur / 15); // 1 PU par 15m arrondi au sup
                            break;
                        case EnumTypeLocal.S_SUP_100M2:
                            zone.nbPiecesUnitaires += Math.ceil((14 * local.surface) / (730 + local.surface)); // formule réglementaire
                            break;
                        case EnumTypeLocal.GROUPEMENT:
                            if (local.idParent === 0 || local.idParent === null) {
                                zone.nbPiecesUnitaires += 1; // On ajoute que le groupement parent pour le calcul des PU
                            }
                            break;
                        case EnumTypeLocal.CAGE_ESCALIER:
                            if (local.largeur * local.longueur * local.nbNiveaux > 100) {
                                zone.nbPiecesUnitaires += Math.ceil((14 * local.surface) / (730 + local.surface)); // formule réglementaire
                            } else {
                                if (local.largeur > 15 || local.longueur > 15) {
                                    zone.nbPiecesUnitaires +=
                                        Math.ceil(Math.max(local.longueur, local.largeur) / 15); // 1 PU par 15m arrondi au sup
                                } else {
                                    zone.nbPiecesUnitaires += 1;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }

                await this.zoneInterventionRepository.save(zone);

                const echans: Echantillonnage[] = await this.echantillonnageRepository.find({
                    where: {
                        idZIEch: idZone
                    }
                });

                for (const ech of echans) {
                    ech.nbMesures = this.echantillonnageService.getNbPrelevements(ech.objectif, zone);

                    if (ech.isRealise) {
                        zone.nbPrelevementsCalcul += ech.nbMesures;
                    }
                    await this.echantillonnageRepository.save(ech);
                }

                await this.zoneInterventionRepository.save(zone);
                return zone.nbPiecesUnitaires;
            } else {
                return 0;
            }
        }
    }

    async calculPUFromZone(zone: ZoneIntervention) {
        // console.log(zone)

        if (zone.isZoneInf10) {
            zone.nbPiecesUnitaires = 1;
            zone.nbPrelevementsCalcul = 0;
            await this.zoneInterventionRepository.save(zone);

            const optionEchan: FindManyOptions<Echantillonnage> = {
                where: {
                    idZIEch: zone.id
                }
            }
            const echans: Echantillonnage[] = await this.echantillonnageRepository.find(optionEchan);

            for (const ech of echans) {
                if (ech.isRealise) {
                    zone.nbPrelevementsCalcul += 1;
                }
                await this.echantillonnageRepository.save(ech);
            }

            await this.zoneInterventionRepository.save(zone);
            return zone.nbPiecesUnitaires;
        } else {
            zone.nbPiecesUnitaires = 0;
            zone.nbPrelevementsCalcul = 0;

            if (zone.type === EnumTypeZoneIntervention.ZH
                || zone.type === EnumTypeZoneIntervention.ZH) {

                const optionLoc: FindManyOptions<LocalUnitaire> = {
                    where: {
                        idZILocal: zone.id
                    }
                }
                const listeLocaux = await this.localUnitaireRepository.find(optionLoc);

                console.log(listeLocaux);
                for (const local of listeLocaux) {
                    switch (local.type) {
                        case EnumTypeLocal.S_INF_EGAL_100M2_L_INF_EGAL_15M:
                            // Maintenant on ajoute chaque superficie à la main, on saisit pas un nombre
                            zone.nbPiecesUnitaires += 1; // 2 prélèvements par PU mais une seule PU
                            break;
                        case EnumTypeLocal.S_INF_EGAL_100M2_L_SUP_15M:
                            zone.nbPiecesUnitaires += Math.ceil(local.longueur / 15); // 1 PU par 15m arrondi au sup
                            break;
                        case EnumTypeLocal.S_SUP_100M2:
                            zone.nbPiecesUnitaires += Math.ceil((14 * local.surface) / (730 + local.surface)); // formule réglementaire
                            break;
                        case EnumTypeLocal.GROUPEMENT:
                            if (local.idParent === 0 || local.idParent === null) {
                                zone.nbPiecesUnitaires += 1; // On ajoute que le groupement parent pour le calcul des PU
                            }
                            break;
                        case EnumTypeLocal.CAGE_ESCALIER:
                            if (local.largeur * local.longueur * local.nbNiveaux > 100) {
                                zone.nbPiecesUnitaires += Math.ceil((14 * local.surface) / (730 + local.surface)); // formule réglementaire
                            } else {
                                if (local.largeur > 15 || local.longueur > 15) {
                                    zone.nbPiecesUnitaires +=
                                        Math.ceil(Math.max(local.longueur, local.largeur) / 15); // 1 PU par 15m arrondi au sup
                                } else {
                                    zone.nbPiecesUnitaires += 1;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }

                await this.zoneInterventionRepository.save(zone);

                const optionEchan: FindManyOptions<Echantillonnage> = {
                    where: {
                        idZIEch: zone.id
                    }
                }
                const echans: Echantillonnage[] = await this.echantillonnageRepository.find(optionEchan);

                for (const ech of echans) {
                    ech.nbMesures = this.echantillonnageService.getNbPrelevements(ech.objectif, zone);

                    if (ech.isRealise) {
                        zone.nbPrelevementsCalcul += ech.nbMesures;
                    }
                    await this.echantillonnageRepository.save(ech);
                }

                await this.zoneInterventionRepository.save(zone);
                return zone.nbPiecesUnitaires;
            } else {
                return 0;
            }
        }
    }

    async calculPrelevements(idZone: number) {
        const zone = await this.findOneById(idZone);
        const echantillonnages = await this.echantillonnageService.getAll(zone.id, null);
        zone.nbPrelevementsCalcul = 0;
        for (const ech of echantillonnages) {
            if (ech.isRealise) {
                zone.nbPrelevementsCalcul += ech.nbMesures;
            }
        }
        return zone.nbPrelevementsCalcul;
    }

    async calculPrelevementsARealiser(idZone: number) {
        const zone = await this.findOneById(idZone);
        const echantillonnages = await this.echantillonnageService.getAll(zone.id, null);
        zone.nbPrelevementsARealiser = 0;
        for (const ech of echantillonnages) {
            if (ech.isRealise) {
                zone.nbPrelevementsARealiser += ech.nbMesuresARealiser;
            }
        }
        return zone.nbPrelevementsARealiser;
    }
}
