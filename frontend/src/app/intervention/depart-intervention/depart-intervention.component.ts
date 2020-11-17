import {Component, Input, OnInit} from '@angular/core';
import {Intervention} from '../Intervention';
import {EnumStatutIntervention, EnumTypePompe} from '@aleaac/shared';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Pompe} from '../../logistique/Pompe';
import {NotificationService} from '../../notification/notification.service';
import {Router} from '@angular/router';
import {ValidationService} from '../../resource/validation/validation.service';
import {InterventionService} from '../intervention.service';
import {RendezVousPompe} from '../../logistique/RendezVousPompe';
import {PompeService} from '../../logistique/pompe.service';


@Component({
    selector: 'app-depart-intervention',
    templateUrl: './depart-intervention.component.html',
    styleUrls: ['./depart-intervention.component.scss']
})
export class DepartInterventionComponent implements OnInit {
    @Input() intervention: Intervention;
    @Input() redirectPath: (string | number)[];
    modalPompe: boolean = false;
    enumStatutIntervention = EnumStatutIntervention;
    enumTypePompe = EnumTypePompe;
    submited: boolean = false;
    champsInformations: Map<string, string> = new Map<string, string>([]);
    nbPrelevementZoneNonOccupeSansAir: number = 0;
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
            ressourceHumaines: this.formBuilder.array([]),
            rendezVousPompes: this.formBuilder.array([]),
            dateHeureFin: [''],
            isDefinitif: ['']
        })
    });

    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private router: Router,
        private validationService: ValidationService,
        private interventionService: InterventionService,
        private pompeService: PompeService
    ) {
    }

    ngOnInit() {
        if (this.intervention.idStatut === this.enumStatutIntervention.TERMINE) {
            this.isEditable = false;
        }
        if (this.intervention) {
            for (const prelevement of this.intervention.prelevements) {
                this.nbPrelevementZoneNonOccupeSansAir = 0;
                if (prelevement.zoneIntervention.conditions === 'airInsufisant' && (prelevement.zoneIntervention.statut === 1 || prelevement.zoneIntervention.statut === 3)) {
                    this.nbPrelevementZoneNonOccupeSansAir += 1;
                }
            }
        }
        this.interventionForm.patchValue(this.intervention);
        for (const pompe of this.intervention.rendezVous.rendezVousPompes) {
            console.log(pompe);
            this.addPompe(pompe);
        }
        console.log(this.interventionForm);
    }

    // POMPES

    createPompe(pompe: RendezVousPompe): FormGroup {
        const formGroup = this.formBuilder.group({
            id: [null],
            pompe: this.formBuilder.group({
                id: [''],
                ref: [''],
                idTypePompe: ['']
            })
        });
        formGroup.patchValue(pompe);
        return formGroup;
    }

    addPompe(pompe: RendezVousPompe): void {
        const pompes = this.interventionForm.controls.rendezVous.get('rendezVousPompes') as FormArray;
        pompes.push(this.createPompe(pompe));
        this.selectionPompe();
        this.closePompeModal();
    }

    setPompe(pompe: Pompe): void {
        const rendezVousPompe = new RendezVousPompe();
        rendezVousPompe.pompe = pompe;
        rendezVousPompe.idRendezVous = this.interventionForm.get('rendezVous')!.get('id')!.value;
        this.pompeService.addRendezVousPompe(rendezVousPompe).subscribe((newRendezVousPompe) => {
            rendezVousPompe.id = newRendezVousPompe.id;
            this.addPompe(rendezVousPompe);
        });
    }

    removePompe(rendezVousPompe: RendezVousPompe): void {
        const pompes = this.interventionForm.controls.rendezVous.get('rendezVousPompes') as FormArray;
        this.pompeService.removeRendezVousPompe(rendezVousPompe).subscribe(() => {
            pompes.removeAt(pompes.value.findIndex(findRendezVousPompe => findRendezVousPompe.id === rendezVousPompe.id));
        });
    }

    openModalPompe() {
        this.modalPompe = true;
    }

    closePompeModal() {
        this.modalPompe = false;
    }

    selectionPompe(): boolean {
        let nbPompeEnviSelect = 0;
        let nbPompeMetaSelect = 0;

        for (const rendezVousPompe of this.interventionForm.get('rendezVous')!.get('rendezVousPompes')!.value) {
            if (rendezVousPompe.pompe.idTypePompe === this.enumTypePompe.INDIVIDUELLE) {
                nbPompeMetaSelect++;
            }
            if (rendezVousPompe.pompe.idTypePompe === this.enumTypePompe.ENVIRONNEMENTALE) {
                nbPompeEnviSelect++;
            }
        }

        if (nbPompeEnviSelect >= this.interventionForm.get('nbPompeEnvi')!.value
            && nbPompeMetaSelect >= this.interventionForm.get('nbPompeMeta')!.value) {
            return false;
        } else {
            return true;
        }
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

    async retourTerrain({value, valid}: { value: Intervention, valid: boolean }) {
        if (this.selectionPompe()) {
            this.notificationService.setNotification('danger',
            ['Vous n\'avez pas selectionné suffisament de pompes par rapport à ce qui est défini dans la préparation.']);
        } else {
            value.idStatut = this.enumStatutIntervention.RETOUR_TERRAIN;
            const updateInter = await this.save(value);
            this.notificationService.setNotification('success', ['Mise à jour statut Intervention.']);
            if (this.redirectPath) {
                this.redirectPath.push(updateInter.id);
                this.redirectPath.push('retour-terrain');
                this.router.navigate(this.redirectPath);
            } else {
                this.router.navigate(['/intervention', updateInter.id, 'retour-terrain']);
            }
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
