import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { MenuService } from '../../../menu/menu.service';

@Component({
  selector: 'app-historique-tarif',
  templateUrl: './historique-tarif.component.html',
  styleUrls: ['./historique-tarif.component.scss']
})
export class HistoriqueTarifComponent implements OnInit {
  application: string = 'grille-tarif';
  idParent: number;

  constructor(private route: ActivatedRoute,
              private menuService: MenuService) { }

  ngOnInit() {
      this.menuService.setMenu([
          ['Paramétrage', '/parametrage'],
          ['Grilles tarif', '/parametrage/grille-tarif-liste'],
          ['Historique', '']
      ]);
    this.route.params.subscribe((params) => {
      this.idParent = params.id;
    });
  }

}
