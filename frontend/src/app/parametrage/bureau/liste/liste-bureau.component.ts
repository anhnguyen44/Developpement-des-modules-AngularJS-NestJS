import { Component, OnInit, Input } from '@angular/core';
import { BureauService } from '../bureau.service';
import { MenuService } from '../../../menu/menu.service';
import { Bureau } from '../Bureau';
import { ActivatedRoute, Router } from '@angular/router';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { UserService } from '../../../resource/user/user.service';
import { UserStore } from '../../../resource/user/user.store';
import { Recherchable } from '../../../resource/query-builder/recherche/Recherchable';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';
import { Recherche } from '../../../resource/query-builder/recherche/Recherche';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { Order } from '../../../resource/query-builder/order/Order';
import { Franchise } from '@aleaac/shared';
import { NotificationService } from '../../../notification/notification.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-liste-bureau',
    templateUrl: './liste-bureau.component.html',
    styleUrls: ['./liste-bureau.component.scss']
})
export class ListeBureauComponent implements OnInit, Recherchable {
    @Input() superAdminFranchiseId: number;
    @Input() isSuperAdmin: boolean = false;
    @Input() isInsideFranchiseSA: boolean = false;
    listeFranchise: Franchise[];
    compareFn = this._compareFn.bind(this);
    bureaux: Bureau[];
    franchiseId: number;
    canCreateBureau: Promise<boolean>;
    queryBuild: QueryBuild = new QueryBuild();
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Nom', 'text', 'bureau.nom', true)
    ];
    headers: Order[] = [
        new Order('Id', '', true, 'bureau.id'),
        new Order('Nom', '', true, 'bureau.nom'),
        new Order('Principal'),
        new Order('Action', 'action'),
    ];

    constructor(
        private bureauxService: BureauService,
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private userStore: UserStore,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        if (!this.isSuperAdmin) {
            this.menuService.setMenu([
                ['Paramétrage', '/parametrage'],
                ['Agences', '']
            ]);
        } else {
            // Si on est en super admin, on va chercher la liste des franchises
            this.franchiseService.getAllFranchise().subscribe(data => {
                this.listeFranchise = data;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }

        if (this.superAdminFranchiseId) {
            this.franchiseId = this.superAdminFranchiseId;
            this.getBureaux();
        } else {
            this.franchiseService.franchise.subscribe((franchise) => {
                this.franchiseId = franchise.id;
                this.getBureaux();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }

        this.userStore.user.subscribe(() => {
            this.canCreateBureau = this.userStore.hasRight('BUREAU_CREATE');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    getBureaux() {
        this.bureauxService.getAll(this.franchiseId, this.queryBuild).subscribe((bureaux) => {
            this.bureaux = bureaux;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    delete(bureau: Bureau) {
        this.bureauxService.delete(bureau.id).subscribe((data) => {
            this.notificationService.setNotification('success', ['Bureau supprimé.']);
            this.bureaux = this.bureaux.filter(b => b.id !== bureau.id);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue. Ce bureau est sûrement lié à d\'autres éléments']);
            console.error(err);
        });
    }

    gotoDetails(bureau) {
        const currentModule: string = this.isSuperAdmin ? 'superadmin' : 'parametrage';
        this.router.navigate(['/' + currentModule + '', 'bureau', 'modifier', bureau.id]);
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        this.getBureaux();
    }

    changeFranchise() {
        if (this.isSuperAdmin) {
            this.superAdminFranchiseId = this.franchiseId;
            this.getBureaux();
        }
    }

    exportAll() {
        this.bureauxService.generateXlsx().subscribe((xlsx) => {
            FileSaver.saveAs(xlsx, 'export.xlsx');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }
}
