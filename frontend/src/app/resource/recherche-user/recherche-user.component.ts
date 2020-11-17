import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-recherche-user',
  templateUrl: './recherche-user.component.html',
  styleUrls: ['./recherche-user.component.scss']
})
export class RechercheUtilisateurComponent {
  @Input() type: string | null = null;
  @Output() emitType = new EventEmitter<string>();

  constructor() { }

  createNouveau() {
    this.emitType.emit('user');
  }

}
