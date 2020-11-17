import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';

@Component({
  selector: 'app-utilisateur-super-admin',
  templateUrl: './utilisateur-super-admin.component.html',
  styleUrls: ['./utilisateur-super-admin.component.scss']
})
export class UtilisateurSuperAdminComponent implements OnInit {
  superAdminId: number;

  constructor(private menuService: MenuService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.superAdminId = params['id'];
       // console.log(this.superAdminId);
      if (!this.superAdminId) {
        this.superAdminId = 0;
      }
    });
   }

  ngOnInit() {
      this.menuService.setMenu([
          ['Super admin', '/superadmin'],
          ['Utilisateurs', '/superadmin/utilisateur/liste'],
          ['Informations', '']
      ]);
  }

}
