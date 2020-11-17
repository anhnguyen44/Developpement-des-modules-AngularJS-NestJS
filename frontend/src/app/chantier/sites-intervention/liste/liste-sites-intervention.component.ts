import { Component, OnInit, EventEmitter, Output, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { SitePrelevement, Chantier } from '@aleaac/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { fadeIn, fadeOut } from '../../../resource/animation';
import { Recherchable } from '../../../resource/query-builder/recherche/Recherchable';
import { QueryBuildable, QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';
import { Order } from '../../../resource/query-builder/order/Order';
import { MenuService } from '../../../menu/menu.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { NotificationService } from '../../../notification/notification.service';
import { StatutCommandeService } from '../../../resource/statut-commande/statut-commande.service';
import { SitePrelevementService } from '../../site-prelevement.service';
import { ChantierService } from '../../chantier.service';

@Component({
    selector: 'app-liste-sites-intervention',
    templateUrl: './liste-sites-intervention.component.html',
    styleUrls: ['./liste-sites-intervention.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ListeSitePrelevementComponent implements OnInit, AfterViewChecked, Recherchable, QueryBuildable {
    champDeRecherches: ChampDeRecherche[];
    idChantier: number;
    chantier: Chantier;
    sitePrelevements: SitePrelevement[];
    nbObjets: number;
    defaultOrder: Order = new Order('Réf', '', true, 'sitePrelevement.id', 'DESC');
    modalSiteIntervention: boolean = false;
    currentSitePrelevement: SitePrelevement;

    @Output() emitCreateSite: EventEmitter<any> = new EventEmitter<any>();
    @Output() emitSelectSite: EventEmitter<SitePrelevement> = new EventEmitter<SitePrelevement>();
    @Input() isModal: boolean = false;
    @Input() isOnlyCreate: boolean = false;

    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Réf', '', true, 'sitePrelevement.id'),
        new Order('Nom', '', true, 'sitePrelevement.nom'),
        new Order('Adresse', '', false, 'adresse.ville'),
        new Order('Commentaire', '', false, 'sitePrelevement.commentaire'),
        new Order('Bâtiments', '', false),
        new Order('Action', 'action'),
    ];

    constructor(
        private menuService: MenuService,
        private sitePrelevementService: SitePrelevementService,
        private router: Router,
        private notificationService: NotificationService,
        private chantierService: ChantierService,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.idChantier = params.id;

            this.getSitePrelevement();
            this.chantierService.get(this.idChantier).subscribe(data => {
                this.chantier = data;
                if (!this.isModal) {
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.idChantier + '/informations'],
                        ['Sites d\'intervention', ''],
                    ]);
                }
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });

            if (params.idSite) {
                this.sitePrelevementService.get(Number.parseInt(params.idSite)).subscribe(sp => {
                    this.currentSitePrelevement = sp;
                    this.modalSiteIntervention = true;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        });
    }

    ngAfterViewChecked(): void {
        try {
            this.cdRef.detectChanges();
        } catch (e) { }
    }

    getSitePrelevement() {
        this.sitePrelevementService.getAll(this.idChantier, this.queryBuild).subscribe((sitePrelevements) => {
            this.sitePrelevements = sitePrelevements;
        }, err => {
            console.error(err);
        });
    }

    countSitePrelevement() {
        this.sitePrelevementService.countAll(this.idChantier, this.queryBuild).subscribe((count) => {
            this.nbObjets = count;
            console.log(this.nbObjets);
        }, err => {
            console.error(err);
        });
    }

    goToDetail(sitePrelevement: SitePrelevement) {
        //this.router.navigate(['chantier', this.idChantier, 'sites', sitePrelevement.id], { skipLocationChange: true });
        this.currentSitePrelevement = sitePrelevement;
        this.modalSiteIntervention = true;
    }

    openModal(sitePrelevement: SitePrelevement) {
        this.currentSitePrelevement = sitePrelevement;
        this.modalSiteIntervention = true;
    }

    setAllChecked(event) {
        if (this.sitePrelevements) {
            this.sitePrelevements.forEach(dc => dc.selected = event);
        }
    }

    isAllChecked() {
        if (this.sitePrelevements) {
            return this.sitePrelevements.every(dc => dc.selected !== undefined ? dc.selected : false);
        } else {
            return false;
        }
    }

    setQueryBuild(queryBuild): void {
        // console.log(queryBuild);
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countSitePrelevement();
        }
        this.getSitePrelevement();
    }

    emitNouveauSite(event) {
        this.emitCreateSite.emit(event);
    }

    emitSelectionSite(site) {
        this.emitSelectSite.emit(site);
    }

    closeModalSiteIntervention(event: Event) {
        this.modalSiteIntervention = false;
        this.router.navigate(['chantier', this.idChantier, 'sites', 'liste']);
    }

    setSiteIntervention(sitePrelevement: SitePrelevement) {
        this.currentSitePrelevement = sitePrelevement;
        const toUpdate = this.sitePrelevements.find(sp => sp.id == sitePrelevement.id);
        if (toUpdate) {
            const index = this.sitePrelevements.indexOf(toUpdate);
            this.sitePrelevements[index] = sitePrelevement;
        } else {
            this.sitePrelevements.push(sitePrelevement);
            this.emitCreateSite.emit();
        }
    }

    delete(sitePrelevement: SitePrelevement) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce site de prélèvements ? (vous perdrez les fichiers et les batiments associés, avec leurs plans)')) {
            this.sitePrelevementService.delete(sitePrelevement.id).subscribe((data) => {
                    this.sitePrelevements = this.sitePrelevements!.filter(item => item.id !== sitePrelevement.id);
                    this.notificationService.setNotification('success', ['Site de prélèvements supprimé.']);
                    this.emitCreateSite.emit();
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }
}
