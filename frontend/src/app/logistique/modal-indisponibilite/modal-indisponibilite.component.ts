import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {RendezVous} from '../RendezVous';
import {Pompe} from '../Pompe';
import {NotificationService} from '../../notification/notification.service';
import {PompeService} from '../pompe.service';
import {RessourceHumaine} from '../RessourceHumaine';
import {Salle} from '../Salle';
import {RendezVousService} from '../rendez-vous.service';

@Component({
  selector: 'app-modal-indisponibilite',
  templateUrl: './modal-indisponibilite.component.html',
  styleUrls: ['./modal-indisponibilite.component.scss']
})
export class ModalIndisponibiliteComponent implements OnInit {
  @Input() pompe: Pompe;
  @Input() ressourceHumaine: RessourceHumaine;
  @Input() salle: Salle;
  @Input() rendezVous: RendezVous[];
  @Output() emitRendezVous = new EventEmitter<RendezVous>();
  @Output() emitClose = new EventEmitter();

  indispoForm = this.formBuilder.group({
      id: [null],
      dateHeureDebut: [''],
      dateDebut: ['', [Validators.required]],
      heureDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      heureFin: ['', [Validators.required]],
      dateHeureFin: [''],
      isAbsence: [true],
      isDefinitif: [true],
      nom: ['', [Validators.required]]
  });

  constructor(
      private formBuilder: FormBuilder,
      private notificationService: NotificationService,
      private rendezVousService: RendezVousService
  ) { }

  ngOnInit() {
      this.rendezVous = this.rendezVous.filter((rdv) => {
          return rdv != null;
      });
      console.log(this.rendezVous);
  }

  close() {
    this.emitClose.emit();
  }

    parseDateDebut() {
        if (this.indispoForm.get('dateDebut')!.value
            && this.indispoForm.get('heureDebut')!.value) {
            const newDateHeureDebut = new Date(this.indispoForm.get('dateDebut')!.value
                + ' ' + this.indispoForm.get('heureDebut')!.value);
            this.indispoForm.patchValue({dateHeureDebut: newDateHeureDebut});
        }
    }

    parseDateFin() {
        if (this.indispoForm.get('dateFin')!.value
            && this.indispoForm.get('heureFin')!.value) {
            const newDateHeureDebut = new Date(this.indispoForm.get('dateFin')!.value
                + ' ' + this.indispoForm.get('heureFin')!.value);
            this.indispoForm.patchValue({dateHeureFin: newDateHeureDebut});
        }
    }

    onSubmit({value, valid}: {value: RendezVous, valid: boolean}) {
      if (valid) {
          this.emitRendezVous.emit(value);
      } else {
          this.notificationService.setNotification('danger', ['Formulaire invalide.']);
      }
    }

    deleteIndispo(rendezVousToDel) {
      this.rendezVousService.delete(rendezVousToDel).subscribe(() => {
          this.rendezVous = this.rendezVous.filter((rdv) => {
              return rdv.id !== rendezVousToDel.id;
          });
          this.notificationService.setNotification('success', ['rendez vous supprimé correctement']);
      });
    }

}
