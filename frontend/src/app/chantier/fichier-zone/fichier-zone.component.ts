import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { fadeIn, fadeOut } from '../../resource/animation';
import { NotificationService } from '../../notification/notification.service';
import { EnumTypeFichierGroupe, Strategie, EnumTypeFichier } from '@aleaac/shared';
import { StrategieService } from '../../resource/strategie/strategie.service';
import { ChantierService } from '../chantier.service';
import { Chantier } from '@aleaac/shared';
import { FichierService } from '../../resource/fichier/fichier.service';
import * as FileSaver from 'file-saver';
import { TypeFichier } from '../../superadmin/typefichier/type-fichier/TypeFichier';
import { TypeFichierService } from '../../superadmin/typefichier/type-fichier.service';

@Component({
    selector: 'app-fichier-zone',
    templateUrl: './fichier-zone.component.html',
    styleUrls: ['./fichier-zone.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class FichierZoneComponent implements OnInit {
    parentId: number;
    application: string = 'zone-intervention';
    groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.CHANTIER;
    typeFichier: TypeFichier;
    isLoaded: boolean = false;

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private fichierService: FichierService,
        private typeFichierService: TypeFichierService,
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.menuService.setMenu([
                    ['Strategies', '/strategie'],
                    ['Strategie', '/strategie/' + params.id + '/informations'],
                    ['Zone', '/strategie/' + params.id + '/informations'],
                    ['Plans des prélèvements', '']
                ]);
            }

            this.parentId = params.idZone;

            this.typeFichierService.get(EnumTypeFichier.CHANTIER_PLAN_PRELEVEMENTS).subscribe(tf => {
                console.log(tf);
                this.typeFichier = tf;
                this.isLoaded = true;
            });
        });
    }
}
