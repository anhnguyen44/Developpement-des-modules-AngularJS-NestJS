import { Component, OnInit, AfterViewChecked, Output, ChangeDetectorRef, EventEmitter, Input } from '@angular/core';
import { fadeIn, fadeOut } from '../../resource/animation';
import { Recherchable } from '../../resource/query-builder/recherche/Recherchable';
import { QueryBuildable, QueryBuild } from '../../resource/query-builder/QueryBuild';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { Chantier, ProcessusZone, EnumResultatExamenAmiante } from '@aleaac/shared';
import { Order } from '../../resource/query-builder/order/Order';
import { MenuService } from '../../menu/menu.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../notification/notification.service';
import { ChantierService } from '../chantier.service';
import { ProcessusZoneService } from '../../resource/processus-zone/processus-zone.service';

@Component({
    selector: 'app-liste-processus-zone',
    templateUrl: './liste-processus-zone.component.html',
    styleUrls: ['./liste-processus-zone.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class ListeProcessusZoneComponent implements OnInit, AfterViewChecked, Recherchable, QueryBuildable {
    champDeRecherches: ChampDeRecherche[];
    idZone: number;
    idChantier: number;
    chantier: Chantier;
    processusZones: ProcessusZone[];
    nbObjets: number;
    defaultOrder: Order = new Order('Réf', '', true, 'processusZone.id', 'DESC');
    modalProcessusZone: boolean = false;
    enumScore: typeof EnumResultatExamenAmiante = EnumResultatExamenAmiante;

    @Input() canEdit: boolean = true;
    @Output() emitCreateProcessus: EventEmitter<any> = new EventEmitter<any>();
    @Output() emitSelectProcessus: EventEmitter<ProcessusZone> = new EventEmitter<ProcessusZone>();

    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Réf', 'grow0', false, 'processusZone.id'),
        new Order('Libellé', '', false, 'processusZone.libelle'),
        new Order('Taches', '', false, 'processusZone.libelle'),
        new Order('Action', 'action'),
    ];

    constructor(
        private menuService: MenuService,
        private processusZoneService: ProcessusZoneService,
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
            this.getProcessusZone();
            this.chantierService.get(this.idChantier).subscribe(data => {
                this.chantier = data;
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        });
    }

    ngAfterViewChecked(): void {
        try {
            this.cdRef.detectChanges();
        } catch (e) { }
    }

    getProcessusZone() {
        this.processusZoneService.getByZoneId(this.idZone).subscribe((processusZones) => {
            this.processusZones = processusZones;
        }, err => {
            console.error(err);
        });
    }

    countProcessusZone() {
        this.processusZoneService.getByZoneId(this.idZone).subscribe((count) => {
            this.nbObjets = count.length;
            console.log(this.nbObjets);
        }, err => {
            console.error(err);
        });
    }

    goToDetail(processusZone: ProcessusZone) {
        //this.router.navigate(['chantier', this.idChantier, 'sites', processusZone.id], { skipLocationChange: true });
        this.emitSelectProcessus.emit(processusZone);
    }

    setAllChecked(event) {
        if (this.processusZones) {
            this.processusZones.forEach(dc => dc.selected = event);
        }
    }

    isAllChecked() {
        if (this.processusZones) {
            return this.processusZones.every(dc => dc.selected !== undefined ? dc.selected : false);
        } else {
            return false;
        }
    }

    setQueryBuild(queryBuild): void {
        // console.log(queryBuild);
        this.queryBuild = queryBuild;
        if (this.queryBuild.needCount) {
            this.countProcessusZone();
        }
        this.getProcessusZone();
    }

    emitNouveauProcessus(event) {
        this.emitCreateProcessus.emit(event);
    }

    delete(processusZone: ProcessusZone) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce processus de la zone ?')) {
            this.processusZoneService.removeProcessusZone(processusZone.id).subscribe((data) => {
                this.processusZones = this.processusZones!.filter(item => item.id !== processusZone.id);
                this.notificationService.setNotification('success', ['Processus supprimé de la zone.']);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }
}
