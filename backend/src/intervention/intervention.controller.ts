import {Controller, Get, Param, Put, Req, UseInterceptors, Post, Body, Res} from '@nestjs/common';
import {LoggingInterceptor} from '../common/interceptors/logging.interceptor';
import {TransformInterceptor} from '../common/interceptors/transform.interceptor';
import {apiPath} from '../api';
import {ApiUseTags, ApiOperation} from '@nestjs/swagger';
import {InterventionService} from './intervention.service';
import {Authorized} from '../common/decorators/authorized.decorator';
import {Intervention} from './intervention.entity';
import * as dateFns from 'date-fns';
import {EnumStatutIntervention, EnumStatutPrelevement, EnumTypeFiltre, EnumTypePrelevement} from '@aleaac/shared';
import {GenerationService} from '../generation/generation.service';
import {FiltreService} from '../filtre/filtre.service';
import {HistoriqueService} from '../historique/historique.service';
import {format} from 'date-fns';


@ApiUseTags('intervention')
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
@Controller(apiPath(1, 'intervention'))

export class InterventionController {
    enumTypeFiltre = EnumTypeFiltre;
    enumTypePrelevement = EnumTypePrelevement;
    enumStatutIntervention = EnumStatutIntervention;
    enumStatutPrelevement = EnumStatutPrelevement;

    constructor(
        private interventionService: InterventionService,
        private generationService: GenerationService,
        private filtreService: FiltreService,
        private historiqueService: HistoriqueService
    ) {
    }

    @ApiOperation({title: 'Récuperation des interventions d\'une franchise'})
    @Get('getAll/:idFranchise')
    @Authorized()
    async getAll(@Param() params, @Req() req) {
        return await this.interventionService.getAll(params.idFranchise, req.query);
    }

    @ApiOperation({title: 'Récuperation des interventions d\'une franchise'})
    @Get('countAll/:idFranchise')
    @Authorized()
    async countAll(@Param() params, @Req() req) {
        return await this.interventionService.countAll(params.idFranchise, req.query);
    }

    @ApiOperation({title: 'get 1 intervention'})
    @Get(':idIntervention')
    @Authorized()
    async get(@Param() params) {
        return await this.interventionService.get(params.idIntervention);
    }

    @ApiOperation({title: 'update intervention'})
    @Put('')
    @Authorized()
    async update(@Body() requestBody: Intervention, @Req() req) {
        const oldIntervention = await this.interventionService.get(requestBody.id);
        const newIntervention = await this.interventionService.update(requestBody);

        // historiques
        let historique = '';

        // INFORMATION
        if (oldIntervention.idStatut !== requestBody.idStatut) {
            historique += 'Changement de statut : ' + this.enumStatutIntervention[oldIntervention.idStatut] + ' -> ' + this.enumStatutIntervention[requestBody.idStatut] + '\n';
        }

        if (oldIntervention.idBureau !== requestBody.idBureau) {
            historique += 'Changement de bureau : ' + oldIntervention.idBureau + ' -> ' + requestBody.idBureau + '\n';
        }

        if (oldIntervention.libelle !== requestBody.libelle) {
            historique += 'Changement de libelle : ' + oldIntervention.libelle + ' -> ' + requestBody.libelle + '\n';
        }

        if (requestBody.rendezVous && requestBody.rendezVous.dateHeureDebut) {
            if (format(oldIntervention.rendezVous.dateHeureDebut, 'DD-MM-YYYY à HH:mm') !== format(requestBody.rendezVous.dateHeureDebut, 'DD-MM-YYYY à HH:mm')) {
                historique += 'Changement de date de début : ' + format(oldIntervention.rendezVous.dateHeureDebut, 'DD-MM-YYYY à HH:mm') + ' -> ' + format(requestBody.rendezVous.dateHeureDebut, 'DD-MM-YYYY à HH:mm') + '\n';
            }
        }

        if (requestBody.rendezVous && requestBody.rendezVous.dateHeureFin) {
            if (format(oldIntervention.rendezVous.dateHeureFin, 'DD-MM-YYYY à HH:mm') !== format(requestBody.rendezVous.dateHeureFin, 'DD-MM-YYYY à HH:mm')) {
                historique += 'Changement de date de fin : ' + format(oldIntervention.rendezVous.dateHeureFin, 'DD-MM-YYYY à HH:mm') + ' -> ' + format(requestBody.rendezVous.dateHeureFin, 'DD-MM-YYYY à HH:mm') + '\n';
            }
        }

        if (requestBody.siteIntervention) {
            if (oldIntervention.idSiteIntervention !== requestBody.idSiteIntervention) {
                historique += 'Changement de site d\'intervention :' + oldIntervention.idSiteIntervention + ' -> ' + requestBody.idSiteIntervention + '\n';
            }
        }

        if (requestBody.prelevements) {
            if (oldIntervention.prelevements.length !== requestBody.prelevements.length) {
                // si ajout
                for (const prelevement of oldIntervention.prelevements) {
                    if (!requestBody.prelevements.find((findPrelevement) => findPrelevement.id === prelevement.id)) {
                        historique += 'Ajout du prélévement à l\'intervention id : ' + prelevement.id + ' ref : ' + prelevement.reference + '\n';
                    }
                }

                // si suppression
                for (const prelevement of requestBody.prelevements) {
                    if (!oldIntervention.prelevements.find((findPrelevement) => findPrelevement.id === prelevement.id)) {
                        historique += 'Suppression du prélévement de l\'intervention id : ' + prelevement.id + ' ref : ' + prelevement.reference + '\n';
                    }
                }
            }

            // RETOUR TERRAIN
            if (requestBody.prelevements && requestBody.prelevements.length > 0 && 'conditions' in requestBody.prelevements[0]) {
                for (const newPrelevement of requestBody.prelevements) {
                    const oldPrelevement = oldIntervention.prelevements.find((findPrelevement) => {
                        return findPrelevement.id === newPrelevement.id;
                    });
                    if (oldPrelevement && oldPrelevement.idStatutPrelevement !== newPrelevement.idStatutPrelevement) {
                        historique += 'Changement du statut du prelevement '
                            + newPrelevement.reference + ' ' + this.enumStatutPrelevement[oldPrelevement.idStatutPrelevement]
                            + ' -> ' + this.enumStatutPrelevement[newPrelevement.idStatutPrelevement] + '\n';
                    }
                    if (newPrelevement.affectationsPrelevement) {
                        for (const newAffectation of newPrelevement.affectationsPrelevement) {
                            const oldAffectation = oldPrelevement.affectationsPrelevement.find((findAffectation) => {
                                return findAffectation.id === newAffectation.id;
                            });
                            if (oldAffectation) {
                                if (oldAffectation.idPompe !== newAffectation.idPompe) {
                                    if (oldAffectation.idPompe) {
                                        historique += 'Modification de la pompe du prélévement ' + newPrelevement.reference + ' ' + oldAffectation.idPompe + ' -> ' + newAffectation.idPompe + '\n';
                                    } else {
                                        historique += 'Ajout de la pompe id :' + newAffectation.idPompe + ' au prélèvement ' + newPrelevement.reference + '\n';
                                    }
                                }
                                if (oldAffectation.idFiltre !== newAffectation.idFiltre) {
                                    if (oldAffectation.idFiltre) {
                                        historique += 'Modification du filtre du prélévement ' + newPrelevement.reference + ' ' + oldAffectation.idFiltre + ' -> ' + newAffectation.idFiltre + '\n';
                                    } else {
                                        historique += 'Ajout du filtre id :' + newAffectation.idFiltre + ' au prélèvement ' + newPrelevement.reference + '\n';
                                    }
                                }
                                if (format(oldAffectation.dateHeureDebut, 'DD-MM-YYYY à HH:mm') !== format(newAffectation.dateHeureDebut, 'DD-MM-YYYY à HH:mm')) {
                                    if (oldAffectation.dateHeureDebut) {
                                        historique += 'Modification de la date de debut du prélévement ' + newPrelevement.reference + ' ' + format(oldAffectation.dateHeureDebut, 'DD-MM-YYYY à HH:mm') + ' -> ' + format(newAffectation.dateHeureDebut, 'DD-MM-YYYY à HH:mm') + '\n';
                                    } else {
                                        historique += 'Ajout de la date de debut :' + format(newAffectation.dateHeureDebut, 'DD-MM-YYYY à HH:mm') + ' au prélèvement ' + newPrelevement.reference + '\n';
                                    }
                                }
                                if (format(oldAffectation.dateHeureFin, 'DD-MM-YYYY à HH:mm') !== format(newAffectation.dateHeureFin, 'DD-MM-YYYY à HH:mm')) {
                                    if (oldAffectation.dateHeureFin) {
                                        historique += 'Modification de la date de fin du prélévement ' + newPrelevement.reference + ' ' + format(oldAffectation.dateHeureFin, 'DD-MM-YYYY à HH:mm') + ' -> ' + format(newAffectation.dateHeureFin, 'DD-MM-YYYY à HH:mm') + '\n';
                                    } else {
                                        historique += 'Ajout de la date de fin :' + format(newAffectation.dateHeureFin, 'DD-MM-YYYY à HH:mm') + ' au prélèvement ' + newPrelevement.reference + '\n';
                                    }
                                }
                                if (oldAffectation.idOperateurChantier !== newAffectation.idOperateurChantier) {
                                    if (oldAffectation.idOperateurChantier) {
                                        historique += 'Modification de l\'opérateur chantier du prélévement ' + newPrelevement.reference + ' ' + oldAffectation.idOperateurChantier + ' -> ' + newAffectation.idOperateurChantier + '\n';
                                    } else {
                                        historique += 'Ajout de l\'operateur chantier id :' + newAffectation.idOperateurChantier + ' au prélèvement ' + newPrelevement.reference + '\n';
                                    }
                                }
                            } else {
                                historique += 'Suppression de l\'affectation prelevement id : ' + newAffectation.id + '\n'
                            }
                        }
                    }
                }
            }
        }

        // PREPARATION
        if (requestBody.rendezVous && requestBody.rendezVous.rendezVousRessourceHumaines) {
            if (oldIntervention.rendezVous.rendezVousRessourceHumaines.length !== requestBody.rendezVous.rendezVousRessourceHumaines.length) {
                // si ajout
                for (const rdvRh of oldIntervention.rendezVous.rendezVousRessourceHumaines) {
                    if (!requestBody.rendezVous.rendezVousRessourceHumaines.find((findRdvRh) => findRdvRh.id === rdvRh.id)) {
                        historique += 'Ajout de la ressource humaine à l\'intervention id : ' + rdvRh.ressourceHumaine.id + ' nom : ' + rdvRh.ressourceHumaine.utilisateur.nom + '\n';
                    }
                }
                // si suppression
                for (const rdvRh of requestBody.rendezVous.rendezVousRessourceHumaines) {
                    if (!oldIntervention.rendezVous.rendezVousRessourceHumaines.find((findRdvRh) => findRdvRh.id === rdvRh.id)) {
                        historique += 'Suppression de la ressource humaine de l\'intervention id : ' + rdvRh.ressourceHumaine.id + ' nom : ' + rdvRh.ressourceHumaine.utilisateur.nom + '\n';
                    }
                }
            }
        }

        if (requestBody.nbPompeMeta) {
            if (oldIntervention.nbPompeMeta !== requestBody.nbPompeMeta) {
                historique += 'Modification nombre pompes meta : ' + oldIntervention.nbPompeMeta + ' -> ' + requestBody.nbPompeMeta + '\n';
            }
        }

        if (requestBody.nbPompeEnvi) {
            if (oldIntervention.nbPompeEnvi !== requestBody.nbPompeEnvi) {
                historique += 'Modification nombre pompes envi : ' + oldIntervention.nbPompeEnvi + ' -> ' + requestBody.nbPompeEnvi + '\n';
            }
        }

        if (requestBody.nbFiltreMeta) {
            if (oldIntervention.nbFiltreMeta !== requestBody.nbFiltreMeta) {
                historique += 'Modification nombre filtres meta : ' + oldIntervention.nbFiltreMeta + ' -> ' + requestBody.nbFiltreMeta + '\n';
            }
        }

        if (requestBody.nbFiltreEnvi) {
            if (oldIntervention.nbFiltreEnvi !== requestBody.nbFiltreEnvi) {
                historique += 'Modification nombre filtres envi : ' + oldIntervention.nbFiltreEnvi + ' -> ' + requestBody.nbFiltreEnvi + '\n';
            }
        }

        // DEPART TERRAIN
        if (requestBody.rendezVous && requestBody.rendezVous.rendezVousPompes) {
            if (oldIntervention.rendezVous.rendezVousPompes.length !== requestBody.rendezVous.rendezVousPompes.length) {
                // si ajout
                for (const rendezVousPompe of oldIntervention.rendezVous.rendezVousPompes) {
                    if (!requestBody.rendezVous.rendezVousPompes.find((findRendezVousPompe) => findRendezVousPompe.id === rendezVousPompe.id)) {
                        historique += 'Ajout de la pompe à l\'intervention id : ' + rendezVousPompe.pompe.id + ' nom : ' + rendezVousPompe.pompe.ref + '\n';
                    }
                }
                // si suppression
                for (const rendezVousPompe of requestBody.rendezVous.rendezVousPompes) {
                    if (!oldIntervention.rendezVous.rendezVousPompes.find((findRendezVousPompe) => findRendezVousPompe.id === rendezVousPompe.id)) {
                        historique += 'Suppression de la pompe de l\'intervention id : ' + rendezVousPompe.pompe.id + ' nom : ' + rendezVousPompe.pompe.ref + '\n';
                    }
                }
            }
        }

        // RETOUR TERRAIN
        if (historique) {
            this.historiqueService.add(req.user.id, 'intervention', requestBody.id, 'Modification intervention : \n' + historique);

            if (requestBody.idChantier) {
                this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier, 'Modification intervention : \n' + historique);
            }
        }

        return newIntervention;
    }

    @ApiOperation({title: 'create intervention'})
    @Post('')
    @Authorized()
    async create(@Body() requestBody: Intervention, @Req() req) {
        const intervention = await this.interventionService.create(requestBody);
        this.historiqueService.add(req.user.id, 'intervention', intervention.id, 'Création intervention');
        if (requestBody.idChantier) {
            this.historiqueService.add(req.user.id, 'chantier', requestBody.idChantier, 'Création intervention ' + intervention.id);
        }
        return intervention;
    }

    @ApiOperation({title: 'get in interveal'})
    @Get('getInInterval/:idBureau/:dd/:df')
    @Authorized()
    async getInInterval(@Param() params) {
        return await this.interventionService.getInInterval(params.idBureau, params.dd, params.df);
    }

    @ApiOperation({title: 'get in interveal avec tout les statut'})
    @Get('getInIntervalAllStatut/:idBureau/:dd/:df')
    @Authorized()
    async getInIntervalAllStatut(@Param() params) {
        return await this.interventionService.getInIntervalAllStatut(params.idBureau, params.dd, params.df);
    }

    @ApiOperation({title: 'get tout les valide non terminé pour un bureau'})
    @Get('getAllValide/:idBureau')
    @Authorized()
    async getAllValide(@Param() params) {
        return await this.interventionService.getAllValide(params.idBureau);
    }

    @ApiOperation({title: 'get intervention avec rdv definitif qui ne sont pas termine'})
    @Get('getDefinitifNonTermine/:idFranchise')
    @Authorized()
    async getDefinitifNonTermine(@Param() params) {
        return await this.interventionService.getDefinitifNonTermine(params.idFranchise);
    }

    @ApiOperation({title: 'generateOI'})
    @Get('generateOI/:idIntervention')
    @Authorized()
    async generateOI(@Param() params, @Req() req) {
        const intervention: any = await this.interventionService.getForGenerate(params.idIntervention);
        const prelevements: any[] = intervention.prelevements;

        // parse le type de prelevement
        prelevements.map((prelevement) => {
            prelevement.typePompe = this.enumTypePrelevement[prelevement.idTypePrelevement]
        });

        // tri des prelevement par objectif
        intervention.objectifs = [];
        for (const prelevement of intervention.prelevements) {
            const findedObjectif = intervention.objectifs.find((objectif) => {
                return objectif.objectif.id === prelevement.objectif.id
            });
            if (findedObjectif) {
                findedObjectif.prelevements.push(prelevement);
            } else {
                intervention.objectifs.push({objectif: prelevement.objectif, prelevements: [prelevement]})
            }
        }

        intervention.objectifs.sort( this.compareObjectif );

        const chantier = intervention.chantier;
        const client = chantier.client;
        const compte = client.compteContacts.compte;

        // console.log(chantier.bureau);

        intervention.dateDebutParse = dateFns.format(intervention.rendezVous.dateHeureDebut, 'DD/MM/YYYY à hh:mm');
        intervention.dateFinParse = dateFns.format(intervention.rendezVous.dateHeureFin, 'DD/MM/YYYY à hh:mm');

        const data: any = {
            interventions: [intervention],
            client: client,
            compte: compte,
            chantier: chantier,
            bureau: chantier.bureau,
            dateGeneration: dateFns.format(new Date(), 'DD/MM/YYYY')
        };

        const file = await this.generationService.generateDocx(
            data,
            'ordreIntervention.docx',
            'chantier',
            chantier.id,
            req.user.id,
            'ordre-intervention-' + params.idIntervention,
            req.user,
            true,
            23
            );

        intervention.idOrdreIntervention = file.id;
        intervention.ordreIntervention = file;

        if (chantier) {
            this.historiqueService.add(req.user.id, 'chantier', chantier.id, 'Création de l\'ordre d\'intervention.');
        }

        return await this.interventionService.update(intervention)
    }

    compareObjectif( a, b ) {
        if ( a.objectif.id < b.objectif.id ) {
            return -1;
        }
        if (a.objectif.id > b.objectif.id ) {
            return 1;
        }
        return 0;
    }
}
