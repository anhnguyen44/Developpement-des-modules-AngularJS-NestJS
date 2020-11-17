import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../resource/user/user.service';
import { UserStore } from '../../resource/user/user.store';

@Component({
  selector: 'app-menu-activite',
  templateUrl: './menu-activite.component.html',
  styleUrls: ['./menu-activite.component.scss']
})
export class MenuActiviteComponent implements OnInit {
  activeMenu: string;
  idActivite: number;
  isActiviteModule: boolean;

  constructor(private route: ActivatedRoute, private userService: UserService, private userStore: UserStore) {

  }

  ngOnInit() {
    this.activeMenu = this.route.snapshot.url[0].path;
    const activeMenu = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
    if (activeMenu === 'modifier' || activeMenu === 'ajouter') {
      this.activeMenu = 'information';
    } else {
      this.activeMenu = activeMenu;
    }


    if (this.route.snapshot.url[this.route.snapshot.url.length - 1].path !== 'ajouter') {
        this.route.params.subscribe((data) => {
            this.idActivite = data.id;
        });
    }

  }
}
