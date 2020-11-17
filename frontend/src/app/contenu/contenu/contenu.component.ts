import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ContenuMenuService} from '../../resource/menu/contenu-menu.service';
import {ContenuMenu} from '@aleaac/shared';
import {MenuService} from '../../menu/menu.service';
import {NotificationService} from '../../notification/notification.service';

@Component({
    selector: 'app-contenu',
    templateUrl: './contenu.component.html',
    styleUrls: ['./contenu.component.scss']
})
export class ContenuComponent implements OnInit {
    id: number;
    express: string;
    contenuAffi: ContenuMenu;
    contenuCreate: ContenuMenu;


    constructor(
        private route: ActivatedRoute,
        private contenuMenuService: ContenuMenuService,
        private menuService: MenuService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.id = params['id'];
            if (this.id) {
                this.getContentArticle();
            }
            this.express = params['expression'];
            console.log(this.express);
            if (this.express) {
                this.getContentArticleByExpresName();
            }
        });
    }

    getContentArticle() {
        this.contenuMenuService.getContenuById(this.id).subscribe(data4 => {
            console.log(data4);
            this.contenuAffi = data4;
            if (this.contenuAffi.menu.recherche) {
                this.menuService.setMenu([
                    ['Acceuil', '/dashboard'],
                    [this.transform(this.contenuAffi.menu.titre, ['20']), '/contenu/liste/' + this.contenuAffi.menu.id],
                    [this.transform(this.contenuAffi.libelleLien, ['20']), '']
                ]);
            } else {
                this.menuService.setMenu([
                    ['Acceuil', '/dashboard'],
                    [this.transform(this.contenuAffi.menu.titre, ['20']), ''],
                    [this.transform(this.contenuAffi.libelleLien, ['20']), '']
                ]);
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
        });
    }


    getContentArticleByExpresName() {
        this.contenuMenuService.getContenuByExpressName(this.express).subscribe(data6 => {
            console.log(data6);
            this.contenuAffi = data6;
            if (this.contenuAffi.menu.recherche) {
                this.menuService.setMenu([
                    ['Acceuil', '/dashboard'],
                    [this.transform(this.contenuAffi.menu.titre, ['20']), '/contenu/liste/' + this.contenuAffi.menu.id],
                    [this.transform(this.contenuAffi.libelleLien, ['20']), '']
                ]);
            } else {
                this.menuService.setMenu([
                    ['Acceuil', '/dashboard'],
                    [this.transform(this.contenuAffi.menu.titre, ['20']), ''],
                    [this.transform(this.contenuAffi.libelleLien, ['20']), '']
                ]);
            }
        }, err => {
            this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
            console.log(err);
        });
    }

    transform(value: string, args: string[]): string {
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }


}
