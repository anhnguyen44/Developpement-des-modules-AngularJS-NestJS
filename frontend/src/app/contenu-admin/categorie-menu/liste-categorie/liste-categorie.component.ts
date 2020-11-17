import { Component, OnInit, Input } from '@angular/core';
import { IFranchise, MenuDefini, ContenuMenu } from '@aleaac/shared';
import { Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { Order } from '../../../resource/query-builder/order/Order';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { NotificationService } from '../../../notification/notification.service';
import { CategorieMenuService } from '../../../resource/menu/categorie-menu.service';
import { CategorieMenu } from '@aleaac/shared';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';
import { ContenuMenuService } from '../../../resource/menu/contenu-menu.service';

@Component({
  selector: 'app-liste-categorie',
  templateUrl: './liste-categorie.component.html',
  styleUrls: ['./liste-categorie.component.scss']
})
export class ListeCategorieComponent implements OnInit {
  @Input() isModal: boolean = false;

  listeCates: CategorieMenu[];
  list = new Array<ContenuMenu>();

  constructor(
    private menuService: MenuService,
    private categorieMenuService: CategorieMenuService,
    private notificationService: NotificationService,
    private router: Router,
    private contenuMenuService: ContenuMenuService
  ) { }

  queryBuild: QueryBuild = new QueryBuild();
  queryBuild2: QueryBuild = new QueryBuild();

  champDeRecherches: ChampDeRecherche[] = [
    new ChampDeRecherche('Title', 'text', 'categorie-menu.titre', true, true),
    new ChampDeRecherche('URL', 'text', 'categorie-menu.url', true, true),
    new ChampDeRecherche('Menu', 'text', 'menu_defini.titre', true, true),
  ];

  headers: Order[] = [
    new Order('Titre categorie', 'grow2', true, 'categorie-menu.titre'),
    new Order('URL', 'grow4', true, 'categorie-menu.url'),
    new Order('Menu', 'grow3', true, 'menu_defini.titre'),
    new Order('Action', 'action'),
  ];

  ngOnInit() {
    this.menuService.setMenu([
      ['Admin de contenu', '/contenu-admin'],
      ['Categorie', '']
    ]);
    this.getAll();
  }

  getAll() {
    this.categorieMenuService.getAllCategorieMenu(this.queryBuild).subscribe(data => {
      this.listeCates = data;
      // console.log(data);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.log(err);
    });
  }

  supprimer(cate: CategorieMenu) {
    // console.log(cate);
    if (confirm('Êtes-vous sûr de vouloir supprimer cet categorie ?')) {
      this.contenuMenuService.getAllContenus(this.queryBuild2).subscribe((listeContenus) => {
        this.list = listeContenus;
        this.list.forEach(e => {
          if (e.categorie !== null) {
            if (e.categorie.id == cate.id) {
              e.categorie = new CategorieMenu();
              delete e!.miniature;
              console.log(e.categorie.id);
              this.contenuMenuService.updateContenuMenu(e).subscribe(() => {
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
              });
            }
          }
        });
        cate.menu = new MenuDefini();
        this.categorieMenuService.removeCate(cate.id).subscribe(dataSup => {
          this.notificationService.setNotification('success', ['Categorie supprimée.']);
          this.listeCates = this.listeCates!.filter(item => item.id !== cate.id);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        });
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.log(err);
      });
    }
  }

  setQueryBuild(queryBuild) {
    this.queryBuild = queryBuild;
    this.getAll();
  }

  public gotoDetails(url, cate) {
    this.router.navigate([url, cate.id]).then((e) => {
      if (e) {
        // console.log('Navigation is successful!');
      } else {
        // console.log('Navigation has failed!');
      }
    });
  }
}
