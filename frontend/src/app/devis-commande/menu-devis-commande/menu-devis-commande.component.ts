import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-menu-devis-commande',
  templateUrl: './menu-devis-commande.component.html',
  styleUrls: ['./menu-devis-commande.component.scss']
})
export class MenuDevisCommandeComponent implements OnInit {
  id: number;
  activeMenu: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
    });
      if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'modifier' ||
          this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter') {
        this.activeMenu = 'information';
      } else {
          this.activeMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
      }
  }

}
