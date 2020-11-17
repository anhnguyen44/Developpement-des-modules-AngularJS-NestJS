import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiviteService } from '../activite.service';
import { Activite } from '../Activite';
import { MenuService } from '../../menu/menu.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import {QueryBuild, QueryBuildable} from '../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../notification/notification.service';
import {Order} from '../../resource/query-builder/order/Order';
import {ChampDeRecherche} from '../../resource/query-builder/recherche/ChampDeRecherche';
import {CategorieService} from '../categorie.service';
import {profils} from '@aleaac/shared';
import * as FileSaver from 'file-saver';
import {UserStore} from '../../resource/user/user.store';
import {Franchise} from '../../resource/franchise/franchise';

@Component({
  selector: 'app-liste-activite',
  templateUrl: './liste-activite.component.html',
  styleUrls: ['./liste-activite.component.scss']
})
export class ListeActiviteComponent implements OnInit, QueryBuildable{
  idType: number;
  type: string;
  activites: Activite[];
  nbObjets: number;
  queryBuild: QueryBuild = new QueryBuild();
  champDeRecherches: ChampDeRecherche[] = [];
  canExport: boolean;
  franchise: Franchise;
  headers: Order[] = [
      new Order('Contact', '', ),
      new Order('Date', '', true, 'activite.date'),
      new Order('Durée', '', true, 'activite.duree'),
      new Order('Catégorie', '', true, 'categorie.nom'),
      new Order('Objet', '', true, 'activite.objet'),
      new Order('Utilisateur', ''),
      new Order('Action', 'action'),
  ];
  constructor(
    private route: ActivatedRoute,
    private activiteService: ActiviteService,
    private router: Router,
    private menuService: MenuService,
    private franchiseService: FranchiseService,
    private notificationService: NotificationService,
    private categorieService: CategorieService,
    private userStore: UserStore
  ) { }

  ngOnInit() {
      this.userStore.hasProfil(profils.FRANCHISE).then((data) => {
          this.canExport = data;
      });
      this.franchiseService.franchise.subscribe((franchise) => {
          this.franchise = franchise;
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
    });
      this.categorieService.getAll().subscribe((categories) => {
          this.champDeRecherches = [
              new ChampDeRecherche('Date', 'text', 'activite.date', true, true),
              new ChampDeRecherche('Durée', 'text', 'activite.duree', true, true),
              new ChampDeRecherche('Catégorie', 'list', 'activite.idCategorie', false, true, categories.map((categorie) => {
                  return {id: categorie.id, nom: categorie.nom};
              })),
              new ChampDeRecherche('Objet', 'text', 'activite.objet', true, true)
          ];
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.error(err);
    });
    this.route.params.subscribe((params) => {
      this.idType = params.idType;
      this.type = params.type;
      // Depuis le module compte/contact
      if (this.type && this.idType) {
          this.menuService.setMenu([
            ['Comptes / Contacts', '/contact'],
            ['Activités du ' + this.type, '']
          ]);
      } else {
        // Depuis le module Activité
        this.menuService.setMenu([
          ['Activités', ''],
        ]);
      }
      this.getAll();
      this.countAll();
    });
  }

  getAll() {
      if (this.type && this.idType) {
          this.activiteService.getListe(this.type, this.idType, this.queryBuild).subscribe((activites) => {
              this.activites = activites;
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
      } else {
          this.franchiseService.franchise.subscribe((franchise) => {
              this.activiteService.getAll(franchise.id, this.queryBuild).subscribe((activites) => {
                  this.activites = activites;
              });
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
      }
  }

  countAll() {
      if (this.type && this.idType) {
          this.activiteService.countListe(this.type, this.idType, this.queryBuild).subscribe((nbObjets) => {
              this.nbObjets = nbObjets;
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
      } else {
          this.activiteService.countAll(this.franchise.id, this.queryBuild).subscribe((nbObjets) => {
              this.nbObjets = nbObjets;
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });
      }
  }

  goToDetail(url) {
    this.router.navigate([url]);
  }

  delete(id) {
    this.activiteService.deleteActivite(id).subscribe(data => {
      this.notificationService.setNotification('warning', ['L\'activité a été supprimée.']);
      this.ngOnInit();
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
    });
  }

  setQueryBuild(queryBuild: QueryBuild): void {
    this.queryBuild = queryBuild;
    console.log(this.queryBuild);
    if (queryBuild.needCount) {
      this.countAll();
    }
    this.getAll();
  }

    generateXlsx() {
        this.activiteService.generateXlsx(this.franchise.id).subscribe((xlsx) => {
            FileSaver.saveAs(xlsx, 'export.xlsx');
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.error(err);
      });
    }

}
