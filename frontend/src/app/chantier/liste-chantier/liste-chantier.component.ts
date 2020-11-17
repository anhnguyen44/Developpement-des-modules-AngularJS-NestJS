import { Component, OnInit, Input } from '@angular/core';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import { EnumTypeDevis, Franchise, StatutCommande, EnumStatutCommande, ModalAbandonCommandeDto } from '@aleaac/shared';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { Recherche } from '../../resource/query-builder/recherche/Recherche';
import { MenuService } from '../../menu/menu.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Chantier } from '../Chantier';
import { ChantierService } from '../chantier.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification/notification.service';
import { fadeIn, fadeOut } from '../../resource/animation';
import { QueryBuild, QueryBuildable } from '../../resource/query-builder/QueryBuild';
import { Order } from '../../resource/query-builder/order/Order';
import { StatutCommandeService } from '../../resource/statut-commande/statut-commande.service';

@Component({
    selector: 'app-liste-chantier',
    templateUrl: './liste-chantier.component.html',
    styleUrls: ['./liste-chantier.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ListeChantierComponent implements OnInit, Recherchable, QueryBuildable {
    @Input() isModal: boolean = false;

    franchise: Franchise;
    chantiers: Chantier[];
    enumTypeDevis = EnumTypeDevis;
    champDeRecherches: ChampDeRecherche[] = [];
    nbObjets: number;
    listeStatuts: StatutCommande[];
    statutCible: StatutCommande;
    openModalAbandon: boolean = false;
    defaultOrder: Order = new Order('Réf', '', true, 'chantier.id', 'DESC');
    infosAbandon: ModalAbandonCommandeDto = new ModalAbandonCommandeDto();

    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Réf', '', true, 'chantier.id'),
        new Order('Statut', '', true, 'statut_commande.nom'),
        new Order('Client', '', true, 'client.nom'),
        new Order('Nom du chantier', '', true, 'chantier.nomChantier'),
        new Order('Date création', '', true, 'chantier.dateCreation'),
        new Order('Action', 'action'),
    ];

    constructor(
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private chantierService: ChantierService,
        private router: Router,
        private notificationService: NotificationService,
        private statutCommandeService: StatutCommandeService
    ) { }

    ngOnInit() {
        this.franchiseService.franchise.subscribe((franchise) => {
            this.franchise = franchise;
            this.getChantier();
            this.countChantier();
        }, err => {
            console.error(err);
        });

        this.statutCommandeService.getAllStatutCommande().subscribe((statuts) => {
            this.champDeRecherches = [
                new ChampDeRecherche('Référence', 'text', 'chantier.id', true, false),
                new ChampDeRecherche('Statut', 'list', 'chantier.idStatut', true, true, statuts.map((statut) => {
                    return { id: statut.id, nom: statut.nom };
                })),
                //new ChampDeRecherche('Type', 'enum', 'devisCommande.typeDevis', true, true, this.enumTypeDevis)
                new ChampDeRecherche('Nom du chantier', 'text', 'chantier.nomChantier', true, true)
            ];
            this.listeStatuts = statuts; // .filter(s => s.parent && s.parent.id == EnumStatutCommande.LABO_DEVIS_EN_PROD);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });

        this.menuService.setMenu([
            ['Chantiers', '']
        ]);
    }

    getChantier() {
        this.chantierService.getAll(this.franchise.id, this.queryBuild).subscribe((chantiers) => {
            this.chantiers = chantiers;
        }, err => {
            console.error(err);
        });
    }

    countChantier() {
        this.chantierService.countAll(this.franchise.id, this.queryBuild).subscribe((count) => {
            this.nbObjets = count;
            console.log(this.nbObjets);
        }, err => {
            console.error(err);
        });
    }

    goToDetail(chantier: Chantier) {
        this.router.navigate(['chantier', chantier.id, 'informations']);
    }

    openModaleAbandon(chantiers: Chantier[]) {
        this.openModalAbandon = true;
        if (chantiers) {
            if (chantiers.length === 1) {
                // Détermination auto
                this.statutCommandeService.statutIsBeforeCommande(chantiers[0].statut.id).then(res => {
                    this.statutCible = res
                        ? this.listeStatuts.find(s => s.id == EnumStatutCommande.DEVIS_ABANDONNE)!
                        : this.listeStatuts.find(s => s.id == EnumStatutCommande.COMMANDE_ABANDONNE)!;
                });
            } else {
                this.openModalAbandon = false;
                this.notificationService.setNotification('danger',
                ['Attention, plusieurs chantiers sont sélectionnés, veuillez séléctionner un seul chantier pour la suppression.']);
            }
        } else {
            // WTF ?
            this.openModalAbandon = false;
        }

        if (chantiers) {
            this.chantiers.forEach(dcmain => {
                dcmain.selected = false;
            });
            this.chantiers.forEach(dcmain => {
                if (chantiers.some(dc => dc.id == dcmain.id)) {
                    dcmain.selected = true;
                }
            });
        }
    }

    setAllChecked(event) {
        if (this.chantiers) {
            this.chantiers.forEach(dc => dc.selected = event);
        }
    }

    isAllChecked() {
        if (this.chantiers) {
            return this.chantiers.every(dc => dc.selected!);
        } else {
            return false;
        }
    }

    changeStatusTo() {
        if (!this.statutCible) {
            alert('Veuillez sélectionner un statut cible pour les chantiers.');
            return;
        }

        const collectionToApply = this.chantiers.filter(dc => dc.selected!);

        if (collectionToApply.length > 0) {
            if (this.statutCible.isJustificationNecessaire) {
                // Modale
                this.openModaleAbandon(collectionToApply);
                return;
            } else {
                let i = 0;
                collectionToApply.forEach(dc => {
                    // On fait un objet partiel plus léger pour l'update
                    const localDC = new Chantier();
                    localDC.id = dc.id;
                    localDC.idStatut = this.statutCible.id;

                    this.chantierService.partialUpdate(localDC).subscribe(data => {
                        i++;
                        if (i === collectionToApply.length) {
                            this.notificationService.setNotification('success', ['Statut du ou des chantier(s) mis à jour.']);
                        }
                    }, err => {
                        console.error(err);
                    });

                    // On met quand même à jour pour la vue
                    dc.statut = this.statutCible;
                });
            }
        } else {
            alert('Veuillez sélectionner au moins un chantier avant de changer de statut.');
        }
    }

    setQueryBuild(queryBuild): void {
        console.log(queryBuild);
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countChantier();
        }
        this.getChantier();
    }

    satutIsParent(statut: StatutCommande) {
        if (statut) {
            return this.listeStatuts.some(s => s.parent && s.parent.id === statut.id);
        } else {
            return false;
        }
    }

    setRaisonAbandon(event) {
        this.infosAbandon = event;
        const collectionToApply = this.chantiers.filter(dc => dc.selected);

        if (collectionToApply.length > 0) {
            let i = 0;
            collectionToApply.forEach(dc => {
                // On fait un objet partiel plus léger pour l'update
                const localDC = new Chantier();
                localDC.id = dc.id;
                localDC.idStatut = this.statutCible.id;
                localDC.statut = this.statutCible;
                localDC.raisonStatutCommande = this.infosAbandon.commentaire;
                localDC.motifAbandonCommande = this.infosAbandon.motif;
                localDC.idMotifAbandonCommande = this.infosAbandon.motif.id;

                if (this.infosAbandon.motif.isSuppression) {
                    this.chantierService.delete(localDC.id).subscribe(data => {
                        i++;
                        if (i === collectionToApply.length) {
                            this.notificationService.setNotification('success', ['Chantier(s) supprimé(s).']);
                        }
                        // On ele vire de la liste
                        this.chantiers = this.chantiers.filter(dd => dd.id != dc.id);
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    });
                } else {
                    this.chantierService.partialUpdate(localDC).subscribe(data => {
                        i++;
                        if (i === collectionToApply.length) {
                            this.notificationService.setNotification('success', ['Statut du/des chantier(s) mis à jour.']);
                        }
                        // On met quand même à jour pour la vue
                        dc.statut = this.statutCible;
                        dc.idStatut = this.statutCible.id;
                        dc.raisonStatutCommande = this.infosAbandon.commentaire;
                    }, err => {
                        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    });
                }
            });
        }
        this.openModalAbandon = false;
    }
}
