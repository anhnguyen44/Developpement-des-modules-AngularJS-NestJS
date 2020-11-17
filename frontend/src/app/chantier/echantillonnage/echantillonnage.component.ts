import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Echantillonnage, Franchise, Chantier, ITacheProcessus, EnumSousSectionStrategie, Liste } from '@aleaac/shared';
import { ValidationService } from '../../resource/validation/validation.service';
import { NotificationService } from '../../notification/notification.service';
import { ChantierService } from '../chantier.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { EchantillonnageService } from '../../resource/echantillonnage/echantillonnage.service';
import { Strategie } from '@aleaac/shared';
import { ZoneIntervention } from '@aleaac/shared';
import { StrategieService } from '../../resource/strategie/strategie.service';
import { ZoneInterventionService } from '../../resource/zone-intervention/zone-intervention.service';
import { Objectif } from '@aleaac/shared';
import { NEVER } from 'rxjs';
import { ListeService } from '../../resource/liste/liste.service';

@Component({
    selector: 'app-echantillonnage',
    templateUrl: './echantillonnage.component.html',
    styleUrls: ['./echantillonnage.component.scss']
})
export class EchantillonnageComponent implements OnInit {
    @Input() echantillonnages: Echantillonnage[];
    @Input() franchise: Franchise;
    @Input() chantier: Chantier;
    @Input() strategie: Strategie;
    @Input() zoneIntervention: ZoneIntervention;
    @Input() canEdit: boolean = true;

    @Output() emitListeEchantillonnage: EventEmitter<Echantillonnage[]> = new EventEmitter<Echantillonnage[]>();

    idChantier: number;
    idZoneIntervention: number;
    idStrategie: number;
    isPatchValueDone: boolean = false;
    isSS3: boolean = false;

    submitted: boolean = false;
    champsInformations: Map<string, string> = new Map<string, string>([]);

    listeDifferenceMesures: Array<Liste> = new Array<Liste>();
    listeDifferenceDuree: Array<Liste> = new Array<Liste>();
    listeNonRealisation: Array<Liste> = new Array<Liste>();


    echantillonnageForm = this.formBuilder.group({
        echantillonnages: this.formBuilder.array([])
    });

    constructor(
        private formBuilder: FormBuilder,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private zoneInterventionService: ZoneInterventionService,
        private echantillonnageService: EchantillonnageService,
        private listeService: ListeService,
    ) {
    }

    ngOnInit() {
        if (this.listeDifferenceDuree.length === 0) {
            this.listeService.getByListName('CommentaireDifferenceDureeARealiser').subscribe(ld => {
                this.listeDifferenceDuree = ld;
            }, err => {
                console.error(err);
            });
        }

        if (this.listeDifferenceMesures.length === 0) {
            this.listeService.getByListName('CommentaireDifferenceMesuresARealiser').subscribe(lm => {
                this.listeDifferenceMesures = lm;
            }, err => {
                console.error(err);
            });
        }
        if (this.listeNonRealisation.length === 0) {
            this.listeService.getByListName('CommentaireNonRealisationObjectif').subscribe(lnr => {
                this.listeNonRealisation = lnr;
            }, err => {
                console.error(err);
            });
        }

        this.isSS3 = this.strategie.sousSection !== null
            && (this.strategie.sousSection === EnumSousSectionStrategie.SS3);

        this.idChantier = this.chantier.id;
        this.idStrategie = this.strategie.id;
        this.idZoneIntervention = this.zoneIntervention.id;


        if (!this.echantillonnages) {
            this.echantillonnageService.getByZoneId(this.idZoneIntervention).subscribe(res => {
                res = res.sort((a, b) => a.idObjectif < b.idObjectif ? -1 : 1);
                for (const echantillonnage of res) {
                    const group: FormGroup = this.formBuilder.group({
                        id: [echantillonnage.id, null],
                        code: [echantillonnage.code, null],
                        commentaireNonRealise: [echantillonnage.commentaireNonRealise, null],
                        duree: [echantillonnage.duree, null],
                        dureeARealiser: [echantillonnage.dureeARealiser, null],
                        commentaireDifferenceDuree: [echantillonnage.commentaireDifferenceDuree, null],
                        frequenceParSemaine: [echantillonnage.frequenceParSemaine, null],
                        isRealise: [echantillonnage.isRealise, null],
                        localisation: [echantillonnage.localisation, null],
                        nbMesures: [echantillonnage.nbMesures, null],
                        nbMesuresARealiser: [echantillonnage.nbMesuresARealiser, null],
                        commentaireDifferenceMesure: [echantillonnage.commentaireDifferenceMesure, null],
                        objectif: [echantillonnage.objectif, null],
                        typeMesure: [echantillonnage.typeMesure, null],
                        zoneIntervention: [echantillonnage.zoneIntervention, null],
                        hasTempsCalcule: [echantillonnage.objectif.hasTempsCalcule, null],
                    });
                    (this.echantillonnageForm.get('echantillonnages')! as FormArray).push(group);
                }
                this.echantillonnages = res;
                this.isPatchValueDone = true;

                if (!this.canEdit) {
                    this.echantillonnageForm.disable();
                }
            });
        }
    }

    compare(val1, val2) {
        console.log(val1, val2);
        return val1 === val2;
    }

    async onSubmit(formGroup: FormGroup | null) {
        if (formGroup) {
            if (this.checkValide(formGroup.valid)) {
                if (await this.save(formGroup.value)) {
                    Object.keys(formGroup.controls).forEach(control => {
                        formGroup.controls[control].markAsPristine();
                    });

                    this.notificationService.setNotification('success', ['Echantillonnage mis à jour correctement.']);
                } else {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                }
            }
        } else {
            let i = 0;
            Object.keys((this.echantillonnageForm.get('echantillonnages')! as FormArray).controls!).forEach(control => {
                if (this.save(((this.echantillonnageForm.get('echantillonnages')! as FormArray).controls![control] as FormGroup).value)) {
                    ((this.echantillonnageForm.get('echantillonnages')! as FormArray).controls![control] as FormGroup).markAsPristine();
                    i++;
                }
            });
            if (i >= (this.echantillonnageForm.get('echantillonnages')! as FormArray).controls!.length) {
                this.notificationService.setNotification('success', ['Echantillonnages mis à jour correctement.']);
            } else {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            }
        }
    }

    checkValide(valid: boolean) {
        if (valid) {
            return true;
        } else {
            this.submitted = true;
            const erreur = this.validationService.getFormValidationErrors(this.echantillonnageForm.get('rendezVous') as FormGroup,
                this.champsInformations);
            this.notificationService.setNotification('danger', erreur);
            return false;
        }
    }

    async save(echantillonnage: Echantillonnage): Promise<boolean> {
        let nouvelEch: Echantillonnage | void | null =
            await this.echantillonnageService.updateEchantillonnage(echantillonnage).toPromise().catch(err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
                nouvelEch = null;
            });

        await this.zoneInterventionService.updateNbPrelevementsARealiser(this.idZoneIntervention).subscribe(test => {
            //alert(JSON.stringify(test));
        });

        return (nouvelEch != null);
    }

    listChanged() {
        const listeEchantillonnage = new Array<Echantillonnage>();

        this.emitListeEchantillonnage.emit(listeEchantillonnage);
    }

    canDeselect(i: number) {
        return true;
        // let obj: Objectif | null = null;
        // const ech: Echantillonnage | undefined = [...this.echantillonnages].find(e =>
        //     e.id === (this.echantillonnageForm.get('echantillonnages')! as FormArray).controls![i]!.get('id')!.value);

        // if (ech) {
        //     obj = ech.objectif;
        // }

        // if (!obj) {
        //     // Au cas où, en SS3 on empêche de toucher, c'est pas normal de pas avoir l'objectif
        //     return !this.isSS3;
        // }

        // return !(this.isSS3 && obj.isObligatoireCOFRAC);
    }

    get fff() { return <FormArray>this.echantillonnageForm.get('echantillonnages'); }
}
