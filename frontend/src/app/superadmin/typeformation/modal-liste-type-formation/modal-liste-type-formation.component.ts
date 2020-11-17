import {Component, ElementRef, EventEmitter, Input, Output, HostListener} from '@angular/core';
import { TypeFormation } from '../type-formation/TypeFormation';

@Component({
  selector: 'app-modal-liste-type-formation',
  templateUrl: './modal-liste-type-formation.component.html',
  styleUrls: ['./modal-liste-type-formation.component.scss']
})
export class ModalListeTypeFormation{
  @Output() emitClose = new EventEmitter();
  @Output() emitTypeFormation= new EventEmitter<TypeFormation>();

  constructor(private elmRef: ElementRef) {}

 
  close() {
      this.emitClose.emit();
  }

  setTypeFormation(e){
    console.log(e);
    this.emitTypeFormation.emit(e);
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.close();
  }
}
