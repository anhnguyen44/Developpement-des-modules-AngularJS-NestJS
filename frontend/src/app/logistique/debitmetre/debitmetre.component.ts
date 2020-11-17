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
import {DebitmetreService} from '../debitmetre.service';
import {Debitmetre} from '../Debitmetre';

@Component({
  selector: 'app-debitmetre',
  templateUrl: './debitmetre.component.html',
  styleUrls: ['./debitmetre.component.scss']
})
export class DebitmetreComponent implements OnInit {


    franchise: Franchise;
    bureaux: Bureau[];
    submited: boolean = false;
    debitmetreForm = this.formBuilder.group({
        libelle: ['', [Validators.required]],
        ref: ['', [Validators.required]],
        bureau: ['', [Validators.required]]
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['bureau', 'le bureau'],
        ['libelle', 'Le libellé'],
        ['ref', 'Le référence']
    ]);
    debitmetre: Debitmetre;
    constructor(
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private debitmetreService: DebitmetreService,
        private franchiseService: FranchiseService,
        private bureauService: BureauService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Logistique', '/logistique/lot-filtre'],
            ['Débitmètres', '/logistique/debitmetre'],
            ['Informations du débitmètre', ''],
        ]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.bureaux = bureaux;
            });
        });
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.debitmetreService.get(params.id).subscribe((debitmetre) => {
                    this.debitmetre = debitmetre;
                    this.debitmetreForm.patchValue(this.debitmetre);
                });
            } else {
                this.debitmetre = new Debitmetre();
                this.debitmetre.idFranchise = this.franchise.id;
                this.debitmetreForm.patchValue(this.debitmetre);
            }
        });
    }

    onSubmit({value, valid}: {value: Salle, valid: boolean}) {
        if (valid) {
            value.idBureau = value.bureau.id;
            value.idFranchise = this.debitmetre.idFranchise;
            if (this.debitmetre.id) {
                value.id = this.debitmetre.id;
                this.debitmetreService.update(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Débitmétre mise à jour correctement.']);
                    this.router.navigate(['/logistique', 'debitmetre']);
                });
            } else {
                this.debitmetreService.create(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Débitmétre créée correctement.']);
                    this.router.navigate(['/logistique', 'debitmetre']);
                });
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification('danger',
                this.validationService.getFormValidationErrors(this.debitmetreForm, this.champsInformations)
            );
        }
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

}
