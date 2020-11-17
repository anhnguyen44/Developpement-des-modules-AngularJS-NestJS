import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-menu-contact',
  templateUrl: './menu-contact.component.html',
  styleUrls: ['./menu-contact.component.scss']
})
export class MenuContactComponent implements OnInit {
    idType: number;
    type: string;
    activeMenu: string;
    activeSousMenu: string | null;
    baseUrl: string;
    idProcessus: number | null;
  constructor(
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
      if (this.route.snapshot.url[0].path === 'compte') {
          this.type = 'compte';
          this.baseUrl = '/contact/compte';
      } else {
          this.type = 'contact';
          this.baseUrl = '/contact/contact';
      }

      if (this.route.snapshot.url.length === 2) {
          this.activeMenu = 'ajouter';
      } else {
          this.idType = Number(this.route.snapshot.url[1].path);
          if (this.route.snapshot.url[2].path === 'modifier') {
              this.activeMenu = 'modifier';
          }
          if (this.route.snapshot.url[2].path === 'activite') {
              this.activeMenu = 'activite';
          }
          if (this.route.snapshot.url[2].path === 'processus') {
              this.activeMenu = 'processus';
              this.route.params.subscribe((params) => {
                  if (params.id) {
                      this.idProcessus = params.id;
                      this.activeSousMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
                  }
              });
          } else {
              this.idProcessus = null;
              this.activeSousMenu = null;
          }
          if (this.route.snapshot.url[2].path === 'historique') {
            this.activeMenu = 'historique';
        }
      }

  }
}
