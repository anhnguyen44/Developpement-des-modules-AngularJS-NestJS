import { Component, OnInit } from '@angular/core';
import {Franchise} from '../../resource/franchise/franchise';
import {Bureau} from '../../parametrage/bureau/Bureau';
import {FormBuilder, Validators} from '@angular/forms';
import {Consommable} from '../Consommable';
import {StationMeteo} from '../StationMeteo';
import {MenuService} from '../../menu/menu.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConsommableService} from '../consommable.service';
import {FranchiseService} from '../../resource/franchise/franchise.service';
import {BureauService} from '../../parametrage/bureau/bureau.service';
import {ValidationService} from '../../resource/validation/validation.service';
import {NotificationService} from '../../notification/notification.service';
import {QueryBuild} from '../../resource/query-builder/QueryBuild';
import {StationMeteoService} from '../station-meteo.service';

@Component({
  selector: 'app-station-meteo',
  templateUrl: './station-meteo.component.html',
  styleUrls: ['./station-meteo.component.scss']
})
export class StationMeteoComponent implements OnInit {
    franchise: Franchise;
    bureaux: Bureau[];
    submited: boolean = false;
    modalConsommable: boolean = false;
    stationMeteoForm = this.formBuilder.group({
        libelle: ['', [Validators.required]],
        ref: ['', [Validators.required]],
        bureau: ['', [Validators.required]]
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['libelle', 'Le libellé'],
        ['ref', 'Le référence'],
        ['bureau', 'le bureau']
    ]);
    stationMeteo: StationMeteo;
  constructor(
      private formBuilder: FormBuilder,
      private menuService: MenuService,
      private route: ActivatedRoute,
      private stationMeteoService: StationMeteoService,
      private franchiseService: FranchiseService,
      private bureauService: BureauService,
      private validationService: ValidationService,
      private notificationService: NotificationService,
      private router: Router
  ) { }

  ngOnInit() {
      this.menuService.setMenu([
          ['Logistique', '/logistique'],
          ['Station Météo', '/logistique/station-meteo'],
          ['Informations de la station', ''],
      ]);
      this.franchiseService.franchise.subscribe((franchise) => {
          this.franchise = franchise;
          this.bureauService.getAll(this.franchise.id, new QueryBuild()).subscribe((bureaux) => {
              this.bureaux = bureaux;
          });
      });
      this.route.params.subscribe((params) => {
          if (params.id) {
              this.stationMeteoService.get(params.id).subscribe((stationMeteo) => {
                  this.stationMeteo = stationMeteo;
                  this.stationMeteoForm.patchValue(this.stationMeteo);
              });
          } else {
              this.stationMeteo = new StationMeteo();
              this.stationMeteo.idFranchise = this.franchise.id;
              this.stationMeteoForm.patchValue(this.stationMeteo);
          }
      });
  }

    onSubmit({value, valid}: {value: Consommable, valid: boolean}) {
        if (valid) {
            value.idBureau = value.bureau.id;
            value.idFranchise = this.stationMeteo.idFranchise;
            if (this.stationMeteo.id) {
                value.id = this.stationMeteo.id;
                this.stationMeteoService.update(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Station météo mise à jour correctement.']);
                    this.router.navigate(['/logistique', 'station-meteo']);
                });
            } else {
                this.stationMeteoService.create(value).subscribe(() => {
                    this.notificationService.setNotification('success', ['Station météo créée correctement.']);
                    this.router.navigate(['/logistique', 'station-meteo']);
                });
            }
        } else {
            this.submited = true;
            this.notificationService.setNotification('danger',
                this.validationService.getFormValidationErrors(this.stationMeteoForm, this.champsInformations)
            );
        }
    }

    compare(val1, val2) {
        if (val1 && val2) {
            return val1.id === val2.id;
        }
    }
}
