import { Component, OnInit } from '@angular/core';
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
import {ConsommableService} from '../consommable.service';
import {Consommable} from '../Consommable';

@Component({
  selector: 'app-consommable',
  templateUrl: './consommable.component.html',
  styleUrls: ['./consommable.component.scss']
})
export class ConsommableComponent implements OnInit {
    franchise: Franchise;
    bureaux: Bureau[];
    submited: boolean = false;
    modalConsommable: boolean = false;
    consommableForm = this.formBuilder.group({
        libelle: ['', [Validators.required]],
        ref: ['', [Validators.required]],
        nombreParCommande: ['', [Validators.required]],
        bureau: ['', [Validators.required]],
        stock: ['']
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['libelle', 'Le libellé'],
        ['ref', 'Le référence'],
        ['nombre', 'le nombre'],
        ['bureau', 'le bureau']
    ]);
    consommable: Consommable;
    constructor(
        private formBuilder: FormBuilder,
        private menuService: MenuService,
        private route: ActivatedRoute,
        private consommableService: ConsommableService,
        private franchiseService: FranchiseService,
        private bureauService: BureauService,
        private validationService: ValidationService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.menuService.setMenu([
            ['Logistique', '/logistique/lot-filtre'],
            ['Consommables', '/logistique/consommable'],
            ['Informations du consommable', ''],
        ]);
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
                this.bureaux = bureaux;
            });
        });
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.consommableService.get(params.id).subscribe((consommable) => {
                    this.consommable = consommable;
                    this.consommableForm.patchValue(this.consommable);
                    console.log(this.consommable);
                });
            } else {
                this.consommable = new Consommable();
                this.consommable.idFranchise = this.franchise.id;
                this.consommableForm.patchValue(this.consommable);
            }
        });
    }

    onSubmit({value, valid}: {value: Consommable, valid: boolean}) {
        if (valid) {
            value.idBureau = value.bureau.id;
            value.idFranchise = this.consommable.idFranchise;
            if (this.consommable.id) {
                value.id = this.consommable.id;
                this.consommableService.update(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Consommable mis à jour correctement.']);
                    this.router.navigate(['/logistique', 'consommable']);
                });
            } else {
                this.consommableService.create(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Consommable créé correctement.']);
                    this.router.navigate(['/logistique', 'consommable']);
                });
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification('danger',
                this.validationService.getFormValidationErrors(this.consommableForm, this.champsInformations)
            );
        }
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }

    openModalConsommable() {
        this.modalConsommable = true;
    }

    setStock(add: number) {
        this.consommable.stock += add;
        this.consommableForm.patchValue(this.consommable);
        this.consommableForm.value.id = this.consommable.id;
        this.consommableService.update(this.consommableForm.value).subscribe(() => {
            this.notificationService.setNotification('success', ['Stock mis à jour.']);
        });
        this.modalConsommable = false;
    }

    close() {
        this.modalConsommable = false;
    }

}
