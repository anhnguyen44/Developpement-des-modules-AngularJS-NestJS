import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {Franchise} from '../../resource/franchise/franchise';
import {Consommable} from '../Consommable';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {ConsommableService} from '../consommable.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SalleService} from '../salle.service';
import {Salle} from '../Salle';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {FormBuilder, Validators} from '@angular/forms';
import {Filtre} from '../Filtre';
import {FiltreService} from '../filtre.service';
import {ValidationService} from '../../resource/validation/validation.service';
import {NotificationService} from '../../notification/notification.service';

@Component({
  selector: 'app-salle',
  templateUrl: './salle.component.html',
  styleUrls: ['./salle.component.scss']
})
export class SalleComponent implements OnInit {


    franchise: Franchise;
    bureaux: Bureau[];
    submited: boolean = false;
    salleForm = this.formBuilder.group({
        libelle: ['', [Validators.required]],
        ref: ['', [Validators.required]],
        bureau: ['', [Validators.required]],
        place: ['', [Validators.required]],
        couleur: ['']
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['bureau', 'le bureau'],
        ['libelle', 'Le libellé'],
        ['ref', 'Le référence'],
        ['place', 'les places'],
    ]);
    salle: Salle;
    constructor(
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private salleService: SalleService,
        private franchiseService: FranchiseService,
        private bureauService: BureauService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Logistique', '/logistique/lot-filtre'],
            ['Salles', '/logistique/salle'],
            ['Informations de la salle', ''],
        ]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.bureaux = bureaux;
            });
        });
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.salleService.get(params.id).subscribe((salle) => {
                  console.log(salle);
                    this.salle = salle;
                    this.salleForm.patchValue(this.salle);
                    console.log(this.salle);
                });
            } else {
                this.salle = new Salle();
                this.salle.idFranchise = this.franchise.id;
                this.salleForm.patchValue(this.salle);
            }
        });
    }

    onSubmit({value, valid}: {value: Salle, valid: boolean}) {
        if (valid) {
            value.idBureau = value.bureau.id;
            value.idFranchise = this.salle.idFranchise;
            if (this.salle.id) {
                value.id = this.salle.id;
                this.salleService.update(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Salle mise à jour correctement.']);
                    this.router.navigate(['/logistique', 'salle']);
                });
            } else {
                this.salleService.create(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Salle créée correctement.']);
                    this.router.navigate(['/logistique', 'salle']);
                });
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification('danger',
                this.validationService.getFormValidationErrors(this.salleForm, this.champsInformations)
            );
        }
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

}
