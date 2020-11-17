import { Component, OnInit } from '@angular/core';
import { ContenuMenuService } from '../../resource/menu/contenu-menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../notification/notification.service';
import { ContenuMenu } from '@aleaac/shared';
import { MenuService } from '../../menu/menu.service';
import { QueryBuild } from '../../resource/query-builder/QueryBuild';
import { MenuDefini } from '@aleaac/shared';
import { ChampDeRecherche } from '../../resource/query-builder/recherche/ChampDeRecherche';
import { FichierService } from '../../resource/fichier/fichier.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-liste-contenu',
  templateUrl: './liste-contenu.component.html',
  styleUrls: ['./liste-contenu.component.scss']
})
export class ListeContenuComponent implements OnInit {
  id: number;
  listeContenusByMenu: ContenuMenu[];
  nbObjets: number;
  menu: MenuDefini;
  listeContenuElasTest: string[];
  express: string;

  constructor(
    private contenuMenuService: ContenuMenuService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private menuService: MenuService,
    private router: Router,
    private fichierService: FichierService

  ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.express = params['express'];
      // this.getContenusByMenuId(this.id);
      this.getAllContenusDeMenu();
      this.countContenus();
      if (this.id) {
        this.countContenusElas();
        this.menuService.getMenuById(this.id).subscribe(menuId => {
          this.menuService.setMenu([
            ['Acceuil', '/dashboard'],
            [this.transform(menuId.titre, ['20']), '/contenu/liste/' + menuId.id]
          ]);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.log(err);
        });
        this.getListElasticSearch(this.queryBuild);
      }

      if (this.express) {
        console.log(this.express);
        this.countContenusElasByUrl();
        this.menuService.getMenuByUrl(this.express).subscribe(menuExpress => {
          this.menuService.setMenu([
            [this.transform(menuExpress.menuParent!.titre, ['20']), ''],
            [this.transform(menuExpress.titre, ['20']), '/contenu/listeArticle/' + menuExpress.url]
          ]);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.log(err);
        });
        this.getListElasticSearchUrl(this.queryBuild);
      }
    });
  }

  champDeRecherches: ChampDeRecherche[] = [
    new ChampDeRecherche('Title', 'text', 'contenu-menu.titre', true, false),
    new ChampDeRecherche('Intro', 'text', 'contenu-menu.intro', true, true),
    new ChampDeRecherche('Categorie', 'text', 'categorie-menu.titre', true, true),
    new ChampDeRecherche('contenu', 'text', 'contenu-menu.contenu', true, true),
  ];

  queryBuild: QueryBuild = new QueryBuild(10, 1);

  ngOnInit() {
    this.countContenusElas();
    //   this.menuService.menudefini.subscribe((menu) => {
    //     this.menu = menu;
    //     this.getAllContenusDeMenu();
    //     this.countContenus();
    // }, err => {
    //     console.error(err);
    // });
    this.getListElasticSearch(this.queryBuild);
  }

  getAllContenusDeMenu() {
    console.log(this.queryBuild);
    if (this.id) {
      this.contenuMenuService.getContenusByMenuId2(this.id, this.queryBuild).subscribe(dataCon => {
        this.listeContenusByMenu = dataCon;
        console.log(dataCon);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.log(err);
      });
    }
    if (this.express) {
      this.contenuMenuService.getContenusByUrl(this.express, this.queryBuild).subscribe(dataCon => {
        this.listeContenusByMenu = dataCon;
        console.log(dataCon);
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.log(err);
      });
    }
  }

  countContenus() {
    if (this.id) {
      this.contenuMenuService.countAll(this.id, this.queryBuild).subscribe((count) => {
        this.nbObjets = count;
        console.log(count);
      }, err => {
        console.error(err);
      });
    }
    if (this.express) {
      this.contenuMenuService.countAllUrl(this.express, this.queryBuild).subscribe((count) => {
        this.nbObjets = count;
        console.log(count);
      }, err => {
        console.error(err);
      });
    }
  }

  countContenusElas() {
    this.contenuMenuService.countElas(this.id, this.queryBuild).subscribe((num) => {
      this.nbObjets = num;
      console.log(num);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.log(err);
    });
  }

  countContenusElasByUrl() {
    this.contenuMenuService.countElasByUrl(this.express, this.queryBuild).subscribe((num) => {
      this.nbObjets = num;
      console.log(num);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue']);
      console.log(err);
    });
  }

  // getContenusByMenuId(id: number){
  //   this.contenuMenuService.getContenusByMenuId(id).subscribe(data=>{
  //     this.listeContenusByMenu = data;
  //     this.menuService.getMenuById(id).subscribe(data2=>{
  //       this.menuService.setMenu([
  //         ['Acceuil', '/dashboard'],
  //         [data2.titre, '']
  //     ]);
  //     },err=>{
  //       this.notificationService.setNotification('danger',['Une erreur est survenue.']);
  //       console.log(err);
  //     });
  //     console.log(this.listeContenusByMenu);

  //   },err=>{
  //     this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
  //     console.log(err);
  //   });
  // }

  getListElasticSearch(queryBuild: QueryBuild) {
    console.log('test');
    console.log(this.id);
    console.log(queryBuild);
    let temp = 0;
    // this.contenuMenuService.getListElastic(this.id,queryBuild).subscribe(dataElas=>{
    //   this.countContenusElas();
    //   // this.nbObjets = dataElas.length;
    //   this.listeContenuElasTest = dataElas;
    //   this.listeContenuElasTest.forEach(conElas=>{
    //     if(conElas['MiniautureURL']!=null){
    //       this.fichierService.getFichierById(conElas['MiniautureURL']).subscribe(fi=>{
    //         conElas['MiniautureURL'] = "http://localhost:4242/api/v1/fichier/affiche/"+fi.keyDL;
    //       },err=>{
    //         this.notificationService.setNotification('danger',['Une erreur est survenue']);
    //         console.log(err);
    //       });
    //     }else{
    //       conElas['MiniautureURL'] = "";
    //     }
    //     console.log(conElas);
    //   },err=>{
    //     this.notificationService.setNotification('danger',['Une erreur est survenue.']);
    //     console.log(err);
    //   });

    //   console.log(dataElas);
    // },err=>{
    //   this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
    //   console.log(err);
    // });
    console.log(temp);


    this.fichierService.getAll('contenu', 0).subscribe(listIma => {
      console.log(listIma);
      this.contenuMenuService.getListElastic(this.id, queryBuild).subscribe(dataList => {
        this.listeContenuElasTest = dataList;
        console.log(dataList);
        this.listeContenuElasTest.forEach(e => {

          if (e['MiniautureURL'] != 'null') {
            console.log(e['MiniautureURL']);
            let num = parseInt(e['MiniautureURL'], 10);
            let fi = listIma.filter(fichier => fichier.id == num);
            console.log(fi[0]);
            if (fi[0]) {
              e['MiniautureURL'] = environment.api + '/fichier/affiche/' + fi[0].keyDL;
            }
            // e['MiniautureURL'] = "http://localhost:4242/api/v1/fichier/affiche/"+fi[0].keyDL;
          }
        });
        this.countContenusElas();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.log(err);
      });
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.log(err);
    });
    console.log(this.listeContenuElasTest);
  }


  getListElasticSearchUrl(queryBuild: QueryBuild) {
    console.log('test');
    console.log(this.express);
    console.log(queryBuild);
    let temp = 0;
    console.log(temp);


    this.fichierService.getAll('contenu', 0).subscribe(listIma => {
      console.log(listIma);
      this.contenuMenuService.getListElasticUrl(this.express, queryBuild).subscribe(dataList => {
        this.listeContenuElasTest = dataList;
        console.log(dataList);
        this.listeContenuElasTest.forEach(e => {

          if (e['MiniautureURL'] != 'null') {
            console.log(e['MiniautureURL']);
            let num = parseInt(e['MiniautureURL'], 10);
            let fi = listIma.filter(fichier => fichier.id == num);
            console.log(fi[0]);
            if (fi[0]) {
              e['MiniautureURL'] = "http://localhost:4242/api/v1/fichier/affiche/" + fi[0].keyDL;
            }
            // e['MiniautureURL'] = "http://localhost:4242/api/v1/fichier/affiche/"+fi[0].keyDL;
          }
        });
        this.countContenusElas();
      }, err => {
        this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
        console.log(err);
      });
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.log(err);
    });
    console.log(this.listeContenuElasTest);
  }

  setQueryBuild(queryBuild: QueryBuild) {
    this.queryBuild = queryBuild;
    this.getListElasticSearch(this.queryBuild);
    if (this.queryBuild.needCount) {
      this.countContenusElas();
    }
    this.getAllContenusDeMenu();
  }

  public gotoDetails(url, contenu) {
    this.router.navigate([url, contenu.id]).then((e) => {
      if (e) {
        // console.log('Navigation is successful!');
      } else {
        // console.log('Navigation has failed!');
      }
    });
  }

  public gotoDetails1(url, expression) {
    this.router.navigate([url, this.escapeRegExp(expression)]).then((e) => {
      if (e) {
        // console.log('Navigation is successful!');
      } else {
        // console.log('Navigation has failed!');
      }
    });
  }

  escapeRegExp(s: string) {
    s = s.toLowerCase();
    s = s.split(' ').join('-');
    s = s.replace(/è|é|ê/g, 'e');
    s = s.replace(/à/g, 'a');
    s = s.replace(/ô/g, 'o');
    s = s.replace(/û/g, 'u');
    s = s.replace(/ç/g, 'c');
    s = s.replace(/'/g, '-');
    s = s.trim();
    return s;
  }

  transform(value: string, args: string[]): string {
    const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
    const trail = args.length > 1 ? args[1] : '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }


}
