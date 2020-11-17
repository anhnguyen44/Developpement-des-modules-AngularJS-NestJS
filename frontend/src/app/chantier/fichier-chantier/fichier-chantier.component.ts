import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { ChantierService } from '../chantier.service';
import { Chantier } from '../Chantier';
import { fadeIn, fadeOut } from '../../resource/animation';
import { NotificationService } from '../../notification/notification.service';
import { EnumTypeFichierGroupe } from '@aleaac/shared';

@Component({
    selector: 'app-fichier-chantier',
    templateUrl: './fichier-chantier.component.html',
    styleUrls: ['./fichier-chantier.component.scss'],
    animations: [fadeIn, fadeOut]
})
export class FichierChantierComponent implements OnInit {
    chantier: Chantier;
    application: string = 'chantier';
    groupeTypeFicher: EnumTypeFichierGroupe = EnumTypeFichierGroupe.CHANTIER;

    constructor(
        private menuService: MenuService,
        private route: ActivatedRoute,
        private chantierService: ChantierService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.menuService.setMenu([
                    ['Chantiers', '/chantier'],
                    ['Chantier', '/chantier/' + params.id + '/informations'],
                    ['Fichiers', '']
                ]);
                this.chantierService.get(params.id).subscribe((chantier) => {
                    this.chantier = chantier;
                    this.menuService.setMenu([
                        ['Chantiers', '/chantier'],
                        ['Chantier - ' + chantier.nomChantier, '/chantier/' + params.id + '/informations'],
                        ['Fichiers', '']
                    ]);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                    console.error(err);
                });
            }
        });
    }

}
