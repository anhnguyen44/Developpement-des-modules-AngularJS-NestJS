import {Component, EventEmitter, Input, OnInit, Output, HostListener} from '@angular/core';

@Component({
  selector: 'app-modal-icone',
  templateUrl: './modal-icone.component.html',
  styleUrls: ['./modal-icone.component.scss']
})
export class ModalIconeComponent implements OnInit {
  @Output() emitIcone = new EventEmitter<string>();
  @Input() test;
  @Input() listeIcone;


  closed: boolean = false;

  constructor() { }

  ngOnInit() {
    console.log('Model icon welcome');
  }

  setIcone(icone) {
    // console.log(icone);
    this.emitIcone.emit(icone);
  }

  close(){
    this.emitIcone.emit('');
  }
}
