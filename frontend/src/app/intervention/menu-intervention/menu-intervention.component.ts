import {Component, Input, OnInit} from '@angular/core';
import {Intervention} from '../Intervention';
import {EnumStatutIntervention} from '@aleaac/shared';

@Component({
  selector: 'app-menu-intervention',
  templateUrl: './menu-intervention.component.html',
  styleUrls: ['./menu-intervention.component.scss']
})
export class MenuInterventionComponent implements OnInit {
  enumStatutIntervention = EnumStatutIntervention;
  @Input() type: string;
  @Input() intervention: Intervention;
  @Input() isNew: boolean;

  constructor() { }

  ngOnInit() {
    console.log(this.isNew);
  }

}
