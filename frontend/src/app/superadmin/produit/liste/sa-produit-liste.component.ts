import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../menu/menu.service';
import { UserService } from '../../../resource/user/user.service';
import { Router } from '@angular/router';
import { IProduit } from '@aleaac/shared';
import { NotificationService } from '../../../notification/notification.service';
import { ProduitService } from '../../../resource/produit/produit.service';
import { UserStore } from '../../../resource/user/user.store';
import { Produit } from '../../../resource/produit/Produit';
import { MailService } from '../../../resource/mail/mail.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { GrilleTarifService } from '../../../resource/grille-tarif/grille-tarif.service';
import {QueryBuild} from '../../../resource/query-builder/QueryBuild';
import {Order} from '../../../resource/query-builder/order/Order';
import {ChampDeRecherche} from '../../../resource/query-builder/recherche/ChampDeRecherche';

@Component({
    selector: 'sa-produit-liste',
    templateUrl: './sa-produit-liste.component.html',
    styleUrls: ['./sa-produit-liste.component.scss']
})
export class ListeProduitComponent implements OnInit {

    constructor(private menuService: MenuService, private produitService: ProduitService, private router: Router,
        private notificationService: NotificationService, private userService: UserService, private userStore: UserStore,
        private mailService: MailService, private franchiseService: FranchiseService, private serviceGrilleTarif: GrilleTarifService) {
    }
    produits: IProduit[] | null;
    nbObjets: number = 25;
    canCreateProduite: Promise<boolean>;
    isGrilleUpdating: boolean = false;
    queryBuild: QueryBuild = new QueryBuild();

    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Type', 'text', 'type_produit.nom', true, true),
        new ChampDeRecherche('Nom', 'text', 'produit.nom', true, true),
        new ChampDeRecherche('Code', 'text', 'produit.code', true, true),
        new ChampDeRecherche('Prix', 'number', 'produit.prixUnitaire', true, true),
    ];

    headers: Order[] = [
        new Order('Type', '', true, 'type_produit.nom'),
        new Order('Nom', '', true, 'produit.nom'),
        new Order('Code', '', true, 'produit.code'),
        new Order('Prix', '', true, 'produit.prixUnitaire'),
        new Order('Rang', '', true, 'produit.rang'),
        new Order('Actions', 'action'),
    ];

    ngOnInit() {
        this.menuService.setMenu([
            ['Super admin', '/superadmin'],
            ['Produits', '']
        ]);
        this.userStore.user.subscribe(() => {
            this.canCreateProduite = this.userStore.hasRight('PRODUCTS_CREATE_ALL');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
        this.getProduits();
        this.countProduits();
    }

    getProduits() {
        this.produitService.getPage(this.queryBuild).subscribe((data) => {
            this.produits = data;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    countProduits() {
        this.produitService.countAll(this.queryBuild).subscribe((data2) => {
            this.nbObjets = data2;
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    setQueryBuild(queryBuild: QueryBuild) {
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countProduits();
        }
        this.getProduits();
    }

    supprimer(id: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet produit ?')) {
            this.produitService.removeProduit(id).subscribe((data) => {
                this.produits = this.produits!.filter(item => item.id !== id);
                this.notificationService.setNotification('success', ['Produit supprimé.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }
    }

    public gotoDetails(url, user) {
        this.router.navigate([url, user.id]).then((e) => {
            if (e) {
                // console.log('Navigation is successful!');
            } else {
                // console.log('Navigation has failed!');
            }
        });
    }

    changerOrdre(difference: number, produit: Produit) {
        produit.rang += difference;
        this.produitService.updateProduit(produit).subscribe((data) => {
            this.notificationService.setNotification('success', ['Produit mis à jour.']);
            this.getProduits();
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }

    testMail() {
        this.mailService.sendTest().subscribe(tata => {
            this.notificationService.setNotification('success', [tata]);
        }, err => {
            this.notificationService.setNotification('danger', [err]);
        });
    }

    async doGenerateGrilles() {
        this.isGrilleUpdating = true;
        this.franchiseService.getAllFranchise().subscribe(data => {
            let i = 0;
            for (const franch of data) {
                this.serviceGrilleTarif.initGrillesFranchise(franch.id).subscribe(() => {
                    i++;

                    if (i === data.length) {
                        this.notificationService.setNotification('success', ['Grilles mises à jour.']);
                        this.isGrilleUpdating = false;
                    }
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
