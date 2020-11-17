import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-formation',
  templateUrl: './menu-formation.component.html',
  styleUrls: ['./menu-formation.component.scss']
})
export class MenuFormationComponent implements OnInit {
  id: number;
  activeMenu: string;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log('Affichage id dans menu formation');
      console.log(this.id);
    });

    if (!this.id) {
      this.activeMenu = 'information';
    } else {
      if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'modifier' ||
        this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter') {
        this.activeMenu = 'information';
        if (this.route.snapshot.url[this.route.snapshot.url.length - 2].path === 'stagiaire') {
          this.activeMenu = 'stagiaire';
        }
        if (this.route.snapshot.url[this.route.snapshot.url.length - 3]) {
          if (this.route.snapshot.url[this.route.snapshot.url.length - 3].path === 'stagiaire') {
            this.activeMenu = 'stagiaire';
          }
        }
      }
      else {
        this.activeMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
      }
    }

    console.log((this.route.snapshot.url[this.route.snapshot.url.length - 2].path));

  }

}