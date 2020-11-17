import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {Franchise} from '../../resource/franchise/franchise';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {ValidationService} from '../../resource/validation/validation.service';
import {NotificationService} from '../../notification/notification.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {Pompe} from '../Pompe';
import {PompeService} from '../pompe.service';
import {EnumTypePompe} from '@aleaac/shared';

import {endOfWeek, startOfWeek, format} from 'date-fns';
import {RendezVous} from '../RendezVous';
import {RendezVousPompe} from '../RendezVousPompe';

@Component({
  selector: 'app-pompe',
  templateUrl: './pompe.component.html',
  styleUrls: ['./pompe.component.scss']
})
export class PompeComponent implements OnInit {
    modalIndisponibilite: boolean = false;
    indisponibles: RendezVous[];
    keys: any[];
    id: number;
    franchise: Franchise;
    bureaux: Bureau[];
    submited: boolean = false;
    enumTypePompe = EnumTypePompe;
    pompeForm = this.formBuilder.group({
        id: [null],
        libelle: ['', [Validators.required]],
        ref: ['', [Validators.required]],
        dateEtalonnage: ['', [Validators.required]],
        periodeEtalonnage: ['', [Validators.required]],
        dateValidation: ['', [Validators.required]],
        periodeValidation: ['', [Validators.required]],
        dateVerifAnnexe: ['', [Validators.required]],
        periodeVerifAnnexe: ['', [Validators.required]],
        incertitude: ['', [Validators.required]],
        indiceVolumique: ['', [Validators.required]],
        idTypePompe: ['', [Validators.required]],
        isBlancEffectue: [''],
        bureau: ['', [Validators.required]],
        couleur: ['']
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['libelle', 'Le libellé'],
        ['ref', 'Le référence'],
        ['lot', 'le lot'],
        ['incertitude', 'l\'incertitude'],
        ['dateEtalonnage', 'La date d\'etalonnage'],
        ['periodeEtalonnage', 'La période d\'etalonnage'],
        ['type', 'Le type de pompe'],
        ['indiceVolumique', 'L\'indice volumique'],
        ['dateValidation', 'La date de validation'],
        ['periodeValidation', 'La période de validation'],
        ['dateVerifAnnexe', 'La date de vérification des annexes'],
        ['periodeVerifAnnexe', 'La période de vérification des annexes'],
        ['bureau', 'le bureau']
    ]);
    pompe: Pompe;
    queryBuild: QueryBuild = new QueryBuild(
        null,
        null,
        format(startOfWeek(new Date), 'YYYY-MM-DD HH:mm:ss'),
        format(endOfWeek(new Date), 'YYYY-MM-DD HH:mm:ss'),
        'rendezVous.dateHeureDebut',
        'rendezVous.dateHeureFin',
        'rendezVousPompes'
        );
    constructor(
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private pompeService: PompeService,
        private franchiseService: FranchiseService,
        private bureauService: BureauService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.keys = Object.keys(this.enumTypePompe).filter(Number);
        this.menuService.setMenu([
            ['Logistique', '/logistique/lot-filtre'],
            ['Pompes', '/logistique/pompe'],
            ['Informations de la pompe', ''],
        ]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.bureaux = bureaux;
                this.route.params.subscribe((params) => {
                    if (params.id) {
                        this.id = params.id;
                        this.getPompe();
                    } else {
                        this.pompeForm.patchValue({
                            bureau: this.bureaux[0]
                        });
                    }
                });
            });
        });
    }

    onSubmit({value, valid}: {value: Pompe, valid: boolean}) {
        if (valid) {
            value.idBureau = value.bureau.id;
            value.idFranchise = this.franchise.id;
            if (value.id) {
                this.pompeService.update(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Pompe mise à jour correctement.']);
                    this.router.navigate(['/logistique', 'pompe']);
                });
            } else {
                this.pompeService.create(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Pompe créée correctement']);
                    this.router.navigate(['/logistique', 'pompe']);
                });
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification('danger',
                this.validationService.getFormValidationErrors(this.pompeForm, this.champsInformations)
            );
        }
    }

    getPompe() {
        console.log(this.id, this.queryBuild);
        this.pompeService.get(this.id, this.queryBuild).subscribe((pompe) => {
            this.pompe = pompe;
            this.pompeForm.patchValue(this.pompe);
            this.pompeForm.patchValue({
                dateEtalonnage: format(this.pompe.dateEtalonnage, 'YYYY-MM-DD'),
                dateValidation: format(this.pompe.dateValidation, 'YYYY-MM-DD'),
                dateVerifAnnexe: format(this.pompe.dateVerifAnnexe, 'YYYY-MM-DD')
            });
        });
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    setInterval(interval) {
        this.queryBuild.dd = format(interval.dd, 'YYYY-MM-DD HH:mm:ss');
        this.queryBuild.df = format(interval.df, 'YYYY-MM-DD HH:mm:ss');
        console.log(this.queryBuild);
        this.getPompe();
    }

    openModalIndisponibilite() {
        this.pompeService.getIndisponible(this.pompeForm.get('id')!.value).subscribe((pompe) => {
            console.log(pompe);
            this.indisponibles = [];
            for ( const rdv of pompe.rendezVousPompes ) {
                this.indisponibles.push(rdv.rendezVous);
            }
            console.log(this.indisponibles);
            this.modalIndisponibilite = true;
        });
    }

    closeModalIndisponibilite() {
        this.modalIndisponibilite = false;
        this.getPompe();
    }

    setIndisponibilite(indisponibilite) {
        const rendezVousPompe = new RendezVousPompe();
        rendezVousPompe.idPompe = this.pompe.id;
        rendezVousPompe.rendezVous = indisponibilite;
        this.pompeService.addRendezVousPompe(rendezVousPompe).subscribe(() => {
            this.getPompe();
            this.closeModalIndisponibilite();
        });
    }


}
