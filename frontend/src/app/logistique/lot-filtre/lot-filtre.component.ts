import { Component, OnInit } from '@angular/core';
import {MenuService} from '../../menu/menu.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Filtre} from '../Filtre';
import {FormBuilder, Validators} from '@angular/forms';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {Franchise} from '../../resource/franchise/franchise';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {ValidationService} from '../../resource/validation/validation.service';
import {NotificationService} from '../../notification/notification.service';
import {LotFiltre} from '../LotFiltre';
import {LotFiltreService} from '../lot-filtre.service';
import {EnumTypeFiltre} from '@aleaac/shared';
import * as FileSaver from 'file-saver';
import {FiltreService} from '../filtre.service';

@Component({
  selector: 'app-lot-filtre',
  templateUrl: './lot-filtre.component.html',
  styleUrls: ['./lot-filtre.component.scss']
})
export class LotFiltreComponent implements OnInit {
    keys: any[];
    enumTypeFiltre = EnumTypeFiltre;
  franchise: Franchise;
  bureaux: Bureau[];
  submited: boolean = false;
  modalBlancLotFiltre: boolean = false;
  lotFiltreForm = this.formBuilder.group({
      ref: ['', [Validators.required]],
      bureau: ['', [Validators.required]],
      idTypeFiltre: ['', [Validators.required]]
      });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['libelle', 'Le libellé'],
        ['ref', 'Le référence'],
        ['lot', 'le lot'],
        ['bureau', 'le bureau']
    ]);
  lotFiltre: LotFiltre;
  constructor(
      private formBuilder: FormBuilder,
      private menuService: MenuService,
      private route: ActivatedRoute,
      private lotFiltreService: LotFiltreService,
      private filtreService: FiltreService,
      private franchiseService: FranchiseService,
      private bureauService: BureauService,
      private validationService: ValidationService,
      private notificationService: NotificationService,
      private router: Router
  ) { }

  ngOnInit() {
      this.keys = Object.keys(this.enumTypeFiltre).filter(Number);
      this.menuService.setMenu([
        ['Logistique', '/logistique/lot-filtre'],
        ['Lots de filtres', '/logistique/lot-filtre'],
        ['Informations du lot', ''],
      ]);
      this.franchiseService.franchise.subscribe((franchise) => {
        this.franchise = franchise;
        this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
          this.bureaux = bureaux;
        });
      });
      this.route.params.subscribe((params) => {
        if (params.id) {
          this.lotFiltreService.get(params.id).subscribe((filtre) => {
            this.lotFiltre = filtre;
            this.lotFiltre.ref = this.lotFiltre.ref.substr(4);
            this.lotFiltreForm.patchValue(this.lotFiltre);
            console.log(this.lotFiltre);
          });
        } else {
          this.lotFiltre = new LotFiltre();
          this.lotFiltre.idFranchise = this.franchise.id;
          this.lotFiltreForm.patchValue(this.lotFiltre);
        }
      });
  }

  onSubmit({value, valid}: {value: LotFiltre, valid: boolean}) {
    if (valid) {
        value.idBureau = value.bureau.id;
        value.idFranchise = this.lotFiltre.idFranchise;
      if (this.lotFiltre.id) {
          value.id = this.lotFiltre.id;
          this.lotFiltreService.update(value).subscribe(() => {
              this.notificationService.setNotification('success', ['Lot filtre mis à jour correctement.']);
              this.router.navigate(['/logistique', 'lot-filtre']);
          }, () => {
              this.notificationService.setNotification('danger', ['La référence doit être unique.']);
          });
      } else {
          this.lotFiltreService.create(value).subscribe(() => {
              this.notificationService.setNotification('success', ['Lot filtre créé correctement.']);
              this.router.navigate(['/logistique', 'lot-filtre']);
          }, () => {
              this.notificationService.setNotification('danger', ['La référence doit être unique.']);
          });
      }
    } else {
      this.submited = true;
      this.notificationService.setNotification('danger',
          this.validationService.getFormValidationErrors(this.lotFiltreForm, this.champsInformations)
      );
    }
  }

  compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
  }

  envoyerBlanc() {
      this.lotFiltre.dateEnvoi = new Date();
      this.lotFiltreService.update(this.lotFiltre).subscribe(() => {
          this.notificationService.setNotification('success', ['Blanc du lot envoyé.']);
          this.router.navigate(['/logistique', 'lot-filtre']);
      });
  }

  receptionBlanc() {
      this.modalBlancLotFiltre = true;
  }

  closeModalBlancLotFiltre() {
      this.modalBlancLotFiltre = false;
  }

  genererPlancheEtiquette() {
      this.lotFiltreService.genererPlancheEtiquette(this.lotFiltre.id).subscribe((file) => {
          const filename = this.lotFiltre.ref + '.docx';
          FileSaver.saveAs(file, filename);
      });
  }

  deleteFiltre(filtre) {
      this.filtreService.delete(filtre).subscribe(() => {
          this.lotFiltre.filtres = this.lotFiltre.filtres.filter((filtreFilter) => {
              return filtreFilter.id !== filtre.id;
          });
      });
  }

}
