import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-menu-admin-contenu',
  templateUrl: './menu-admin-contenu.component.html',
  styleUrls: ['./menu-admin-contenu.component.scss']
})
export class MenuAdminContenuComponent implements OnInit {
  activeMenu: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.activeMenu = this.route.snapshot.url[0].path;
  }

}
