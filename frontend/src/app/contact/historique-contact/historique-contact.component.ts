import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../menu/menu.service';

@Component({
  selector: 'app-historique-contact',
  templateUrl: './historique-contact.component.html',
  styleUrls: ['./historique-contact.component.scss']
})
export class HistoriqueContactComponent implements OnInit {
  application: string;
  idParent: number;

  constructor(private route: ActivatedRoute,
    private menuService: MenuService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.idParent = params.idType;
      this.application = params.type;

      this.menuService.setMenu([
        ['Comptes / Contacts', '/contact'],
        ['Historique du ' + this.application, '']
      ]);
    });
  }

}
