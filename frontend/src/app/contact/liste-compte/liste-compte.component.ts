import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {CompteService} from '../compte.service';
import {Compte} from '../Compte';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {Recherche} from '../../resource/query-builder/recherche/Recherche';
import {QualiteService} from '../../resource/qualite/qualite.service';
import {Order} from '../../resource/query-builder/order/Order';
import {QueryBuild, QueryBuildable} from '../../resource/query-builder/QueryBuild';
import * as FileSaver from 'file-saver';
import {UserStore} from '../../resource/user/user.store';
import {profils} from '@aleaac/shared';
import { NotificationService } from '../../notification/notification.service';

@Component({
    selector: 'app-liste-compte',
    templateUrl: './liste-compte.component.html',
    styleUrls: ['./liste-compte.component.scss']
})
export class ListeCompteComponent implements OnInit, QueryBuildable {
    @Input() modal: boolean = false;
    @Input() modalClient: boolean = false;
    @Output() emitCompte = new EventEmitter<Compte>();
    queryBuild: QueryBuild = new QueryBuild();
    comptes: Compte[];
    nbObjets: number;
    loading: boolean;
    franchise;
    champDeRecherches: ChampDeRecherche[] = [];
    canExport: boolean;
    headers: Order[] = [
        new Order('Raison sociale', '', true, 'compte.raisonSociale'),
        new Order('Qualité', '', true, 'qualite.nom'),
        new Order('Code postal', '', true, 'adresse.cp'),
        new Order('Ville', '', true, 'adresse.ville'),
        new Order('Téléphone', '', true, 'adresse.telephone'),
        new Order('Action', 'action'),
    ];

    constructor(
        private compteService: CompteService,
        private franchiseService: FranchiseService,
        private router: Router,
        private qualiteService: QualiteService,
        private userStore: UserStore,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.userStore.hasProfil(profils.FRANCHISE).then((data) => {
            this.canExport = data;
        });
        this.qualiteService.getAllQualite().subscribe((qualites) => {
            this.champDeRecherches = [
                new ChampDeRecherche('Raison Sociale', 'text', 'compte.raisonSociale', true, true),
                new ChampDeRecherche('Qualité', 'list', 'compte.idQualite', false, true, qualites.map((qualite) => {
                    return {id: qualite.id, nom: qualite.nom};
                })),
                new ChampDeRecherche('Code postal', 'text', 'adresse.cp', true, true),
                new ChampDeRecherche('Ville', 'text', 'adresse.ville', true, true),
                new ChampDeRecherche('Référence', 'text', 'compte.id', true, true),
                new ChampDeRecherche('Réf Compta', 'text', 'compte.numClientCompta', true, true),
                new ChampDeRecherche('Téléphone', 'text', 'adresse.telephone', true, true),

            ];
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.getCompte();
            this.countCompte();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    getCompte() {
        this.compteService.getAll(this.franchise.id, this.queryBuild).subscribe((data) => {
            this.comptes = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countCompte() {
        this.compteService.countAll(this.franchise.id, this.queryBuild).subscribe((data) => {
            this.nbObjets = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    gotoDetails(compte) {
        if (!this.modal && !this.modalClient) {
            this.router.navigate(['contact', 'compte', compte.id, 'modifier']);
        } else {
            this.emitCompte.emit(compte);
        }
    }

    setQueryBuild(queryBuild) {
        console.log(queryBuild);
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countCompte();
        }
        this.getCompte();
    }

    delete(compte) {
        this.compteService.delete(compte).subscribe(() => {
            this.getCompte();
            this.countCompte();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    generateXlsx() {
        this.compteService.generateXlsx(this.franchise.id).subscribe((xlsx) => {
            FileSaver.saveAs(xlsx, 'export.xlsx');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
