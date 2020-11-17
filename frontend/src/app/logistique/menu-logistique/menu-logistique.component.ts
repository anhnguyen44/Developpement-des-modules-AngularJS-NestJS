import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-menu-logistique',
  templateUrl: './menu-logistique.component.html',
  styleUrls: ['./menu-logistique.component.scss']
})
export class MenuLogistiqueComponent implements OnInit {
  activeMenu: string;
  activeAction: string;
  idEntite: number;
  activeSousMenu: string;

  constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        // URL : nomEntite/action/sousMenu?/idEntite
        this.activeMenu = this.route.snapshot.url[0].path;
        if (this.route.snapshot.url.length > 1) {
            this.activeAction = this.route.snapshot.url[1].path;
        }

        if (this.route.snapshot.url.length > 2) {
            if (!isNaN(Number(this.route.snapshot.url[2].path))) {
                this.idEntite = parseInt(this.route.snapshot.url[2].path, 10);
            } else {
                this.activeSousMenu = this.route.snapshot.url[2].path;
                this.idEntite = parseInt(this.route.snapshot.url[3].path, 10);
            }
        }
    }

}
