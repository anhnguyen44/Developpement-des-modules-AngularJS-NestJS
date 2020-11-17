import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal-consommable',
  templateUrl: './modal-consommable.component.html',
  styleUrls: ['./modal-consommable.component.scss']
})
export class ModalConsommableComponent implements OnInit {
  @Input() nombreParCommande: number;
  @Output() emitNombreAAjouter = new EventEmitter<number>();
  @Output() emitClose = new EventEmitter();
  nombreAAjouter: number;
  constructor() { }

  ngOnInit() {
    this.nombreAAjouter = this.nombreParCommande;
  }

  setStock() {
    this.emitNombreAAjouter.emit(this.nombreAAjouter);
  }

  close() {
    this.emitClose.emit();
  }

}
