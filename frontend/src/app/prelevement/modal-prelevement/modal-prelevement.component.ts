import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Prelevement} from 'app/processus/Prelevement';
import {Intervention} from '../../intervention/Intervention';

@Component({
  selector: 'app-modal-prelevement',
  templateUrl: './modal-prelevement.component.html',
  styleUrls: ['./modal-prelevement.component.scss']
})
export class ModalPrelevementComponent implements OnInit {
  @Input() idParent: number;
  @Input() application: number;
  @Input() typeModal: string;
  @Input() nonPreleve: boolean = false;
  @Input() intervention: Intervention;
  @Input() idChantier: number;
  @Output() emitClose = new EventEmitter();
  @Output() emitPrelevements = new EventEmitter<Prelevement[]>();

  constructor() { }

  ngOnInit() {

  }

}
