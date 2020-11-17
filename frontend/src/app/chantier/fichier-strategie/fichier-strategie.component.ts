import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { fadeIn, fadeOut } from '../../resource/animation';
import { NotificationService } from '../../notification/notification.service';
import { EnumTypeFichierGroupe, Strategie, EnumTypeObjectifs } from '@aleaac/shared';
import { StrategieService } from '../../resource/strategie/strategie.service';
import { ChantierService } from '../chantier.service';
import { Chantier } from '@aleaac/shared';
import { FichierService } from '../../resource/fichier/fichier.service';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-fichier-strategie',
    templateUrl: './fichier-strategie.component.html',
    styleUrls: ['./fichier-strategie.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class FichierStrategieComponent implements OnInit {
    strategie: Strategie;
    chantier: Chantier;
    parentId: number;
    application: string = 'chantier';
    groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.CHANTIER;
    isLoaded: boolean = false;
    enumTypeObjectifs: typeof EnumTypeObjectifs = EnumTypeObjectifs;

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private strategieService: StrategieService,
        private chantierService: ChantierService,
        private notificationService: NotificationService,
        private fichierService: FichierService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.chantierService.get(params.id).subscribe((chantier) => {
                    this.chantier = chantier;

                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + this.chantier.nomChantier, '/chantier/' + this.chantier.id + '/informations'],
                        ['Stratégies (V ' + chantier.versionStrategie + ')', '/chantier/' + this.chantier.id + '/strategie/liste'],
                        ['Documents', ''],
                    ]);

                    if (this.chantier.hasRDVPrealable && (!this.chantier.txtRDVPrealable || this.chantier.txtRDVPrealable === '')) {
                        this.chantier.txtRDVPrealable = 'Une visite préalable a été réalisée sur site le XX/XX/XXX par M. XXXX en compagnie de M. XXXX (Société, etc.). La stratégie a été validée.';
                    }
                    this.parentId = params.id;
                    if (params.idStrategie) {
                        this.strategieService.getStrategieById(params.idStrategie).subscribe((strategie) => {
                            this.application = 'strategie';
                            this.parentId = params.idStrategie;
                            this.strategie = strategie;
                            this.isLoaded = true;
                        });
                    } else {
                        this.isLoaded = true;
                    }
                });
            }
        });
    }

    changeCofrac(isCofrac: boolean) {
        this.chantier.isCOFRAC = isCofrac;
        if (isCofrac) {
            this.chantier.justifNonCOFRAC = '';
        }
    }

    changeRDV(hasRDV: boolean) {
        this.chantier.hasRDVPrealable = hasRDV;
        if (!hasRDV) {
            this.chantier.txtRDVPrealable = '';
        } else {
            this.chantier.txtRDVPrealable = 'Une visite préalable a été réalisée sur site le XX/XX/XXX par M. XXXX en compagnie de M. XXXX (Société, etc.). La stratégie a été validée.';
        }
    }

    generateStrategie() {
        this.chantierService.update({...this.chantier, selected: true}).subscribe(() => {
            this.chantierService.generateStrategie(this.chantier.id).subscribe((fichier) => {
                this.fichierService.get(fichier.keyDL).subscribe((file) => {
                    const filename = fichier.nom + '.' + fichier.extention;
                    FileSaver.saveAs(file, filename);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.error(err);
            });
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
    }
}
