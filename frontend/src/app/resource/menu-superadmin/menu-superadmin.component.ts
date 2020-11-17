import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../resource/user/user.service';
import { UserStore } from '../../resource/user/user.store';
import { profils } from '@aleaac/shared/src/models/profil.model';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-menu-superadmin',
  templateUrl: './menu-superadmin.component.html',
  styleUrls: ['./menu-superadmin.component.scss']
})
export class MenuSuperadminComponent implements OnInit {
  activeMenu: string;
  isDev: Promise<boolean>;

  constructor(private route: ActivatedRoute, private userService: UserService,
    private userStore: UserStore,
    private notificationService: NotificationService) {
    this.userService.getUser().subscribe(data => {
      this.userStore.setUser(data);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  ngOnInit() {
    this.activeMenu = this.route.snapshot.url[0].path;
    this.userStore.user.subscribe(() => {
      // TODO gérer les droits
      this.isDev = this.userStore.hasProfil(profils.DEV);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

}
