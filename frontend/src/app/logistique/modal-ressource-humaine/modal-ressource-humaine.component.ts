import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Pompe} from '../Pompe';
import {RessourceHumaine} from '../RessourceHumaine';
import {RendezVous} from '../RendezVous';

@Component({
  selector: 'app-modal-ressource-humaine',
  templateUrl: './modal-ressource-humaine.component.html',
  styleUrls: ['./modal-ressource-humaine.component.scss']
})
export class ModalRessourceHumaineComponent implements OnInit {
  @Output() emitRessourceHumaine = new EventEmitter<RessourceHumaine>();
  @Output() emitClose = new EventEmitter();
  @Input() ressourceHumainesAjoutees: RessourceHumaine[];
  @Input() idBureau: number | null;
  @Input() rendezVous: RendezVous | null;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.emitClose.emit();
  }

}
