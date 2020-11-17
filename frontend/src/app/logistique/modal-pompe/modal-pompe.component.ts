import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Pompe} from '../Pompe';
import {RendezVous} from '../RendezVous';
import {RendezVousPompe} from '../RendezVousPompe';

@Component({
  selector: 'app-modal-pompe',
  templateUrl: './modal-pompe.component.html',
  styleUrls: ['./modal-pompe.component.scss']
})
export class ModalPompeComponent implements OnInit {
  @Output() emitPompe = new EventEmitter<Pompe>();
  @Output() emitClose = new EventEmitter();
  @Input() pompesAjoutees: RendezVousPompe[];
  @Input() idBureau: Number | null;
  @Input() rendezVous: RendezVous | null;

  constructor() { }

  ngOnInit() {}

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.emitClose.emit();
  }

}
