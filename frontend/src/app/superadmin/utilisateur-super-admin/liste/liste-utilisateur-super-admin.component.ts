import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../../menu/menu.service';

@Component({
  selector: 'app-utilisateur-liste-super-admin',
  templateUrl: './liste-utilisateur-super-admin.component.html',
  styleUrls: ['./liste-utilisateur-super-admin.component.scss']
})
export class ListeUtilisateurSuperAdminComponent implements OnInit {
  isSuperAdmin: boolean = true;

  constructor(private menuService: MenuService,
    private route: ActivatedRoute) {
   }

  ngOnInit() {
      this.menuService.setMenu([
          ['Super admin', '/superadmin'],
          ['Utilisateurs', '']
      ]);
  }
}
