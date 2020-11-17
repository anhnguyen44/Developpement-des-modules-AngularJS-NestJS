import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Intervention} from '../../Intervention';
import {
    EnumEPI,
    EnumRisqueNuisance,
    EnumStatutIntervention,
    EnumStatutPrelevement,
    EnumTypePrelevement
} from '@aleaac/shared';
import {Prelevement} from '../../../processus/Prelevement';
import {FiltreService} from '../../../logistique/filtre.service';
import {Filtre} from '../../../logistique/Filtre';
import {Pompe} from '../../../logistique/Pompe';
import {DebitmetreService} from '../../../logistique/debitmetre.service';
import {Debitmetre} from '../../../logistique/Debitmetre';
import {QueryBuild} from '../../../resource/query-builder/QueryBuild';
import {InterventionService} from '../../intervention.service';
import {NotificationService} from '../../../notification/notification.service';
import {format} from "date-fns";
import {service} from 'aws-sdk/clients/health';
import {Router} from '@angular/router';
import {PrelevementService} from '../../../prelevement/prelevement.service';
import {AffectationPrelevement} from '../../../prelevement/AffectationPrelevement';
import {AffectationPrelevementService} from '../../../prelevement/affectation-prelevement.service';
import {RessourceHumaine} from '../../../logistique/RessourceHumaine';


@Component({
    selector: 'app-page-retour-intervention',
    templateUrl: './page-retour-intervention.component.html',
    styleUrls: ['./page-retour-intervention.component.scss']
})
export class PageRetourInterventionComponent implements OnInit {
    @Input() intervention: Intervention;
    @Input() redirectPath: string[];
    enumTypePrelevement = EnumTypePrelevement;
    enumStatutIntervention = EnumStatutIntervention;
    enumStatutPrelevement = EnumStatutPrelevement;
    prelevement: Prelevement;
    momentPrelevement: string = 'avant';
    filtres: Filtre[];
    pompes: Pompe[] = [];
    techniciens: RessourceHumaine[] = [];
    isNonEffectue: boolean = false;
    debitmetres: Debitmetre[];
    isEditable: boolean = true;
    isGenerateAffectation: boolean = true;
    enumRisqueNuisance = EnumRisqueNuisance;
    enumEPI = EnumEPI;

    constructor(
        private filtreService: FiltreService,
        private debitmetreService: DebitmetreService,
        private interventionService: InterventionService,
        private notificationService: NotificationService,
        private router: Router,
        private prelevementService: PrelevementService,
        private affectationPrelevementService: AffectationPrelevementService
    ) {
    }

    ngOnInit() {
        if (this.intervention.idStatut === this.enumStatutIntervention.TERMINE) {
            this.isEditable = false;
        }
        for (const prelevement of this.intervention.prelevements) {
            this.checkSaisie(prelevement);
        }
        this.changePrelevement(this.intervention.prelevements[0]);
        this.parseDate(this.prelevement);
        this.filtreService.getNonAffecte(this.intervention.idBureau).subscribe((filtres) => {
            this.filtres = filtres;
        });
        const queryDebitmetre = new QueryBuild();
        this.debitmetreService.getAll(this.intervention.idFranchise, queryDebitmetre).subscribe((debitmetres) => {
            this.debitmetres = debitmetres;
        });
        for (const rdvPompe of this.intervention.rendezVous.rendezVousPompes) {
            this.pompes.push(rdvPompe.pompe);
        }
        for (const rdvRessourceHumaine of this.intervention.rendezVous.rendezVousRessourceHumaines) {
            this.techniciens.push(rdvRessourceHumaine.ressourceHumaine);
        }
    }

    changePrelevement(prelevement: Prelevement) {
        this.prelevement = prelevement;
        this.isGenerateAffectation = true;
        this.parseDate(prelevement);
        if (prelevement.idTypePrelevement === this.enumTypePrelevement.METAOP) {
            this.momentPrelevement = 'avant';
            if ((!this.prelevement.affectationsPrelevement || this.prelevement.affectationsPrelevement.length === 0) &&
                this.prelevement.idStatutPrelevement !== this.enumStatutPrelevement.NON_EFFECTUE) {
                console.log('change');
                this.prelevement.affectationsPrelevement = [];
                if (this.prelevement.ges) {
                    for (let i = 0; i < this.prelevement.ges.nbFiltres; i++) {
                        this.addAffectation();
                    }
                } else {
                    this.addAffectation();
                }
            }
        }
        if (prelevement.idStatutPrelevement === this.enumStatutPrelevement.NON_EFFECTUE) {
            this.isNonEffectue = true;
        } else {
            this.isNonEffectue = false;
        }
        this.isGenerateAffectation = false;

    }

    parseDate(prelevement: Prelevement) {
        for (const affectationPrelevement of prelevement.affectationsPrelevement) {
            if (affectationPrelevement.dateHeureDebut) {
                affectationPrelevement.dateDebut = format(affectationPrelevement.dateHeureDebut, 'YYYY-MM-DD');
                affectationPrelevement.heureDebut = format(affectationPrelevement.dateHeureDebut, 'HH:mm');
            }
            if (affectationPrelevement.dateHeureFin) {
                affectationPrelevement.dateFin = format(affectationPrelevement.dateHeureFin, 'YYYY-MM-DD');
                affectationPrelevement.heureFin = format(affectationPrelevement.dateHeureFin, 'HH:mm');
            }
        }
    }

    setIsNonEffectue(event) {
        if (event.target.checked) {
            if (window.confirm('Vous êtes sur le point de passer le prélèvement en non effectué, ceci va supprimer les info du prélèvement, voulez vous continuez')) {
                this.prelevement.idStatutPrelevement = this.enumStatutPrelevement.NON_EFFECTUE;
                this.prelevement.affectationsPrelevement = [];
                if (this.prelevement.idPrelevementMateriaux) {
                    this.prelevementService.delete(this.prelevement.idPrelevementMateriaux);
                    this.prelevement.idPrelevementMateriaux = null;
                }
                this.prelevement.isFicheExposition = false;
                this.isNonEffectue = true;
            } else {
                event.preventDefault();
            }
        } else {
            this.prelevement.idStatutPrelevement = this.enumStatutPrelevement.PLANIFIE;
            this.isNonEffectue = false;
        }
        this.checkSaisie(this.prelevement);
    }

    changeMomentPrelevement(moment: string) {
        this.momentPrelevement = moment;
    }

    getFiltresDispo(idTypePrelevement: number) {
        if (this.filtres) {
            return this.filtres.filter((filtre) => {
                return filtre.idTypeFiltre === idTypePrelevement;
            });
        }
    }

    getListePompe(idTypePrelevement: number) {
        return this.pompes.filter((pompe) => {
            return pompe.idTypePompe === idTypePrelevement;
        });
    }

    addAffectation() {
        const affectationPrelevement = new AffectationPrelevement();
        affectationPrelevement.idPrelevement = this.prelevement.id;
        this.affectationPrelevementService.create(affectationPrelevement).subscribe((affectation) => {
            this.prelevement.affectationsPrelevement.push(affectation);
        });
    }

    checkSaisie(prelevement: Prelevement, message: boolean = false) {
        prelevement.isSaisie = true;
        const erreurs: string[] = [];
        if (prelevement.idStatutPrelevement !== this.enumStatutPrelevement.NON_EFFECTUE) {
            // check pour les MEST
            if (prelevement.idTypePrelevement === this.enumTypePrelevement.MEST) {
                if (!prelevement.idPointPrelevementMEST) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir un point de prelevement pour chaque prelevement MEST');
                    }
                }
                if (!prelevement.referenceFlaconMEST) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir une référence flacon pour chaque prelevement MEST');
                    }
                }
            }

            // check pour les enviro
            if (prelevement.idTypePrelevement === this.enumTypePrelevement.ENVIRONNEMENTAL) {
                // filtre temoin
                if (!this.intervention.idFiltreTemoinPPF) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir un filtre temoin PPF');
                    }
                }

                // CONDITION INTERRIEUR
                if (prelevement.zoneIntervention.milieu === 0 || prelevement.zoneIntervention.milieu === 2) {
                    if (!prelevement.conditionHumiditeAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionTemperatureAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la température pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionPressionAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement interieur');
                        }
                    }
                }

                // CONDITION EXTERIEUR
                if (prelevement.zoneIntervention.milieu === 1 || prelevement.zoneIntervention.milieu === 2) {
                    if (!prelevement.pluieAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pluie pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.vistesseVentAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la vitesse du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.directionVentAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la direction du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.temperatureAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la temperature pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.humiditeAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.pressionAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement extérieur');
                        }
                    }
                }

                // AFFECTATION
                for (const affectation of prelevement.affectationsPrelevement) {
                    if (!affectation.idFiltre) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir un filtre pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.idPompe) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir une pompe pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.dateHeureFin) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir une date et une heure de fin pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.dateHeureDebut) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir une date et une heure de debut pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                }

                // check si depose
                if (prelevement.idStatutPrelevement === this.enumStatutPrelevement.POSE) {

                }
            }

            // check pour les META OP
            if (prelevement.idTypePrelevement === this.enumTypePrelevement.METAOP) {
                // filtre temoin
                if (!this.intervention.idFiltreTemoinPI) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir un filtre temoin PI');
                    }
                }
                // CONDITION INTERIEUR
                if (prelevement.zoneIntervention.milieu === 0 || prelevement.zoneIntervention.milieu === 2) {
                    if (!prelevement.conditionHumiditeAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionTemperatureAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la température pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionPressionAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionHumiditePendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionTemperaturePendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la température pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionPressionPendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement interieur');
                        }
                    }

                    if (!prelevement.conditionHumiditeApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionTemperatureApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la température pour chaque prelevement interieur');
                        }
                    }
                    if (!prelevement.conditionPressionApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement interieur');
                        }
                    }
                }

                // CONDITION EXTERIEUR
                if (prelevement.zoneIntervention.milieu === 1 || prelevement.zoneIntervention.milieu === 2) {
                    if (!prelevement.pluieAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pluie pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.vistesseVentAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la vitesse du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.directionVentAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la direction du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.temperatureAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la temperature pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.humiditeAvant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.pressionAvant) {
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement extérieur');
                        }
                        prelevement.isSaisie = false;
                    }
                    if (!prelevement.pluiePendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pluie pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.vistesseVentPendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la vitesse du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.directionVentPendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la direction du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.temperaturePendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la température pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.humiditePendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.pressionPendant) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement extérieur');
                        }
                    }

                    if (!prelevement.pluieApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pluie pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.vistesseVentApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la vitesse du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.directionVentApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la direction du vent pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.temperatureApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la température pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.humiditeApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir l\'humidité pour chaque prelevement extérieur');
                        }
                    }
                    if (!prelevement.pressionApres) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la pression pour chaque prelevement interieur');
                        }
                    }
                }

                // AFFECTATION
                for (const affectation of prelevement.affectationsPrelevement) {
                    if (!affectation.idFiltre) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir un filtre pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.idPompe) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir une pompe pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.dateHeureFin) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir une date et une heure de fin pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.dateHeureDebut) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir une date et une heure de debut pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.idOperateurChantier) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir un opérateur pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.idDebitmetre) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir un débitmetre pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.idPosition) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir la position de l\'opérateur pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.debitMoyenInitial) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir les débits initiaux pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                    if (!affectation.debitMoyenFinal) {
                        prelevement.isSaisie = false;
                        if (message) {
                            erreurs.push('Vous devez saisir les débit finaux pour chaque prelevement');
                        } else {
                            break;
                        }
                    }
                }
            }

            // check Pour les materiaux
            if (prelevement.idTypePrelevement === this.enumTypePrelevement.MATERIAUX) {

            }

            // check Fiche exposition

            for (const ficheExposition of prelevement.fichesExposition) {
                if (!ficheExposition.idRisqueNuisance) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir le Risque / Nuisance pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
                if (ficheExposition.idRisqueNuisance && ficheExposition.idRisqueNuisance == this.enumRisqueNuisance.AUTRE && !ficheExposition.autreRisqueNuisance) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir un autre risque nuisance pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
                if (!ficheExposition.idEPI) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir l\'EPI pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
                if (ficheExposition.idEPI && ficheExposition.idEPI == this.enumEPI.AUTRE && !ficheExposition.autreEPI) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir un autre EPI pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
                if (!ficheExposition.date) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir une date pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
                if (!ficheExposition.duree) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir une durée pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
                if (!ficheExposition.idRessourceHumaine) {
                    prelevement.isSaisie = false;
                    if (message) {
                        erreurs.push('Vous devez saisir un technicien pour toutes vos expositions');
                    } else {
                        break;
                    }
                }
            }
        }
        if (message && erreurs.length > 0) {
            this.notificationService.setNotification('alert', erreurs);
        }
        return erreurs;
    }

    save(isFinIntervention = false) {
        console.log(this.intervention);
        this.interventionService.update(this.intervention).subscribe(() => {
            if (isFinIntervention) {
                this.notificationService.setNotification('success', ['Intervention terminé']);
                this.router.navigate(['chantier', this.intervention.idChantier, 'prelevement', 'liste']);
            } else {
                this.notificationService.setNotification('success', ['Intervention mise à jour']);
            }

        });
    }

    terminerIntervention() {
        console.log(this.intervention);
        let isSavable = true;
        let erreurs: string[] = [];
        for (const prelevement of this.intervention.prelevements) {
            const erreurPrelevement = this.checkSaisie(prelevement, true);
            if (erreurPrelevement.length > 0) {
                isSavable = false;
                erreurs = erreurs.concat(erreurPrelevement);
            }
        }
        if (isSavable) {
            this.intervention.idStatut = this.enumStatutIntervention.TERMINE;
            for (const prelevement of this.intervention.prelevements) {
                if (prelevement.idTypePrelevement === this.enumTypePrelevement.ENVIRONNEMENTAL
                    && prelevement.idStatutPrelevement !== this.enumStatutPrelevement.PLANIFIE) {
                    prelevement.idStatutPrelevement = this.enumStatutPrelevement.POSE;
                } else if (prelevement.idStatutPrelevement !== this.enumStatutPrelevement.NON_EFFECTUE) {
                    prelevement.idStatutPrelevement = this.enumStatutPrelevement.PRELEVE;
                    if (prelevement.idPrelevementMateriaux) {
                        this.prelevementService.get(prelevement.idPrelevementMateriaux).subscribe((prelevementMat) => {
                            prelevementMat.idStatutPrelevement = this.enumStatutPrelevement.PRELEVE;
                            this.prelevementService.update((prelevementMat)).subscribe();
                        });
                    }
                }
            }
            this.save(true);
        } else {
            this.notificationService.setNotification('danger', erreurs.filter(this.onlyUnique));
        }
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

}
