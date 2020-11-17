import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LotFiltre} from '../LotFiltre';
import {FormBuilder, Validators} from '@angular/forms';
import {NotificationService} from '../../notification/notification.service';
import {ValidationService} from '../../resource/validation/validation.service';
import {LotFiltreService} from '../lot-filtre.service';
import {Router} from '@angular/router';
import {EnumTypeFiltre} from '@aleaac/shared';

@Component({
  selector: 'app-modal-blanc-lot-filtre',
  templateUrl: './modal-blanc-lot-filtre.component.html',
  styleUrls: ['./modal-blanc-lot-filtre.component.scss']
})
export class ModalBlancLotFiltreComponent implements OnInit {
  @Input() lotFiltre: LotFiltre;
  @Output() emitClose = new EventEmitter();
  enumTypeFilre = EnumTypeFiltre;
  submited: boolean = false;
    blancForm = this.formBuilder.group({
        idTypeFiltre: [''],
        bureau: [''],
        ref: [''],
        numeroPV: ['', [Validators.required]],
        dateReception: ['', [Validators.required]],
        fracFiltre: ['', [Validators.required]],
        surfaceFiltreSecondaire: ['', [Validators.required]],
        surfaceOuvertureGrille: ['', [Validators.required]],
        nombreGilleExam: ['', [Validators.required]],
        nombreOuvertureGrillesLues: ['', [Validators.required]],
        nombreFibresComptees: ['', [Validators.required]],
        resultat: ['', [Validators.required]],
        observationFiltre: ['', [Validators.required]],
        isConforme: [''],
    });
    champsInformations: Map<string, string> = new Map<string, string>([
        ['numeroPV', 'Le numéro PV'],
        ['dateReception', 'La date de réception'],
        ['fracFiltre', 'La fractoin par filtre'],
        ['surfaceFiltreSecondaire', 'La surface filtre secondaire'],
        ['surfaceOuvertureGrille', 'La surface d\'ouverture de grille'],
        ['nombreGilleExam', 'Le nombre de grille examinées'],
        ['nombreOuvertureGrillesLues', 'Le nombre d\'ouverture de grille lues'],
        ['nombreFibresComptees', 'Le nombre de fibre comptées'],
        ['resultat', 'Le résultat'],
    ]);

  constructor(
      private formBuilder: FormBuilder,
      private notificationService: NotificationService,
      private validationService: ValidationService,
      private lotFiltreService: LotFiltreService,
      private router: Router
  ) { }

  ngOnInit() {
    this.blancForm.patchValue(this.lotFiltre);
    this.blancForm.get('surfaceOuvertureGrille')!.valueChanges.subscribe(() => {
        this.calculResultat();
    });
    this.blancForm.get('nombreOuvertureGrillesLues')!.valueChanges.subscribe(() => {
        this.calculResultat();
    });
    this.blancForm.get('surfaceFiltreSecondaire')!.valueChanges.subscribe(() => {
        this.calculResultat();
    });
    this.blancForm.get('resultat')!.valueChanges.subscribe(() => {
        this.calculResultat();
    });
  }

  onSubmit({value, valid}: {value: LotFiltre, valid: boolean}) {

      if (valid) {
          value.idBureau = value.bureau.id;
          value.idFranchise = this.lotFiltre.idFranchise;
          value.id = this.lotFiltre.id;
          this.lotFiltreService.update(value).subscribe(() => {
            this.notificationService.setNotification('success', ['Blanc validé avec succès.']);
            this.router.navigate(['/logistique', 'lot-filtre']);
          });
      } else {
          this.submited = true;
          this.notificationService.setNotification('danger',
              this.validationService.getFormValidationErrors(this.blancForm, this.champsInformations)
          );
      }
  }

  calculResultat() {
      if (this.blancForm.get('surfaceOuvertureGrille')!.value &&
          this.blancForm.get('nombreOuvertureGrillesLues')!.value &&
          this.blancForm.get('surfaceFiltreSecondaire')!.value) {
          const observationFiltre = ((this.blancForm.get('surfaceOuvertureGrille')!.value *
              this.blancForm.get('nombreOuvertureGrillesLues')!.value /
              this.blancForm.get('surfaceFiltreSecondaire')!.value) * 10000 ).toFixed(4);
          this.blancForm.patchValue({observationFiltre: observationFiltre});
          if (this.enumTypeFilre['43-269'] === this.blancForm.get('idTypeFiltre')!.value) {
              if (Number(observationFiltre) >= 15) {
                  this.blancForm.patchValue({isConforme: true});
              } else {
                  this.blancForm.patchValue({isConforme: false});
              }
          }
      }
      console.log(this.blancForm);
      if (this.blancForm.get('resultat') && this.blancForm.get('resultat')!.value
          && this.enumTypeFilre['43-050'] === this.blancForm.get('idTypeFiltre')!.value) {
          if (this.blancForm.get('resultat')!.value < 15) {
              this.blancForm.patchValue({isConforme: true});
          } else {
              this.blancForm.patchValue({isConforme: false});
          }
      }
  }

  close() {
    this.emitClose.emit();
  }

}
