import { Component, OnInit } from '@angular/core';
import { TypeFichier } from './TypeFichier';
import { TypeFichierService } from '../type-fichier.service';
import { NotificationService } from '../../../notification/notification.service';
import { fadeIn, fadeOut } from '../../../resource/animation';
import { MenuService } from '../../../menu/menu.service';
import { EnumTypeFichierGroupe } from '@aleaac/shared';

@Component({
  selector: 'app-type-fichier',
  templateUrl: './type-fichier.component.html',
  styleUrls: ['./type-fichier.component.scss'],
  animations: [fadeIn, fadeOut]
})
export class TypeFichierComponent implements OnInit {
  typeFichier: TypeFichier | null;
  typeFichiers: TypeFichier[];

  constructor(
    private typeFichierService: TypeFichierService,
    private notificationService: NotificationService,
    private menuService: MenuService,
  ) { }

  ngOnInit() {
    this.menuService.setMenu([
      ['Super admin', '/superadmin'],
      ['Types de fichiers', '']
    ]);
    this.typeFichierService.getAll().subscribe((typeFichiers) => {
      this.typeFichiers = typeFichiers;
    }, err => {
      this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
      console.error(err);
    });
  }

  ajoutTypeFichier() {
    this.typeFichier = new TypeFichier();
  }

  editTypeFichier(typeFichier) {
    this.typeFichier = typeFichier;
  }

  setTypeFichier(typeFichier) {
    this.typeFichier = null;
    if (typeFichier) {
      if (typeFichier.id) {
        this.typeFichierService.update(typeFichier).subscribe((newTypeFichier) => {
          typeFichier = newTypeFichier;
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.error(err);
        });
      } else {
        this.typeFichierService.add(typeFichier).subscribe((newTypeFichier) => {
          this.notificationService.setNotification('success', ['Type fichier ajouté correctement.']);
          this.typeFichiers.push(newTypeFichier);
        }, err => {
          this.notificationService.setNotification('danger', ['Une erreur est survenue.']);
          console.error(err);
        });
      }
    }
  }
}
