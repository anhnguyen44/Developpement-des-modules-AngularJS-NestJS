import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notification } from '@aleaac/shared';
import { NotificationUserService } from '../resource/notif-user/notif-user.service';
import { Recherchable } from '../resource/query-builder/recherche/Recherchable';
import { QueryBuild } from '../resource/query-builder/QueryBuild';
import { ChampDeRecherche } from '../resource/query-builder/recherche/ChampDeRecherche';
import { Order } from '../resource/query-builder/order/Order';
import { MenuService } from '../menu/menu.service';
import { FranchiseService } from '../resource/franchise/franchise.service';
import { UserStore } from '../resource/user/user.store';
import { NotificationService } from '../notification/notification.service';
import { NotificationVuPar } from '@aleaac/shared';

@Component({
    selector: 'app-notification-user',
    templateUrl: './notif-user.component.html',
    styleUrls: ['./notif-user.component.scss']
})
export class NotificationUserComponent implements OnInit, Recherchable {
    compareFn = this._compareFn.bind(this);
    notifications: Notification[];
    idUser: number;
    queryBuild: QueryBuild = new QueryBuild();
    champDeRecherches: ChampDeRecherche[] = [
        new ChampDeRecherche('Nom', 'text', 'bureau.nom', true)
    ];
    headers: Order[] = [
        new Order(' ', 'grow0', false),
        new Order(' ', 'grow0', false),
        new Order(' ', '', false),
        new Order(' ', '', false),
        new Order('Action', 'action'),
    ];

    constructor(
        private notificationUserService: NotificationUserService,
        private menuService: MenuService,
        private franchiseService: FranchiseService,
        private userStore: UserStore,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.userStore.user.subscribe(user => {
            this.idUser = user.id;
            this.getNotifs(user.id);
        });
    }

    getNotifs(idUser: number) {
        if (idUser) {
            this.notificationUserService.getAllNotification(idUser).subscribe((res) => {
                this.notifications = res;
            });
        }
    }

    gotoDetails(lien: string, isNewWindow: boolean = false) {
        if (isNewWindow) {
            window.open(lien);
        } else {
            this.router.navigateByUrl(lien, {
                replaceUrl: true
            });
        }
    }

    setQueryBuild(queryBuild) {
        this.queryBuild = queryBuild;
        if (this.idUser) {
            this.getNotifs(this.idUser);
        }
    }

    markAsRead(notification?: Notification) {
        if (notification) {
            const vupar = new NotificationVuPar();
            vupar.idNotification = notification.id;
            vupar.idUtilisateur = this.idUser;
            vupar.date = new Date();

            if (!notification.vuePar) {
                notification.vuePar = [];
            }

            notification.vuePar.push(vupar);
            this.notificationUserService.updateNotification(notification).subscribe(res => {
                notification.vu = true;
            });
        } else {
            for (const notif of this.notifications) {
                if (!notif.vu) {
                    this.markAsRead(notif);
                }
            }
        }
    }

    _compareFn(a, b) {
        // Handle compare logic (eg check if unique ids are the same)
        return a && b ? a.id === b.id : false;
    }
}
