import {Component, Input, OnInit} from '@angular/core';
import {Intervention} from '../Intervention';
import {EnumStatutIntervention, EnumTypePompe, EnumTypePrelevement} from '@aleaac/shared';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RessourceHumaine} from '../../logistique/RessourceHumaine';
import {InterventionService} from '../intervention.service';
import {ValidationService} from '../../resource/validation/validation.service';
import {NotificationService} from '../../notification/notification.service';
import {Router} from '@angular/router';
import {PompeService} from '../../logistique/pompe.service';
import {FiltreService} from '../../logistique/filtre.service';
import {format} from 'date-fns';
import {RendezVousRessourceHumaine} from '../../logistique/RendezVousRessourceHumaine';
import {RendezVousPompe} from '../../logistique/RendezVousPompe';
import {RessourceHumaineService} from '../../logistique/ressource-humaine.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';


@Component({
    selector: 'app-preparation-intervention',
    templateUrl: './preparation-intervention.component.html',
    styleUrls: ['./preparation-intervention.component.scss']
})
export class PreparationInterventionComponent implements OnInit {
    @Input() intervention: Intervention;
    @Input() redirectPath: (string | number)[];
    stockPompeEnvi: number;
    stockPompeMeta: number;
    stockFiltreEnvi: number;
    stockFiltreMeta: number;
    interventionsPompe: Intervention[];
    enumStatutIntervention = EnumStatutIntervention;
    modalRessourceHumaine = false;
    submited: boolean = false;
    champsInformations: Map<string, string> = new Map<string, string>([]);
    enumTypePompe = EnumTypePompe;
    enumTypePrelevement = EnumTypePrelevement;
    isEditable: boolean = true;

    interventionForm = this.formBuilder.group({
        id: [''],
        idBureau: [''],
        libelle: [''],
        rang: [''],
        commentaire: [''],
        idStatut: [''],
        idDevisCommande: [''],
        dateValidation: [''],
        idFranchise: [''],
        idStrategie: [''],
        nbFiltreMeta: [''],
        nbFiltreEnvi: [''],
        nbPompeMeta: [''],
        nbPompeEnvi: [''],
        rendezVous: this.formBuilder.group({
            id: [''],
            dateHeureDebut: [''],
            rendezVousRessourceHumaines: this.formBuilder.array([]),
            dateHeureFin: [''],
            isDefinitif: ['']
        })
    });

    constructor(
        private formBuilder: FormBuilder,
        private interventionService: InterventionService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router,
        private pompeService: PompeService,
        private filtreService: FiltreService,
        private ressourceHumaineService: RessourceHumaineService
    ) {
    }

    ngOnInit() {
        if (this.intervention.idStatut === this.enumStatutIntervention.TERMINE) {
            this.isEditable = false;
        }
        this.interventionForm.patchValue(this.intervention);
        // calcul des filtre et des pompe si ils sont tous à 0
        if (this.intervention.nbPompeMeta === 0 && this.intervention.nbPompeEnvi === 0 &&
            this.intervention.nbFiltreEnvi === 0 && this.intervention.nbFiltreMeta === 0) {
            this.calculFiltrePompe();
        }
        for (const rendezVousRessourceHumaine of this.intervention.rendezVous.rendezVousRessourceHumaines) {
            this.addRendezVousRessourceHumaine(rendezVousRessourceHumaine);
        }

        // CALCUL STOCK POMPE
        // recupération des intervention dans l'interval pour le bureau
        this.interventionService.getInInterval(
            this.intervention.idBureau,
            format(this.intervention.rendezVous.dateHeureDebut, 'YYYY-MM-DD HH:mm:ss'),
            format(this.intervention.rendezVous.dateHeureFin, 'YYYY-MM-DD HH:mm:ss')
        ).subscribe((interventions) => {
            this.interventionsPompe = interventions;
            const queryBuild = new QueryBuild();
            queryBuild.dd = format(this.intervention.rendezVous.dateHeureDebut, 'YYYY-MM-DD HH:mm:ss');
            queryBuild.df = format(this.intervention.rendezVous.dateHeureFin, 'YYYY-MM-DD HH:mm:ss');
            // calcul stock pompe
            this.pompeService.getStock(this.intervention.idBureau, queryBuild).subscribe((stock) => {

                const stockPompeEnvi = stock.find((s) => s.idTypePompe === this.enumTypePompe.ENVIRONNEMENTALE);
                if (stockPompeEnvi) {
                    this.stockPompeEnvi = stockPompeEnvi.stock;
                } else {
                    this.stockPompeEnvi = 0;
                }

                const stockPompeMeta =  stock.find((s) => s.idTypePompe === this.enumTypePompe.INDIVIDUELLE);
                if (stockPompeMeta) {
                    this.stockPompeMeta = stockPompeMeta.stock;
                } else {
                    this.stockPompeMeta = 0;
                }

                for (const intervention of interventions) {
                    if (intervention.id !== this.intervention.id) {
                        this.stockPompeEnvi -= intervention.nbPompeEnvi;
                        this.stockPompeMeta -= intervention.nbPompeMeta;
                    }
                }
            });
        });

        // CALCUL STOCK FILTRE
        this.interventionService.getAllValide(this.intervention.idBureau).subscribe((interventions) => {
            this.filtreService.getStock(this.intervention.idFranchise).subscribe((stock) => {
                const stockFiltreEnvi = stock.find((s) => s.idBureau === this.intervention.idBureau && s.idTypeFiltre === this.enumTypePompe.ENVIRONNEMENTALE);
                if (stockFiltreEnvi) {
                    this.stockFiltreEnvi = stockFiltreEnvi.count;
                } else {
                    this.stockFiltreEnvi = 0;
                }

                const stockFiltreMeta = stock.find((s) => s.idBureau === this.intervention.idBureau && s.idTypeFiltre === this.enumTypePompe.INDIVIDUELLE);
                if (stockFiltreMeta) {
                    this.stockFiltreMeta = stockFiltreMeta.count;
                } else {
                    this.stockFiltreMeta = 0;
                }

                for (const intervention of interventions) {
                    if (intervention.id !== this.intervention.id) {
                        this.stockFiltreEnvi -= intervention.nbFiltreEnvi;
                        this.stockFiltreMeta -= intervention.nbFiltreMeta;
                    }
                }
            });
        });
    }

    getInterventionPompeEnvi() {
        return this.interventionsPompe.filter((intervention) => {
            return intervention.nbPompeEnvi > 0;
        });
    }

    getInterventionPompeMeta() {
        return this.interventionsPompe.filter((intervention) => {
            return intervention.nbPompeMeta > 0;
        });
    }

    // RESSOURCE HUMAINE

    createRendezVousRessourceHumaine(rendezVousRessourceHumaine: RendezVousRessourceHumaine): FormGroup {
        const formGroup = this.formBuilder.group({
            id: [''],
            ressourceHumaine: this.formBuilder.group({
                id: [''],
                utilisateur: this.formBuilder.group({
                    id: [''],
                    nom: [''],
                    prenom: ['']
                })
            })
        });
        formGroup.patchValue(rendezVousRessourceHumaine);
        return formGroup;
    }

    addRendezVousRessourceHumaine(rendezVousRessourceHumaine: RendezVousRessourceHumaine): void {
        const rendezVousRessourceHumaines = this.interventionForm.controls.rendezVous.get('rendezVousRessourceHumaines') as FormArray;
        rendezVousRessourceHumaines.push(this.createRendezVousRessourceHumaine(rendezVousRessourceHumaine));
        this.closeRessourceHumaineModal();
    }

    setRessourceHumaine(ressourceHumaine: RessourceHumaine): void {
        const rendezVousRessourceHumaine = new RendezVousRessourceHumaine();
        rendezVousRessourceHumaine.ressourceHumaine = ressourceHumaine;
        rendezVousRessourceHumaine.idRendezVous = this.interventionForm.get('rendezVous')!.get('id')!.value;
        this.ressourceHumaineService.addRendezVousRessourceHumaine(rendezVousRessourceHumaine).subscribe((newRendezVousRessourceHumaine) => {
            rendezVousRessourceHumaine.id = newRendezVousRessourceHumaine.id;
            this.addRendezVousRessourceHumaine(rendezVousRessourceHumaine);
        });
    }

    removePompe(rendezVousPompe: RendezVousPompe): void {
        const pompes = this.interventionForm.controls.rendezVous.get('rendezVousPompes') as FormArray;
        this.pompeService.removeRendezVousPompe(rendezVousPompe).subscribe(() => {
            pompes.removeAt(pompes.value.findIndex(findRendezVousPompe => findRendezVousPompe.id === rendezVousPompe.id));
        });
    }

    removeRendezVousRessourceHumaine(rendezVousRessourceHumaine: RendezVousRessourceHumaine): void {
        const rendezVousressourceHumaines = this.interventionForm.controls.rendezVous.get('rendezVousRessourceHumaines') as FormArray;
        this.ressourceHumaineService.removeRendezVousRessourceHumaine(rendezVousRessourceHumaine).subscribe(() => {
            rendezVousressourceHumaines.removeAt(rendezVousressourceHumaines.value.findIndex(findRendezVousPompe => findRendezVousPompe.id === rendezVousRessourceHumaine.id));
        });
    }

    calculFiltrePompe() {
        console.log(this.intervention);
        let filtreEnvi = 0;
        let filtreMeta = 0;
        let pompeEnvi = 0;
        let pompeMeta = 0;
        for (const prelevement of this.intervention.prelevements) {
            if (prelevement.idTypePrelevement === this.enumTypePrelevement.METAOP) {
                console.log('1');
                filtreMeta += prelevement.ges.nbFiltres;
                pompeMeta += prelevement.ges.nbPompes;
            } else {
                console.log('2');
                filtreEnvi += 1;
                pompeEnvi += 1;
            }
        }
        if (filtreEnvi > 0) {
            this.interventionForm.patchValue({
                nbFiltreEnvi: filtreEnvi + 1,
                nbPompeEnvi: pompeEnvi
            });
        } else {
            this.interventionForm.patchValue({
                nbFiltreEnvi: 0,
                nbPompeEnvi: 0
            });
        }
        if (filtreMeta > 0) {
            this.interventionForm.patchValue({
                nbFiltreMeta: filtreMeta + 1,
                nbPompeMeta: pompeMeta
            });
        } else {
            this.interventionForm.patchValue({
                nbFiltreMeta: 0,
                nbPompeMeta: 0
            });
        }
    }

    openModalRessourceHumaine() {
        this.modalRessourceHumaine = true;
    }

    closeRessourceHumaineModal() {
        this.modalRessourceHumaine = false;
    }

    async onSubmit({value, valid}: { value: Intervention, valid: boolean }) {
            await this.save(value);
            if (value.id) {
                this.notificationService.setNotification('success', ['Intervention mise à jour correctement.']);
                if (this.redirectPath) {
                    this.redirectPath.push('liste');
                    this.router.navigate(this.redirectPath);
                } else {
                    this.router.navigate(['/intervention']);
                }
            } else {
                this.notificationService.setNotification('success', ['Intervention créée correctement.']);
                if (this.redirectPath) {
                    this.redirectPath.push('liste');
                    this.router.navigate(this.redirectPath);
                } else {
                    this.router.navigate(['/intervention']);
                }
            }
    }

    async departTerrain({value, valid}: { value: Intervention, valid: boolean }) {
        if (value.rendezVous.rendezVousRessourceHumaines.length > 0 &&
            (value.nbPompeEnvi > 0 || value.nbPompeMeta > 0) &&
            (value.nbFiltreEnvi > 0 || value.nbFiltreMeta > 0)) {
            value.idStatut = this.enumStatutIntervention.DEPART_TERRAIN;
            const updateInter = await this.save(value);
            this.notificationService.setNotification('success', ['Mise à jour statut Intervention.']);
            if (this.redirectPath) {
                this.redirectPath.push(updateInter.id);
                this.redirectPath.push('depart-terrain');
                this.router.navigate(this.redirectPath);
            } else {
                this.router.navigate(['/intervention', updateInter.id, 'depart-terrain']);
            }
        } else {
            const erreur: string[] = [];
            if (value.rendezVous.rendezVousRessourceHumaines.length <= 0) {
                erreur.push('Il faut au moins un technicien pour valider la préparatio.');
            }
            if (value.nbPompeEnvi <= 0 && value.nbPompeMeta <= 0) {
                erreur.push('Il faut au moins une pompe pour valider la préparation.');
            }
            if (value.nbFiltreEnvi <= 0 && value.nbFiltreMeta <= 0) {
                erreur.push('Il faut au moins un filtre pour valider la préparation.');
            }
            this.notificationService.setNotification('danger', erreur);
        }
    }

    save(intervention: Intervention): Promise<Intervention> {
        return new Promise((resolve, reject) => {
            this.interventionService.update(intervention).subscribe((inter) => {
                resolve(inter);
            });
        });
    }
}
