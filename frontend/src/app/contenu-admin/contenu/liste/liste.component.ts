import {Component, OnInit, Query, Input} from '@angular/core';
import {IFranchise, ContenuMenu} from '@aleaac/shared';
import {Router} from '@angular/router';
import {MenuService} from '../../../menu/menu.service';
import {ContenuMenuService} from '../../../resource/menu/contenu-menu.service';
import {NotificationService} from '../../../notification/notification.service';
import {QueryBuild} from '../../../resource/query-builder/QueryBuild';
import {Order} from '../../../resource/query-builder/order/Order';
import {UserStore} from '../../../resource/user/user.store';
import {ChampDeRecherche} from '../../../resource/query-builder/recherche/ChampDeRecherche';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-liste',
    templateUrl: './liste.component.html',
    styleUrls: ['./liste.component.scss']
})
export class ListeComponent implements OnInit {
    @Input() isModal: boolean = false;
    listeContenus: ContenuMenu[];
    contenu: ContenuMenu;

    constructor(
        private menuService: MenuService,
        private contenuMenuService: ContenuMenuService,
        private notificationService: NotificationService,
        private userStore: UserStore,
        private router: Router
    ) {
    }

    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Title', 'text', 'contenu-menu.titre', true, false),
        new ChampDeRecherche('Menu', 'text', 'menu_defini.titre', true, true),
        new ChampDeRecherche('Categorie', 'text', 'categorie-menu.titre', true, true),
    ];

    canCreateContenu: Promise<boolean>;

    queryBuild: QueryBuild = new QueryBuild();
    headers: Order[] = [
        new Order('Titre', 'grow3', true, 'contenu-menu.titre'),
        new Order('Menu', 'grow3', true, 'menu_defini.titre'),
        new Order('Categorie', 'grow3', true, 'categorie-menu.titre'),
        new Order("Date création", 'grow2', true, 'contenu-menu.dateAjout'),
        new Order('Date MAJ', 'grow2', true, 'contenu-menu.dateMisAJour'),
        new Order('Action', 'action'),
    ];

    ngOnInit() {
        this.menuService.setMenu([
            ['Admin de contenu', '/contenu-admin'],
            ['Contenus', '']
        ]);

        this.userStore.user.subscribe(() => {
            this.canCreateContenu = this.userStore.hasRight('CONTENU_MENU_CREATE');
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.error(err);
        });


        this.getAll();

    }

    getAll() {
        this.contenuMenuService.getAllContenus(this.queryBuild).subscribe((data) => {
            this.listeContenus = data;
            console.log(this.listeContenus);
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue']);
            console.log(err);
        });
    }

    supprimer(con: ContenuMenu) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet contenu ?')) {
            this.contenuMenuService.removeContenu(con.id).subscribe(dataSup => {
                this.notificationService.setNotification('success', ['Contenu supprimé.']);
                this.listeContenus = this.listeContenus!.filter(item => item.id !== con.id);
            }, err => {
                this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            });
        }
        
      }
      
    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        this.getAll();
    }

    reindexerArticle() {

        this.contenuMenuService.reindexerArticle().subscribe(() => {});
        // this.contenuMenuService.getContenuParentRecher().subscribe(lis=>{
        //   console.log(lis);
        // },err=>{
        //   this.notificationService.setNotification('danger',['Une erreur est survenue']);
        //   console.log(err);
        // });

        /*this.listeContenus.forEach(element => {
            console.log(element);
            if (element.menu.recherche && element.visible) {
                this.contenuMenuService.reindexerArticle(element).subscribe((data) => {
                    console.log(data);
                }, err => {
                    this.notificationService.setNotification('danger', ['Une erreur est survenue']);
                    console.log(err);
                });
            }
        });*/

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


}
