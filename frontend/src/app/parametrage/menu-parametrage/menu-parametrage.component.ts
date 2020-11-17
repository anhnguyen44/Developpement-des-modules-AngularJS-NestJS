import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserStore } from '../../resource/user/user.store';
import { Utilisateur } from '@aleaac/shared';
import { UserService } from '../../resource/user/user.service';
import { FranchiseService } from '../../resource/franchise/franchise.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { isNumber } from 'util';
import { NotificationService } from '../../notification/notification.service';

@Component({
  selector: 'app-menu-parametrage',
  templateUrl: './menu-parametrage.component.html',
  styleUrls: ['./menu-parametrage.component.scss']
})
export class MenuParametrageComponent implements OnInit {
  connectedUser: Utilisateur;
  activeMenu: string;
  activeAction: string;
  activeSousMenu: string;
  idEntite: number;
  canRenderInfoFranchise: Promise<boolean>;
  canRenderBureau: Promise<boolean>;
  canRenderUtilisateurs: Promise<boolean>;
  canRenderGrilles: Promise<boolean>;

  constructor(private route: ActivatedRoute, private userStore: UserStore,
    private userService: UserService,
    private notificationService: NotificationService) {
    this.userService.getUser().subscribe(data => {
      this.userStore.setUser(data);
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
  });
  }

  async ngOnInit() {
    // URL : nomEntite/action/sousMenu?/idEntite
    this.activeMenu = this.route.snapshot.url[0].path;
    if (this.route.snapshot.url.length > 1) {
      this.activeAction = this.route.snapshot.url[1].path;
    }

    if (this.route.snapshot.url.length > 2) {
      if (!isNaN(Number(this.route.snapshot.url[2].path))) {
        this.idEntite = parseInt(this.route.snapshot.url[2].path, 10);
      } else {
        this.activeSousMenu = this.route.snapshot.url[2].path;
        this.idEntite = parseInt(this.route.snapshot.url[3].path, 10);
      }
    }

    this.canRenderInfoFranchise = this.userStore.hasRight('INFO_FRANCHISE_READ');
    this.canRenderBureau = this.userStore.hasRight('INFO_FRANCHISE_READ');
    this.canRenderUtilisateurs = this.userStore.hasRight('USERS_CREATE');
    this.canRenderGrilles = this.userStore.hasRight('GRILLE_SEE');
  }
}
