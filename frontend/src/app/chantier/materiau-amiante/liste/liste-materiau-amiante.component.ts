import { Component, OnInit, EventEmitter, Output, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MateriauZone, Chantier, EnumListeMateriauxAmiante } from '@aleaac/shared';
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
import { ChantierService } from '../../chantier.service';
import { MateriauZoneService } from '../../../resource/materiau-construction-amiante/materiau-zone.service';
import { EnumResultatExamenAmiante } from '@aleaac/shared';

@Component({
    selector: 'app-liste-materiau-amiante',
    templateUrl: './liste-materiau-amiante.component.html',
    styleUrls: ['./liste-materiau-amiante.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ListeMateriauZoneComponent implements OnInit, AfterViewChecked, Recherchable, QueryBuildable {
    champDeRecherches: ChampDeRecherche[];
    idZone: number;
    idChantier: number;
    @Input() chantier: Chantier;
    @Input() canEdit: boolean = true;
    materiauZones: MateriauZone[];
    nbObjets: number;
    defaultOrder: Order = new Order('Réf', '', true, 'materiauZone.id', 'DESC');
    modalMateriauZone: boolean = false;
    enumScore: typeof EnumResultatExamenAmiante = EnumResultatExamenAmiante;
    enumListeMateriau: typeof EnumListeMateriauxAmiante = EnumListeMateriauxAmiante;

    @Output() emitCreateMateriau: EventEmitter<any> = new EventEmitter<any>();
    @Output() emitSelectMateriau: EventEmitter<MateriauZone> = new EventEmitter<MateriauZone>();

    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Réf', '', false, 'materiauZone.id'),
        new Order('Matériau', '', false, 'materiauZone.materiau.partieComposant'),
        new Order('Matériau autres', '', false, 'materiauZone.materiauAutre'),
        new Order('Liste', '', false, 'materiauZone.materiau.liste'),
        new Order('Score', '', false, 'materiauZone.resultatConnu'),
        new Order('Action', 'action'),
    ];

    constructor(
        private menuService: MenuService,
        private materiauZoneService: MateriauZoneService,
        private router: Router,
        private notificationService: NotificationService,
        private chantierService: ChantierService,
        private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.idChantier = params.id;
            this.idZone = params.idZone;

            if (!this.materiauZones) {
                this.getMateriauZone();
            }
            // this.chantierService.get(this.idChantier).subscribe(data => {
            //     this.chantier = data;
            // }, err => {
            //     this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            //     console.error(err);
            // });
        });
    }

    ngAfterViewChecked(): void {
        try {
            this.cdRef.detectChanges();
        } catch (e) { }
    }

    getMateriauZone() {
        this.materiauZoneService.getAllMateriauZone(this.idZone).subscribe((materiauZones) => {
            this.materiauZones = materiauZones;
        }, err => {
            console.error(err);
        });
    }

    countMateriauZone() {
        this.materiauZoneService.countAll(this.idZone).subscribe((count) => {
            this.nbObjets = count;
            console.log(this.nbObjets);
        }, err => {
            console.error(err);
        });
    }

    goToDetail(materiauZone: MateriauZone) {
        this.emitSelectMateriau.emit(materiauZone);
    }

    setAllChecked(event) {
        if (this.materiauZones) {
            this.materiauZones.forEach(dc => dc.selected = event);
        }
    }

    isAllChecked() {
        if (this.materiauZones) {
            return this.materiauZones.every(dc => dc.selected !== undefined ? dc.selected : false);
        } else {
            return false;
        }
    }

    setQueryBuild(queryBuild): void {
        // console.log(queryBuild);
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countMateriauZone();
        }
        this.getMateriauZone();
    }

    emitNouveauMateriau(event) {
        this.emitCreateMateriau.emit(event);
    }

    delete(materiauZone: MateriauZone) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce matériau de la zone ?')) {
            this.materiauZoneService.removeMateriauZone(materiauZone.id).subscribe((data) => {
                    this.materiauZones = this.materiauZones!.filter(item => item.id !== materiauZone.id);
                    this.notificationService.setNotification('success', ['Materiau supprimé de la zone.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }
}
