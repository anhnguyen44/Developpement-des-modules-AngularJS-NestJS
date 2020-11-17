import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Prelevement} from '../../../processus/Prelevement';
import {Debitmetre} from '../../../logistique/Debitmetre';
import {EnumPointPrelevement} from '@aleaac/shared';

@Component({
  selector: 'app-prelevement-mest',
  templateUrl: './prelevement-mest.component.html',
  styleUrls: ['./prelevement-mest.component.scss']
})
export class PrelevementMestComponent implements OnInit {
  @Input() prelevement: Prelevement;
  @Input() isEditable: boolean;
  @Output() emitPrelevement = new EventEmitter<Prelevement>();
  keysPointPrelevement: any;
  enumPointPrelevement = EnumPointPrelevement;

  constructor() { }

  ngOnInit() {
    this.keysPointPrelevement = Object.keys(this.enumPointPrelevement).filter(Number);
  }

  checkPrelevement() {
    this.emitPrelevement.emit(this.prelevement);
  }

}
