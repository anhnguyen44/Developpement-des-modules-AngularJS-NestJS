import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFranchise } from '@aleaac/shared';
import { Router } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';
import { Recherchable } from '../../../resource/query-builder/recherche/Recherchable';
import { ChampDeRecherche } from '../../../resource/query-builder/recherche/ChampDeRecherche';
import { Paginable } from '../../../resource/query-builder/pagination/Paginable';
import { QueryBuild } from '../../../resource/query-builder/QueryBuild';
import { Order } from '../../../resource/query-builder/order/Order';
import { Menu } from '../../../menu/Menu';
import { MenuDefini } from '@aleaac/shared';
import { NotificationService } from '../../../notification/notification.service';
import { UserStore } from '../../../resource/user/user.store';
import { CategorieMenu } from '@aleaac/shared';
import { ContenuMenu } from '@aleaac/shared';
import { CategorieMenuService } from '../../../resource/menu/categorie-menu.service';
import { ContenuMenuService } from '../../../resource/menu/contenu-menu.service';
import { isNull } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-liste-menu',
  templateUrl: './liste-menu.component.html',
  styleUrls: ['./liste-menu.component.scss']
})
export class ListeMenuComponent implements OnInit, Recherchable, Paginable {

  @Input() isSuperAdmin: boolean;
  @Input() isModal: boolean = false;

  listeMenu: MenuDefini[];
  listeCate: CategorieMenu[];
  listeContenu: ContenuMenu[];
  contenuChange: ContenuMenu;
  categorieChange: CategorieMenu;

  constructor(private menuService: MenuService,
    private notificationService: NotificationService,
    private userStore: UserStore,
    private router: Router,
    private categorieMenuService: CategorieMenuService,
    private contenuMenuService: ContenuMenuService,
  ) { }

  canCreateMenu: Promise<boolean>;
  nbObjets: number = 10;
  champDeRecherches: ChampDeRecherche[] = [
    new ChampDeRecherche('Title', 'text', 'menu-defini.titre', true, true),
    new ChampDeRecherche('URL', 'text', 'menu-defini.url', true, true),
    new ChampDeRecherche('Name', 'text', 'menu-defini.name', true, true),
    new ChampDeRecherche('visible', 'checkbox', 'menu-defini.visible', false, true),
  ];

  queryBuild: QueryBuild = new QueryBuild();
  headers: Order[] = [
    new Order('Titre Menu', '', true, 'menu-defini.titre'),
    new Order('URL', 'grow2', true, 'menu-defini.url'),
    new Order('Name', 'grow3', true, 'menu-defini.name'),
    new Order('Permissions', 'grow2', false, 'menu-defini.permission'),
    new Order('Action', 'action'),
  ];

  ngOnInit() {
    this.menuService.setMenu([
      ['Admin de contenu', '/contenu-admin'],
      ['Menus', '']
    ]);

    this.userStore.user.subscribe(() => {
      this.canCreateMenu = this.userStore.hasRight('MENUS_CREATE');
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });

    this.categorieMenuService.getAllCategorieMenu(this.queryBuild).subscribe(cate => {
      this.listeCate = cate;
      console.log(this.listeCate);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.log(err);
    });
    this.contenuMenuService.getAllContenus(this.queryBuild).subscribe(contenu => {
      this.listeContenu = contenu;
      // console.log(this.listeContenu);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.log(err);
    });

    this.getAll();

  }

  getAll() {
    //Get listes de menus
    this.menuService.getAllMenus(this.queryBuild).subscribe((data) => {
      this.listeMenu = data;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est servenue.']);
    });
  }


  supprimer(menu: MenuDefini) {
    // console.log(menu.id);
    if (confirm('Êtes-vous sûr de vouloir supprimer cet menu ?')) {
      this.listeMenu = this.listeMenu!.filter(item => item.id !== menu.id);
      console.log(this.listeCate);
      this.listeMenu.forEach(menuE => {
        if (menuE.url.includes(menu.url)) {
          menuE.url = menuE.url.substr(menu.url.length);
          this.menuService.updateMenu(menuE).subscribe(() => {
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
          });
        }
      });
      this.listeCate.forEach(cateEle => {
        if (cateEle.menu !== null) {
          if (cateEle.url.includes(menu.url)) {
            cateEle.url = cateEle.url.substr(menu.url.length);
            this.categorieMenuService.updateCategorieMenu(cateEle).subscribe(() => {
            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
              console.log(err);
            });
          }
        }
      });

      this.contenuMenuService.getContenusByMenuId(menu.id).subscribe(listArti => {
        this.listeContenu = listArti;
        // console.log(listArti);
        this.listeContenu.forEach(e1 => {
          e1.menu = new MenuDefini();
          delete e1!.miniature;
          this.contenuMenuService.updateContenuMenu(e1).subscribe(() => {

          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
          });
        });
        this.categorieMenuService.getCateParMenuId(menu.id).subscribe(listCate => {
          this.listeCate = listCate;
          this.listeCate.forEach(e2 => {
            e2.menu = new MenuDefini();
            this.categorieMenuService.updateCategorieMenu(e2).subscribe(() => {

            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
              console.log(err);
            });
          });
          this.menuService.getAllMenuParMenuId(menu.id).subscribe((listMenuData) => {
            listMenuData.forEach(e3 => {
              e3.menuParent = new MenuDefini();
              this.menuService.updateMenu(e3).subscribe(() => {
                // this.listeMenu = this.listeMenu!.filter(item => item.id !== menu.id);
              }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
                console.log(err);
              });
            });
            this.menuService.removeMenu(menu.id).subscribe(() => {
              this.notificationService.setNotification('success', ['Menu supprimé.']);
            }, err => {
              this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
              console.error(err);
            });
          }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
          });
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.log(err);
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

  public gotoDetails(url, menu) {
    this.router.navigate([url, menu.id]).then((e) => {
      if (e) {
        // console.log('Navigation is successful!');
      } else {
        // console.log('Navigation has failed!');
      }
    });
  }
}
