import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-page-processus',
  templateUrl: './page-processus.component.html',
  styleUrls: ['./page-processus.component.scss']
})
export class PageProcessusComponent implements OnInit {
  idType: number;
  idProcessus: number;
  isNew: boolean = false;
  lastPath: string;
  constructor(
      private route: ActivatedRoute,
      private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.idType) {
        this.idType = params.idType;
      }
      if (params.id) {
        this.idProcessus = params.id;
      }
      this.lastPath = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
      if (this.lastPath === 'ajouter') {
        this.isNew = true;
      } else {
        this.isNew = false;
      }
    });
  }

  setNew() {
    this.isNew = true;
  }

}
