import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MenuService} from '../../menu/menu.service';

@Component({
  selector: 'app-historique-activite',
  templateUrl: './historique-activite.component.html',
  styleUrls: ['./historique-activite.component.scss']
})
export class HistoriqueActiviteComponent implements OnInit {

    idParent: number;
    application: string = 'activite';

    constructor(private route: ActivatedRoute,
                private menuService: MenuService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.idParent = params.id;
            this.menuService.setMenu([
                ['Activités', '/contact/activite'],
                ['Historique de l\'activité #' + params.id, '']
            ]);
        });

    }
}
