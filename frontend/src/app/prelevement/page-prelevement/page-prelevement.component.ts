import { Component, OnInit } from '@angular/core';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-page-prelevement',
  templateUrl: './page-prelevement.component.html',
  styleUrls: ['./page-prelevement.component.scss']
})
export class PagePrelevementComponent implements OnInit {
  application: string = 'franchise';
  idParent: number;
  typePage: string = 'liste';
  franchise: Franchise;
  isNew: boolean = false;

  constructor(
      private franchiseService: FranchiseService,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (this.route.snapshot.url.length > 0 && this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'ajouter') {
          this.isNew = true;
          this.typePage = 'one';
      } else {
          if (params.idPrelevement) {
              this.typePage = 'one';
          } else {
              this.typePage = 'liste';
          }
      }
    });

    this.franchiseService.franchise.subscribe((franchise) => {
      this.franchise = franchise;
      this.idParent = franchise.id;
    });
  }

}
