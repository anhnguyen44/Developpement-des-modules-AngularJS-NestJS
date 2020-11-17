import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneIntervention, IZoneIntervention, EnumTypeStrategie, EnumTypeZoneIntervention } from '@aleaac/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { Recherchable } from '../../../resource/query-builder/recherche/Recherchable';
import { Paginable } from '../../../resource/query-builder/pagination/Paginable';
import { MenuService } from '../../../menu/menu.service';
import { NotificationService } from '../../../notification/notification.service';
import { FranchiseService } from '../../../resource/franchise/franchise.service';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { Order } from '../../../resource/query-builder/order/Order';
import { ZoneInterventionService } from '../../../resource/zone-intervention/zone-intervention.service';
import { ChantierService } from '../../chantier.service';
import { StrategieService } from '../../../resource/strategie/strategie.service';


@Component({
    selector: 'app-liste-zone-intervention',
    templateUrl: './liste-zone-intervention.component.html',
    styleUrls: ['./liste-zone-intervention.component.scss']
})
export class ListeZoneInterventionComponent implements OnInit, Recherchable, Paginable {

    @Input() idStrategie: number;
    @Input() zonesIntervention: ZoneIntervention[];
    @Input() isModal: boolean = false;

    @Input() canEdit: boolean = true; // Si la strat est validée on peut pas rajouter de zone

    @Output() emitZone = new EventEmitter<ZoneIntervention>();

    idChantier: number;
    openModalImportZone: boolean = false;
    currentStrategieForImport: number;

    constructor(
        private menuService: MenuService,
        private zoneInterventionService: ZoneInterventionService,
        private router: Router,
        private notificationService: NotificationService,
        private franchiseService: FranchiseService,
        private chantierService: ChantierService,
        private strategieService: StrategieService,
        private route: ActivatedRoute,
    ) {
    }

    nbObjets: number = 25;
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Référence', 'text', 'zoneIntervention.reference', true, true),
        new ChampDeRecherche('Libellé', 'text', 'zoneIntervention.libelle', true, true),
        new ChampDeRecherche('nbPiecesUnitaires', 'text', 'zoneIntervention.nbPiecesUnitaires', true, true),
        new ChampDeRecherche('nbPrelevementsCalcul', 'text', 'zoneIntervention.nbPrelevementsCalcul', true, true),
        new ChampDeRecherche('nbPrelevementsARealiser', 'text', 'zoneIntervention.nbPrelevementsARealiser', true, true),
        new ChampDeRecherche('Bâtiment', 'text', 'zoneIntervention.batiment.nom', false, true),
    ];
    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Référence', '', false, 'zoneIntervention.refernce'),
        new Order('Libellé', '', false, 'zoneIntervention.libelle'),
        new Order('Nb PU', '', false, 'zoneIntervention.nbPiecesUnitaires'),
        new Order('Nb prél. calculé', '', false, 'zoneIntervention.nbPrelevementsCalcul'),
        new Order('Nb prél. à réaliser', '', false, 'zoneIntervention.nbPrelevementsARealiser'),
        new Order('Bâtiment', '', false, 'zoneIntervention.batiment.nom'),
        new Order('Action', 'action'),
    ];

    ngOnInit() {
        // Si on a déjà passé en entrée les zones, on cherche rien et on compte juste
        if (!this.zonesIntervention) {
            this.getZones();
        }

        if (!this.isModal) {
            this.route.params.subscribe((params) => {
                this.idChantier = params.id;

                if (params.idStrategie) {
                    this.chantierService.get(this.idChantier).subscribe((chantier) => {
                        this.menuService.setMenu([
                            ['Chantiers', '/chantier/liste'],
                            ['Chantier - ' + chantier.nomChantier, '/chantier/' + this.idChantier + '/informations'],
                            ['Stratégie', ''],
                        ]);
                    });
                }
            });
        }
    }

    getZones() {
        if (this.isModal) {
            this.route.params.subscribe((params) => {
                this.idChantier = params.id;
                this.chantierService.getZI(this.idChantier).subscribe(zis => {
                    this.zonesIntervention = zis;
                    this.strategieService.getStrategieById(this.idStrategie).subscribe((strat) => {
                        if (strat.typeStrategie === EnumTypeStrategie.SPATIALE) {
                            this.zonesIntervention = this.zonesIntervention.filter(z => z.type === EnumTypeZoneIntervention.ZH);
                        } else if (strat.typeStrategie === EnumTypeStrategie.SUIVI) {
                            this.zonesIntervention = this.zonesIntervention.filter(z => z.type === EnumTypeZoneIntervention.ZT);
                        }
                    });
                });
            });
        } else {
            if (this.idStrategie) {
                this.zoneInterventionService.getByStrategie(this.idStrategie).subscribe((data) => {
                    this.zonesIntervention = data;
                    this.nbObjets = this.zonesIntervention.length;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            } else {
                this.zoneInterventionService.getAllZoneIntervention().subscribe((data) => {
                    this.zonesIntervention = data;
                    this.nbObjets = this.zonesIntervention.length;
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        }
    }


    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        this.getZones();
        if (this.queryBuild.needCount) {
            this.nbObjets = this.zonesIntervention.length;
        }
    }

    supprimer(zone: ZoneIntervention) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
            this.zoneInterventionService.removeZoneIntervention(zone.id).subscribe((data) => {
                this.notificationService.setNotification('success', ['Zone supprimée.']);
                this.zonesIntervention = this.zonesIntervention.filter(z => z.id !== zone.id);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
    }

    public gotoDetails(url: string, zoneIntervention: ZoneIntervention) {
        const moduleToUse = 'chantier/';
        this.router.navigate([moduleToUse + this.idChantier + '/strategie/' + this.idStrategie + url, zoneIntervention.id, 'definition']);
    }

    emitZoneIntervention(zone: ZoneIntervention) {
        this.emitZone.emit(zone);
    }

    openImportModal(id: number) {
        this.currentStrategieForImport = id;
        this.openModalImportZone = true;
    }

    duplicateZone(zone: ZoneIntervention, idStrategie: number) {
        this.zoneInterventionService.duplicateZoneIntervention(zone.id, idStrategie).subscribe(zoneDup => {
            this.openModalImportZone = false;
            this.emitZone.emit(zoneDup);
        });
    }
}
